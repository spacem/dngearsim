angular.module('dnsim').controller('SkillSearchCtrl',

['$window','$timeout','saveHelper','region','jobs','translations','dntData','hCodeValues',
function($window,$timeout,saveHelper, region, jobs, translations,dntData,hCodeValues) {
  'use strict';
  
  $window.document.title = 'DN Gear Sim | SKILLS';
  
  var vm = this;
  document.body.className = 'search-back';
  
  this.job = {id: -1, d:{}, name: ''};
  this.jobs = [this.job];
  this.allJobs = [];
  this.maxDisplay = 10;
  this.currentResults = 0;
  this.dntName = '';
  this.skills = [];
  this.loadedJobId = -1;

  this.nameSearch = localStorage.getItem('nameSearch');
  if(this.nameSearch == null) {
    this.nameSearch = '';
  }

  var classFactories = [];
  
  region.init();
  if(translations.isLoaded()) {
    init();
  }
  else {
    translations.init(reportProgress, function() { $timeout(init); } );
  }
  
  this.isLoading = function() {
    if(!jobs.isLoaded()) {
      // console.log('jobs not loaded');
      if(!jobs.hasStartedLoading()) {
        init();
      }
      return true;      
    }
    
    if(!translations.isLoaded()) {
      // console.log('transations not loaded');
      if(!translations.startedLoading) {
        translations.init(reportProgress, function() { $timeout(translationsInit); } );
      }

      return true;
    }
    
    var baseName = jobs.getBaseJobName(vm.job);
    var dntName = getDntName(baseName);
    if(dntName != null) {
      if(!dntData.isLoaded(dntName)) {
        return true;
      }
    }

    return false;
  };
  
  function getDntName(baseClassName) {
    // console.log('got base class :' + baseClassName);
    if(baseClassName != null) {
      return 'skilltable_character' + baseClassName.toLowerCase() + '.lzjson';
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
      else {
        angular.forEach(jobs.getBaseJobs(), function(jobName, index) {
          baseJobNames.push(jobName);
        });
        // console.log('got ' + baseJobNames);
      }

      angular.forEach(baseJobNames, function(baseName, index) {
        var dntName = getDntName(baseName);
        if(dntName) {
          if(!dntData.isLoaded(dntName)) {
            // console.log('loading skills for ' + baseName);
            dntData.init(dntName, null, reportProgress, function() { $timeout(function() {setupSkills(baseJobNames, vm.job);} ) });
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
        return;
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
            newItem.name = translations.translate(skills[s].NameID);
            newItem.needJobClass = skills[s].NeedJob;
            newItem.rank = hCodeValues.rankNames[0];
            newItem.baseJobName = baseName.toLowerCase();

            vm.skills.push(newItem);
          }
        }
      });
  
      vm.loadedJobId = job.id;
    }
  }
  
  this.itemLinkClosed = function() {
    saveHelper.saveCustomItems(vm.customItems);
    vm.customItems = saveHelper.getCustomItems();
  }
  
  this.getResults = function() {
    
    var skills = getSkills();
    if(skills == null) {
      return [];
    }
    
    
    if(vm.job != null) {
      localStorage.setItem('jobNumber', vm.job.id);
    }
    localStorage.setItem('nameSearch', vm.nameSearch);

    var newResults = [];
    var numSkills = skills.length;
    var curDisplay = 0;
    for(var i=0;i<numSkills && (curDisplay<vm.maxDisplay);++i) {
      var e = skills[i];
      
      if(vm.nameSearch != '') {
        var nameSearches = vm.nameSearch.split(' ');
        if(nameSearches.length == 0) {
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
      curDisplay++;
    }
    vm.currentResults = Math.min(curDisplay, vm.maxDisplay);
    return newResults;
  }
  
  function reportProgress(msg) {
    // console.log('progress: ' + msg);
  }
  
  function jobInit() {
    if(translations.isLoaded() && jobs.isLoaded()) {
      var newJobs = jobs.getFinalJobs();

      newJobs.splice(0, 0, vm.jobs[0]);
      vm.jobs = newJobs;
      vm.allJobs = jobs.getAllJobs();
      
      var lastJobNumber = Number(localStorage.getItem('jobNumber'));
      if(lastJobNumber != null) {
        angular.forEach(newJobs, function(value, key) {
          if(value.id == lastJobNumber) {
            vm.job = value;
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
}]);