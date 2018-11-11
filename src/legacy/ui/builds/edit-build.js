(function () {
'use strict';

angular.module('dnsim').controller('EditBuildCtrl',
['$window','$location','$routeParams','$timeout','saveHelper','jobs','hCodeValues','character','region',
editBuildCtrl]);

function editBuildCtrl($window,$location,$routeParams,$timeout,saveHelper,jobs,hCodeValues,character,region) {
  'use strict';
  
  var vm = this;
  vm.savedItems = saveHelper.getSavedItems();
  vm.group = {};
  vm.newGroup = true;
  if('buildName' in $routeParams) {
      vm.groupName = $routeParams.buildName;
      if(vm.groupName in vm.savedItems) {
        vm.group = vm.savedItems[vm.groupName];
        vm.newGroup = false;
      }
  }
  else {
    vm.groupName = '';
  }
  vm.oldGroupName = vm.groupName;
  vm.heroStats = [];
  vm.elements = hCodeValues.elements;
  vm.damageTypes = hCodeValues.damageTypes;
  
  vm.initDamageType = function() {
    if(vm.job) {
      if(vm.group.damageType) {
        vm.damageType = vm.group.damageType;
      }
      else if(vm.newGroup && 'DamageType' in vm.job.d) {
        if(vm.job.d.DamageType) {
          vm.damageType = hCodeValues.damageTypes[2];
        }
        else {
          vm.damageType = hCodeValues.damageTypes[1];
        }
      }
      else {
        vm.damageType = hCodeValues.damageTypes[0];
      }
    }
  }

  vm.initDefaultElement = function() {
    var defaultElement = hCodeValues.elements[0];
    var defaultSecondaryElement = hCodeValues.elements[0];

    if(vm.job && vm.job.d) {
      var jobName = vm.job.d.EnglishName;
      if(jobName == 'CRUSADES' || jobName == 'INQUISITOR' || jobName == 'GUARDIAN' || jobName == 'SAINT' || jobName == 'SILVERHUNTER' || jobName == 'STINGBREEZER') {
        defaultElement = hCodeValues.elements[3];
        defaultSecondaryElement = hCodeValues.elements[3];
      }
      else if(jobName == 'RAVEN' || jobName == 'MAJESTY' || jobName == 'SOULEATER' || jobName == 'DARKSUMMONER' || jobName == 'ABYSSWALKER' || jobName == 'BLACKMARA' || jobName == 'PHYSICIAN') {
        defaultElement = hCodeValues.elements[4];
        defaultSecondaryElement = hCodeValues.elements[4];
      }
      else if(jobName == 'SALEANA' || jobName == 'RIPPER' || jobName == 'DARKAVENGER' || jobName == 'RANDGRID') {
        defaultElement = hCodeValues.elements[1];
        defaultSecondaryElement = hCodeValues.elements[1];
      }
      else if(jobName == 'ELESTRA' || jobName == 'AVALANCHE') {
        defaultElement = hCodeValues.elements[2];
        defaultSecondaryElement = hCodeValues.elements[2];
      }
      else if(jobName == 'ADEPT') {
        defaultElement = hCodeValues.elements[1];
        defaultSecondaryElement = hCodeValues.elements[2];
      }
      else if(jobName == 'LIGHTFURY') {
        defaultElement = hCodeValues.elements[3];
        defaultSecondaryElement = hCodeValues.elements[4];
      }
    }

    if(vm.newGroup) {
      vm.element = defaultElement;
      vm.secondaryElement = defaultSecondaryElement;
    }
    
    if(!vm.element) {
      vm.element = defaultElement;
    }

    if(!vm.secondaryElement) {
      vm.secondaryElement = defaultElement;
    }
  }
    
  if(vm.group.element) {
    vm.element = vm.group.element;
  }
  else {
    vm.element = hCodeValues.elements[0];
  }
    
  if(vm.group.secondaryElement) {
    vm.secondaryElement = vm.group.secondaryElement;
  }
  else {
    vm.secondaryElement = hCodeValues.elements[0];
  }

  if(!('critResist' in vm.group)) {
    vm.critResist = 20;
  }
  else {
    vm.critResist = vm.group.critResist;
  }

  if(!('eleResist' in vm.group)) {
    vm.eleResist = 0;
  }
  else {
    vm.eleResist = vm.group.eleResist;
  }

  if(vm.group.enemyLevel) {
    vm.enemyLevel = vm.group.enemyLevel;
  }
  else {
    vm.enemyLevel = 95;
  }
  
  if(vm.group.playerLevel) {
    vm.playerLevel = vm.group.playerLevel;
  }
  else {
    vm.playerLevel = 95;
  }
  
  if(vm.group.heroLevel && vm.group.heroLevel > 0) {
    vm.heroLevel = vm.group.heroLevel;
  }
  else {
    vm.heroLevel = 1;
  }
  
  vm.init = function() {
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

        vm.initDamageType();
        vm.initDefaultElement();
        vm.setHeroStats();
      });
    }
  }
  
  vm.setJob = function() {
    $window.scrollTo(0, 0);
    $timeout(function() {
      vm.initDamageType();
      vm.initDefaultElement();
    });
  }
  
  region.init();
  character.init(function() {
    vm.init();
  });
  
  vm.getStatCap = function(colName, useLevel) {
    return character.getStatCaps(useLevel)[colName];
  }
  vm.getJobConversion = function(colName) {
    return character.getConversions(vm.job.id)[colName];
  }
  vm.getJobBaseStat = function(colName) {
    return character.getBaseStats(vm.playerLevel, vm.job.id)[colName];
  }
  
  vm.invalidGroupName = function() {
    if(!vm.groupName) {
      return true;
    }
    
    if(vm.groupName in vm.savedItems) {
      if(vm.newGroup || vm.groupName != vm.oldGroupName) {
        return true;
      }
    }
    
    return false;
  }
  
  vm.ok = function() {
    var enemyStatCaps = character.getStatCaps(vm.enemyLevel);
    var playerStatCaps = character.getStatCaps(vm.playerLevel);
    var conversions = character.getConversions(vm.job.id);
    var baseStats = character.getBaseStats(vm.playerLevel, vm.job.id);
    var heroStats = character.getHeroStats(vm.heroLevel);
    
    if(vm.newGroup) {
      vm.oldGroupName = vm.groupName;
      saveHelper.importGroup(vm.groupName, []);
    }
    
    saveHelper.saveBuild(
      vm.oldGroupName, 
      vm.groupName,
      {
      enemyLevel: vm.enemyLevel,
      playerLevel: vm.playerLevel,
      heroLevel: vm.heroLevel,
      job: vm.job,
      damageType: vm.damageType,
      element: vm.element,
      secondaryElement: vm.secondaryElement,
      critResist: vm.critResist,
      eleResist: vm.eleResist,
      enemyStatCaps: enemyStatCaps, 
      playerStatCaps: playerStatCaps, 
      conversions: conversions,
      baseStats: baseStats,
      heroStats: heroStats
      });
    
    $location.path('/build');
    $location.search('buildName', vm.groupName);
  }
  
  vm.setHeroStats = function() {
    vm.heroStats = character.getHeroStats(vm.heroLevel);
    // console.log('got ' + vm.heroStats.length + ' hero stats');
  }
  
  $timeout(function() {
    var input = document.getElementById('groupNameInput');
    if(input) {
      input.focus();
      input.setSelectionRange(0, 9999);
    }
  });
}

})();