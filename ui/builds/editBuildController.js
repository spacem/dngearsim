angular.module('editBuildController', ['translationService', 'dntServices', 'saveService','valueServices'])
.controller('EditBuildCtrl',

['$location','$routeParams','$timeout','saveHelper','dntData','jobs','hCodeValues','itemColumnsToLoad',
function($location,$routeParams,$timeout,saveHelper,dntData,jobs,hCodeValues,itemColumnsToLoad) {
  'use strict';
  
  var vm = this;
  this.savedItems = saveHelper.getSavedItems();
  this.group = {};
  this.newGroup = true;
  if('groupName' in $routeParams) {
      this.groupName = $routeParams.groupName;
      if(this.groupName in this.savedItems) {
        this.group = this.savedItems[this.groupName];
        this.newGroup = false;
      }
  }
  else {
    this.groupName = '';
  }
  this.oldGroupName = this.groupName;
  this.heroStats = [];
  this.elements = hCodeValues.elements;
  this.damageTypes = hCodeValues.damageTypes;
  
  this.job = {id: -1, name: ''};
  if(this.group.damageType) {
    this.damageType = this.group.damageType;
  }
  else {
    this.damageType = hCodeValues.damageTypes[0];
  }
    
  if(this.group.element) {
    this.element = this.group.element;
  }
  else {
    this.element = hCodeValues.elements[0];
  }

  this.jobs = [this.job];
  if(this.group.enemyLevel) {
    this.enemyLevel = this.group.enemyLevel;
  }
  else {
    this.enemyLevel = 80;
  }
  
  if(this.group.playerLevel) {
    this.playerLevel = this.group.playerLevel;
  }
  else {
    this.playerLevel = 90;
  }
  
  if(this.group.heroLevel && this.group.heroLevel > 0) {
    this.heroLevel = this.group.heroLevel;
  }
  else {
    this.heroLevel = 1;
  }
  
  this.init = function(vm) {
    // console.log('checking load status');
    if(!this.isLoading()) {
      $timeout( function() {
        // console.log('all loaded - doing init');
        var newJobs = jobs.getFinalJobs();
        if('job' in vm.group) {
          angular.forEach(newJobs, function(value, key) {
            if(value.id == vm.group.job.id) {
              vm.job = value;
            }
          });
        }
        newJobs.splice(0, 0, vm.jobs[0]);
        vm.jobs = newJobs;
        vm.setHeroStats();
      });
    }
  }
  
  var jobConversions = 'rebootplayerweighttable.lzjson';
  var statCaps = 'playercommonleveltable.lzjson';
  var jobBaseStats = 'playerleveltable.lzjson';

  var heroLevels = 'heroleveltable.lzjson';
  var heroLevelPotentials = 'potentialtable_herolevel.lzjson';
  
  function reportProgress(msg) {
    // console.log('progress: ' + msg);
  }
  
  this.isLoading = function() {
    if(!jobs.isLoaded()) {
      // console.log('jobs not loaded');
      if(!jobs.hasStartedLoading()) {
        this.init(this);
      }
      return true;      
    }
    
    var retVal = dntData.isLoaded(jobConversions) && dntData.isLoaded(statCaps) && dntData.isLoaded(jobBaseStats);
    return !retVal;
  }
  
  jobs.init(reportProgress, function() { vm.init(vm) });
  dntData.init(jobConversions, itemColumnsToLoad.jobConversionColsToLoad, reportProgress, function() { vm.init(vm) });
  dntData.init(statCaps, itemColumnsToLoad.statCapColsToLoad, reportProgress, function() { vm.init(vm) });
  dntData.init(jobBaseStats, itemColumnsToLoad.jobBaseStatColsToLoad, reportProgress, function() { vm.init(vm) });
  dntData.init(heroLevels, null, reportProgress, function() { vm.init(vm) });
  dntData.init(heroLevelPotentials, null, reportProgress, function() { vm.init(vm) });
  
  this.getStatCap = function(colName, useLevel) {
    if(!this.isLoading() && useLevel > 0) {
      var index = dntData.findFast(statCaps, 'id', useLevel);
      if(index.length == 1) {
        return dntData.getValue(statCaps, index[0], colName);
      }
    }
    return 0;
  }
  this.getJobConversion = function(colName) {
    if(!this.isLoading() && this.job.id > 0) {
      var index = dntData.findFast(jobConversions, 'id', this.job.id);
      if(index.length == 1) {
        return dntData.getValue(jobConversions, index[0], colName);
      }
    }
    return 0;
  }
  this.getJobBaseStat = function(colName) {
    if(!this.isLoading() && this.playerLevel > 0 && this.job.id > 0) {
      var index = dntData.findFast(jobBaseStats, 'id', (Number(this.job.id) * 100) + Number(this.playerLevel) - 100);
      if(index.length == 1) {
        return dntData.getValue(jobBaseStats, index[0], colName);
      }
    }
    return 0;
  }
  
  this.invalidGroupName = function() {
    if(!this.groupName) {
      return true;
    }
    
    if(this.groupName in this.savedItems) {
      if(this.newGroup || this.groupName != this.oldGroupName) {
        return true;
      }
    }
    
    return false;
  }
  
  this.ok = function() {
    var enemyStatCaps = {};
    var playerStatCaps = {};
    var conversions = {};
    var baseStats = {};
    var heroStats = [];
    
    if(!this.isLoading()) {
     
      if(this.enemyLevel > 0) {
        var index = dntData.findFast(statCaps, 'id', this.enemyLevel);
        if(index.length == 1) {
          enemyStatCaps = dntData.getRow(statCaps, index[0]);
        }
      }
      if(this.playerLevel > 0) {
        var index = dntData.findFast(statCaps, 'id', this.playerLevel);
        if(index.length == 1) {
          playerStatCaps = dntData.getRow(statCaps, index[0]);
        }
      }
      if(this.job.id > 0) {
        var index = dntData.findFast(jobConversions, 'id', this.job.id);
        if(index.length == 1) {
          conversions = dntData.getRow(jobConversions, index[0]);
        }
      }
      if(this.playerLevel > 0 && this.job.id > 0) {
        var index = dntData.findFast(jobBaseStats, 'id', (Number(this.job.id) * 100) + Number(this.playerLevel) - 100);
        if(index.length == 1) {
          baseStats = dntData.getRow(jobBaseStats, index[0]);
        }
      }
      
      heroStats = this.getHeroStats();
    }
    
    if(this.newGroup) {
      this.oldGroupName = this.groupName;
      saveHelper.importGroup(this.groupName, []);
    }
    
    saveHelper.renameSavedGroup(
      this.oldGroupName, 
      this.groupName,
      this.enemyLevel,
      this.playerLevel,
      this.heroLevel,
      this.job,
      this.damageType,
      this.element,
      enemyStatCaps, playerStatCaps, conversions, baseStats, heroStats);
    
    $location.path('/builds/' + this.groupName)
  }
  
  this.setHeroStats = function() {
    this.heroStats = this.getHeroStats();
    // console.log('got ' + this.heroStats.length + ' hero stats');
  }
  
  this.getHeroStats = function() {
    var heroStats = [];
    if(!this.isLoading() && this.heroLevel > 0) {
      var index = dntData.findFast(heroLevels, 'id', this.heroLevel);
      if(index.length == 1) {
        var h = dntData.getRow(heroLevels, index[0]);
        if(h != null) {
          var pIndex = dntData.findFast(heroLevelPotentials, 'PotentialID', h.HeroLevelAbilityID);
          if(pIndex.length == 1) {
            var p = dntData.getRow(heroLevelPotentials, pIndex[0]);
            if(p != null) {
              heroStats = hCodeValues.getStats(p);
            }
          }
        }
      }
    }
    
    return heroStats;
  }
  
  $timeout(function() {
    var input = document.getElementById('groupNameInput');
    input.focus();
    input.setSelectionRange(0, 9999);
  });
}]); 