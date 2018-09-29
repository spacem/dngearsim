(function () {
'use strict';

angular.module('dnsim').directive('dngearsimSkillSearch', function() {
  return {
    scope: {},
    bindToController: {
      job: '=job',
      jobs: '=jobs',
    },
    controller: ['$timeout','region','jobs','translations','dntData','hCodeValues','itemCategory','$location','exportLinkHelper', skillSearchCtrl],
    controllerAs: 'skillSearch',
    templateUrl: 'ui/search/skill-search.html'
  };
});

function skillSearchCtrl($timeout,region, jobs, translations,dntData,hCodeValues,itemCategory,$location,exportLinkHelper) {

  var vm = this;
  
  vm.allJobs = [];
  vm.dntName = '';
  vm.skills = [];
  vm.loadedJobId = -1;

  vm.itemCategory = itemCategory.byName('skills');

  vm.nameSearch = localStorage.getItem('nameSearch');
  if(!vm.nameSearch) {
    vm.nameSearch = '';
  }
  
  region.init();
  if(translations.isLoaded()) {
    init();
  }
  else {
    translations.init(reportProgress, function() { $timeout(init); } );
  }

  vm.navigate = function() {
    $timeout(function() {
      if(vm.itemCategory) {
        $location.path(vm.itemCategory.path);
      }
    });
  }
  
  vm.isLoading = function() {
    
    if(!translations.isLoaded()) {
      // console.log('transations not loaded');
      if(!translations.startedLoading) {
        translations.init(reportProgress, function() { } );
      }

      return true;
    }
    
    var baseName = jobs.getBaseJobName(vm.job);
    var dntName = getDntName(baseName);
    if(dntName) {
      if(!dntData.isLoaded(dntName)) {
        return true;
      }
    }

    return false;
  };
  
  function getDntName(baseClassName) {
    // console.log('got base class :' + baseClassName);
    if(baseClassName != null) {
      return 'skilltable_character' + baseClassName.toLowerCase() + '.json';
    }
    else {
      return null;
    }
  }
  
  function getLevelDntName(baseClassName) {
    // console.log('got base class :' + baseClassName);
    if(baseClassName != null) {
      return 'skillleveltable_character' + baseClassName.toLowerCase() + 'pve.json';
    }
    else {
      return null;
    }
  }

  function getSkills() {
    // console.log('getting skills for ' + vm.job.name);
    if(vm.loadedJobId == vm.job.id) {
      return vm.skills;
    }
    else {
      
      var baseJobNames = [];
      if(vm.job.id >= 0) {
        var baseName = jobs.getBaseJobName(vm.job);
        baseJobNames.push(baseName);
      }

      angular.forEach(baseJobNames, function(baseName, index) {
        var dntName = getDntName(baseName);
        var levelDntName = getLevelDntName(baseName);
        if(dntName) {
          if(!dntData.isLoaded(dntName)) {
            // console.log('loading skills for ' + baseName);
            dntData.init(dntName, null, reportProgress, function() {
              $timeout();
            });
          }
          else if(!dntData.isLoaded(levelDntName)) {
            // console.log('loading skills for ' + baseName);
            dntData.init(levelDntName, null, reportProgress, function() {
              $timeout();
            });
          }
          else {
            setupSkills(baseJobNames, vm.job);
          }
        }
      });
    }
  }
  
  function setupSkills(baseJobNames, job) {
    
    vm.skills = [];
    var allReady = true;
    angular.forEach(baseJobNames, function(baseName, index) {
      var dntName = getDntName(baseName);
      if(!dntData.isLoaded(dntName)) {
        allReady = false;
      }
    });
    
    if(allReady) {
      angular.forEach(baseJobNames, function(baseName, index) {
        var dntName = getDntName(baseName);
      
        var skills = dntData.getData(dntName);
        var numSkills = skills.length;
        for(var s=0;s<numSkills;++s) {
          if(skills[s].NameID == 0) {
            continue;
          }
          
          if(skills[s].EffectClass1 > 0 || 
             skills[s].EffectClass2 > 0 || 
             skills[s].EffectClass3 > 0 || 
             skills[s].EffectClass4 > 0 ||
             skills[s].EffectClass5 > 0 ||  
             skills[s].EffectClass6 > 0) {
               
            var newItem = {d: skills[s]};
            
            newItem.id = skills[s].id;
            newItem.typeName = 'skills';
            newItem.itemSource = 'skills';
            newItem.name = translations.translate(skills[s].NameID, skills[s].NameIDParam);
            newItem.needJobClass = skills[s].NeedJob;
            newItem.rank = hCodeValues.rankNames[0];
            newItem.baseJobName = baseName.toLowerCase();
            newItem.icon = skills[s].IconImageIndex;
            
            vm.skills.push(exportLinkHelper.reloadSkill(newItem));
          }
        }
      });
  
      vm.loadedJobId = job.id;
    }
  }
  
  vm.getResults = function() {
    
    var skills = getSkills();
    if(skills == null) {
      return [];
    }
    
    if(vm.job && vm.job.id >= 0) {
      localStorage.setItem('jobNumber', vm.job.id);
    }
    localStorage.setItem('nameSearch', vm.nameSearch);

    var newResults = [];
    var numSkills = skills.length;
    for(var i=0;i<numSkills;++i) {
      var e = skills[i];
      
      if(vm.nameSearch != '') {
        var nameSearches = vm.nameSearch.split(' ');
        if(!nameSearches.length) {
          nameSearches = [vm.nameSearch];
        }
        var allMatch = true;
        for(var ns=0;ns<nameSearches.length;++ns) {
          if(e.name && e.name.toString().toUpperCase().indexOf(nameSearches[ns].toUpperCase()) == -1) {
            allMatch = false;
            break;
          }
        }
        
        if(!allMatch) {
          continue;
        }
      }
      
      if(vm.job.id >= 0 && !vm.job.isClassJob(e.needJobClass)) {
        continue;
      }
      
      newResults.push(e);
    }
    return newResults;
  }
  
  function reportProgress(msg) {
    // console.log('progress: ' + msg);
  }
  
  function jobInit() {
    if(translations.isLoaded() && jobs.isLoaded()) {
      var newJobs = jobs.getFinalJobs();

      if(vm.jobs && vm.jobs.length) {
        newJobs.splice(0, 0, vm.jobs[0]);
      }
      vm.jobs = newJobs;
      vm.allJobs = jobs.getAllJobs();
      
      var lastJobNumber = Number(localStorage.getItem('jobNumber'));
      // console.log('using job', lastJobNumber);
      if(lastJobNumber != null) {
        angular.forEach(newJobs, function(value, key) {
          if(value.id == lastJobNumber) {
            vm.job = value;
            // console.log('using job', value);
            return;
          }
        });
      }
      
      vm.getResults();
    }
  }
  
  function init() {
    // console.log('skill init');
    if(jobs.isLoaded()) {
      $timeout(jobInit);
    }
    else {
      jobs.init(reportProgress, function() { $timeout(jobInit); } );
    }
  }
}

})();