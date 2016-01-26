angular.module('editGroupController', ['ui.bootstrap','translationService', 'dntServices', 'saveService','valueServices'])
.controller('EditGroupCtrl',

['group', 'groupName', 'groupSummary','$uibModalInstance','$timeout','saveHelper','dntData','jobs','hCodeValues',
function(group, groupName, groupSummary,$uibModalInstance,$timeout,saveHelper,dntData,jobs,hCodeValues) {
  
  this.group = group;
  this.groupName = groupName;
  this.groupSummary = groupSummary;
  this.savedItems = saveHelper.getSavedItems();
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
    console.log('checking load status');
    if(!this.isLoading()) {
      $timeout( function() {
        console.log('all loaded - doing init');
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
  
  var jobConversions = 'rebootplayerweighttable.dnt';
  var jobConversionColsToLoad = {
    HP: true,StrengthAttack: true,AgilityAttack: true,IntelligenceAttack: true,PhysicalDefense: true,MagicDefense: true,Critical: true,CriticalResistance: true,Stiff: true,StiffResistance: true,Stun: true,StunResistance: true,MoveSpeed: true,MoveSpeedRevision: true,DownDelay: true,ElementAttack: true,ElementDefense: true,ElementDefenseMin: true,ElementDefenseMax: true,StrengthIntelligenceToCriticalDamage: true
  };
  var statCaps = 'playercommonleveltable.dnt';
  var statCapColsToLoad = {
    Cbase: true,
    Cdefense: true,
    Ccritical: true,
    Cfinaldamage: true,
    CcriticalDamage: true,
  };
  var jobBaseStats = 'playerleveltable.dnt';
  var jobBaseStatColsToLoad = {
    Strength:true,Agility:true,Intelligence:true,Stamina:true,AggroperPvE:true,BaseMP:true
  };
  var heroLevels = 'heroleveltable.dnt';
  var heroLevelPotentials = 'potentialtable_herolevel.dnt';
  
  function reportProgress(msg) {
    console.log('progress: ' + msg);
  }
  
  this.isLoading = function() {
    if(!jobs.isLoaded()) {
      console.log('jobs not loaded');
      if(!jobs.hasStartedLoading()) {
        init(this);
      }
      return true;      
    }
    
    var retVal = dntData.isLoaded(jobConversions) && dntData.isLoaded(statCaps) && dntData.isLoaded(jobBaseStats);
    return !retVal;
  }
  
  var vm = this;
  jobs.init(reportProgress, function() { vm.init(vm) });
  dntData.init(jobConversions, jobConversionColsToLoad, reportProgress, function() { vm.init(vm) });
  dntData.init(statCaps, statCapColsToLoad, reportProgress, function() { vm.init(vm) });
  dntData.init(jobBaseStats, jobBaseStatColsToLoad, reportProgress, function() { vm.init(vm) });
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

  this.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
  this.groupNameExists = function() {
    return groupName != this.groupName && this.groupName in this.savedItems;
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
    
    saveHelper.renameSavedGroup(
      groupName, 
      this.groupName,
      this.enemyLevel,
      this.playerLevel,
      this.heroLevel,
      this.job,
      this.damageType,
      this.element,
      enemyStatCaps, playerStatCaps, conversions, baseStats, heroStats);
    
    $uibModalInstance.close('ok');
  }
  
  this.setHeroStats = function() {
    this.heroStats = this.getHeroStats();
    console.log('got ' + this.heroStats.length + ' hero stats');
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