angular.module('skillSearchController', ['ui.bootstrap','translationService', 'dntServices', 'saveService'])
.controller('SkillSearchCtrl',

['$uibModal','$timeout','saveHelper','region','jobs','translations','dntData','hCodeValues',
function($uibModal,$timeout,saveHelper, region, jobs, translations,dntData,hCodeValues) {
  
  var self = this;
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
      console.log('jobs not loaded');
      if(!jobs.hasStartedLoading()) {
        init();
      }
      return true;      
    }
    
    if(!translations.isLoaded()) {
      console.log('transations not loaded');
      if(!translations.startedLoading) {
        translations.init(reportProgress, function() { $timeout(translationsInit); } );
      }

      return true;
    }
    
    var baseName = jobs.getBaseJobName(self.job);
    var dntName = getDntName(baseName);
    if(dntName != null) {
      if(!dntData.isLoaded(dntName)) {
        return true;
      }
    }

    return false;
  };
  
  function getDntName(baseClassName) {
    console.log('got base class :' + baseClassName);
    if(baseClassName != null) {
      return 'skilltable_character' + baseClassName.toLowerCase() + '.dnt';
    }
    else {
      return null;
    }
  }

  function getSkills() {
    console.log('getting skills for ' + self.job.name);
    if(this.loadedJobId == self.job.id) {
      return this.skills;
    }
    else {
      
      var baseJobNames = [];
      if(self.job.id >= 0) {
        var baseName = jobs.getBaseJobName(self.job);
        baseJobNames.push(baseName);
      }
      else {
        angular.forEach(jobs.getBaseJobs(), function(jobName, index) {
          baseJobNames.push(jobName);
        });
        console.log('got ' + baseJobNames);
      }

      angular.forEach(baseJobNames, function(baseName, index) {
        var dntName = getDntName(baseName);
        if(dntName) {
          if(!dntData.isLoaded(dntName)) {
            console.log('loading skills for ' + baseName);
            dntData.init(dntName, null, reportProgress, function() { $timeout(function() {setupSkills(baseJobNames, self.job);} ) });
          }
          else {
            setupSkills(baseJobNames, self.job);
          }
        }
      });
    }
  }
  
  this.saveItem = function(item) {
    console.log('opening item for save ' + item.name);
    var modalInstance = $uibModal.open({
      animation: false,
      backdrop : false,
      keyboard : true,
      templateUrl: 'partials/use-options.html?bust=' + Math.random().toString(36).slice(2),
      controller: 'UseOptionsCtrl',
      size: 'lg',
      resolve: {
        item: function () {
          return item;
        },
        group: function () {

          var group = localStorage.getItem('lastSavedGroup');
          if(group != null) {
            return group;
          }
          return 'unnamed group';
        }
      }
    });
  };
  
  function setupSkills(baseJobNames, job) {
    
    this.skills = [];
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
            newItem.itemTypeName = 'skills';
            newItem.name = translations.translate(skills[s].NameID);
            newItem.needJobClass = skills[s].NeedJob;
            newItem.rank = hCodeValues.rankNames[0];
            newItem.baseJobName = baseName.toLowerCase();
            
            this.skills.push(newItem);
          }
        }
      });
  
      this.loadedJobId = job.id;
    }
  }
  
  this.itemLinkClosed = function() {
    saveHelper.saveCustomItems(this.customItems);
    this.customItems = saveHelper.getCustomItems();
  }
  
  this.getResults = function() {
    
    var skills = getSkills();
    if(skills == null) {
      return [];
    }
    
    
    if(this.job != null) {
      localStorage.setItem('jobNumber', this.job.id);
    }
    localStorage.setItem('nameSearch', this.nameSearch);

    var newResults = [];
    var numSkills = skills.length;
    var curDisplay = 0;
    for(var i=0;i<numSkills && (curDisplay<this.maxDisplay);++i) {
      var e = skills[i];
      
      if(this.nameSearch != '') {
        var nameSearches = this.nameSearch.split(' ');
        if(nameSearches.length == 0) {
          nameSearches = [this.nameSearch];
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
      
      if(this.job.id >= 0 && !this.job.isClassJob(e.needJobClass)) {
        continue;
      }
      
      newResults.push(e);
      curDisplay++;
    }
    this.currentResults = Math.min(curDisplay, this.maxDisplay);
    return newResults;
  }
  
  function reportProgress(msg) {
    console.log('progress: ' + msg);
  }
  
  function jobInit() {
    if(translations.isLoaded() && jobs.isLoaded()) {
      var newJobs = jobs.getFinalJobs();

      newJobs.splice(0, 0, self.jobs[0]);
      self.jobs = newJobs;
      self.allJobs = jobs.getAllJobs();
      
      var lastJobNumber = Number(localStorage.getItem('jobNumber'));
      if(lastJobNumber != null) {
        angular.forEach(newJobs, function(value, key) {
          if(value.id == lastJobNumber) {
            self.job = value;
            return;
          }
        });
      }
      
      self.getResults();
    }
  }
  
  function init() {
    console.log('skill init');
    if(jobs.isLoaded()) {
      $timeout(jobInit);
    }
    else {
      jobs.init(reportProgress, function() { $timeout(jobInit); } );
    }
  }
}]);