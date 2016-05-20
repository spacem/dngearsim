angular.module('dnsim').controller('EditBuildCtrl',

['$location','$routeParams','$timeout','saveHelper','dntData','jobs','hCodeValues','itemColumnsToLoad','character',
function($location,$routeParams,$timeout,saveHelper,dntData,jobs,hCodeValues,itemColumnsToLoad,character) {
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
    this.enemyLevel = 90;
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
    var newJobs = jobs.getFinalJobs();
    if(newJobs.length > 0) {
      $timeout( function() {
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
  
  function reportProgress(msg) {
    // console.log('progress: ' + msg);
  }
  
  character.init(function() { vm.init(vm) });
  
  this.getStatCap = function(colName, useLevel) {
    return character.getStatCaps(useLevel)[colName];
  }
  this.getJobConversion = function(colName) {
    return character.getConversions(this.job.id)[colName];
  }
  this.getJobBaseStat = function(colName) {
    return character.getBaseStats(this.playerLevel, this.job.id)[colName];
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
    var enemyStatCaps = character.getStatCaps(this.enemyLevel);
    var playerStatCaps = character.getStatCaps(this.playerLevel);
    var conversions = character.getConversions(this.job.id);
    var baseStats = character.getBaseStats(this.playerLevel, this.job.id);
    var heroStats = character.getHeroStats(this.heroLevel);
    
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
    
    $location.path('/builds/' + this.groupName);
  }
  
  this.setHeroStats = function() {
    this.heroStats = character.getHeroStats(this.heroLevel);
    // console.log('got ' + this.heroStats.length + ' hero stats');
  }
  
  $timeout(function() {
    var input = document.getElementById('groupNameInput');
    if(input) {
      input.focus();
      input.setSelectionRange(0, 9999);
    }
  });
}]); 