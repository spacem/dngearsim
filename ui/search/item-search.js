angular.module('dnsim').controller('ItemSearchCtrl',
['$scope','$window','$routeParams','$timeout','$location','$route',
'translations',
'itemCategory',
'jobs',
'hCodeValues',
'itemFactory',
'region',
'saveHelper',
function(
  $scope,$window,$routeParams,$timeout,$location,$route,
  translations,
  itemCategory,
  jobs,
  hCodeValues,
  itemFactory,
  region,
  saveHelper) {
  'use strict';
  
  var vm = this;
  
  vm.itemCategory = itemCategory.byPath($routeParams.cat);
  if(!vm.itemCategory) {
     var catName = localStorage.getItem('selectedItemCategory');
     if(!catName) {
       catName = 'titles';
     }
     
     vm.itemCategory = itemCategory.byName(catName);
     if(vm.itemCategory) {
       // console.log('moving');
       $location.search('cat', vm.itemCategory.path);
       $route.reload();
     }
     return;
  }
  
  $window.document.title = 'dngearsim | SEARCH ' + vm.itemCategory.name.toUpperCase();
  $(document).ready(function($) { 
      $('meta[name=description]').attr('content', 'Search in-game equipment');
  });
  
  vm.job = {id: -1, name: ''};
  vm.jobs = [vm.job];
  vm.allJobs = [];
  vm.minLevel = 1;
  vm.maxLevel = 99;
  vm.maxDisplay = 10;
  vm.totalNumResults = 0;
  vm.grades = hCodeValues.rankNames;
  vm.stat = {id:-1, name:''};
  vm.stats = [vm.stat];
  vm.results = null;
  
  angular.forEach(hCodeValues.stats, function(stat, statId) {
    if(stat.searchable) {
      vm.stats.push(stat);
    }
  });
  
  var minLevel = Number(localStorage.getItem('minLevel'));
  if($routeParams.minLevel) {
    minLevel = Number($routeParams.minLevel);
  }
  if(minLevel > 0 && minLevel < 100) {
    vm.minLevel = minLevel;
  }
  var maxLevel = Number(localStorage.getItem('maxLevel'));
  if($routeParams.maxLevel) {
    maxLevel = Number($routeParams.maxLevel);
  }
  if(maxLevel > 0 && maxLevel < 100) {
    vm.maxLevel = maxLevel;
  }
  
  vm.nameSearch = localStorage.getItem('nameSearch');
  if($routeParams.name) {
    vm.nameSearch = $routeParams.name;
  }
  if(!vm.nameSearch) {
    vm.nameSearch = '';
  }
  
  var savedSearchStatId = localStorage.getItem('searchStat');
  if($routeParams.stat) {
    savedSearchStatId = $routeParams.stat;
  }
  if(savedSearchStatId > -1 && savedSearchStatId in hCodeValues.stats) {
    vm.stat = hCodeValues.stats[savedSearchStatId];
  }

  vm.navigate = function() {
    var catName = localStorage.getItem('selectedItemCategory');
    if(catName) {
      vm.itemCategory = itemCategory.byName(catName);
      if(vm.itemCategory) {
        // console.log('navigating to ', vm.itemCategory.path);
        $location.search('cat', vm.itemCategory.path);
        vm.save();
        $route.reload();
      }
    }
  }

  vm.save = function() {
    if(!vm.itemCategory.hideLevel) {
      localStorage.setItem('minLevel', vm.minLevel);
      localStorage.setItem('maxLevel', vm.maxLevel);
      
      $location.search('minLevel', vm.minLevel);
      $location.search('maxLevel', vm.maxLevel);
    }
    else {
      $location.search('minLevel', null);
      $location.search('maxLevel', null);
    }
    
    if(!vm.itemCategory.hideJob) {
      if(vm.job != null) {
        localStorage.setItem('jobNumber', vm.job.id);
        if(vm.job.id > -1) {
          $location.search('job', vm.job.id);
        }
        else {
          $location.search('job', null);
        }
      }
    }
    else {
      $location.search('job', null);
    }
  
    if(vm.stat) {
      localStorage.setItem('searchStat', vm.stat.id);
      if(vm.stat.id > -1) {
        $location.search('stat', vm.stat.id);
      }
      else {
        $location.search('stat', null);
      }
    }

    localStorage.setItem('nameSearch', vm.nameSearch);
    $location.search('name', vm.nameSearch);
  };
  
  function init() {
    // console.log('translations loaded');
    if(jobs.isLoaded()) {
      jobInit();
    }
    else {
      jobs.init(reportProgress, function() { $timeout(jobInit); } );
    }

    itemCategory.init(vm.itemCategory.name, loadResults);
  }
  
  function reportProgress(msg) {
    // console.log('progress: ' + msg);
  }
  
  function jobInit() {
    // console.log('called the job init func');
    if(translations.isLoaded() && jobs.isLoaded()) {
      // console.log('trying to init jobs');
      // console.log('job dropdown should be set');
      var newJobs = jobs.getFinalJobs();

      newJobs.splice(0, 0, vm.jobs[0]);
      vm.jobs = newJobs;
      vm.allJobs = jobs.getAllJobs();
      
      var lastJobNumber = Number(localStorage.getItem('jobNumber'));
      if($routeParams.job && $routeParams.job) {
        lastJobNumber = Number($routeParams.job);
      }
      if(lastJobNumber != null) {
        angular.forEach(newJobs, function(value, key) {
          if(value.id == lastJobNumber) {
            vm.job = value;
            return;
          }
        });
      }
    }
  }
  
  vm.rankChecked = hCodeValues.checkedRank;
    
  vm.changeSearch = function() {
    vm.save();
    loadResults();
  }
  
  function loadResults() {
    $timeout(function() {
      vm.maxDisplay = 24;
      vm.results = getResults();
    });
  }
  
  function getResults() {
    // console.log('getting items');
    var allItems = itemCategory.getItems(vm.itemCategory.name);
    if(allItems == null) {
      // console.log('no items');
      return null;
    }
    
    allItems = allItems.sort(function(item1, item2) {
        return (item2.levelLimit - item1.levelLimit);
      });
          
    var pcStatId = -1;
    if('pc' in vm.stat) {
      pcStatId = vm.stat.pc;
    }
          
    var altStatId = -1;
    if('altStat' in vm.stat) {
      altStatId = vm.stat.altStat;
    }
  
    var statVals = [];
    var newResults = [];
    var numEquip = allItems.length;
    var curDisplay = 0;
    for(var i=0;i<numEquip && (curDisplay<vm.maxDisplay || vm.stat.id >= 0);++i) {
      var e = allItems[i];
      if(e) {
        
        if(!vm.itemCategory.hideLevel) {
          if(e.levelLimit < vm.minLevel || e.levelLimit > vm.maxLevel) {
            continue;
          }
        }
          
        if(!vm.itemCategory.hideRank) {
          if(e.rank && !vm.rankChecked[e.rank.id]) {
            continue;
          }
        }
          
        if(!vm.itemCategory.hideJob) {
          if(vm.job && vm.job.id > -1) {
            if(!vm.job.isClassJob(e.needJobClass)) {
              continue;
            }
          }
        }
        
        itemFactory.initItem(e);
        if(e.typeName != vm.itemCategory.name) {
          continue;
        }
        // console.log('name filter', vm.nameSearch); 
        
        if(vm.nameSearch != '') {
          // console.log('filtering on name');
          var nameSearches = vm.nameSearch.split(' ');
          if(!nameSearches.length) {
            nameSearches = [vm.nameSearch];
          }
          var allMatch = true;
          for(var ns=0;ns<nameSearches.length;++ns) {
            if(e.name.toUpperCase().indexOf(nameSearches[ns].toUpperCase()) == -1) {
              allMatch = false;
              break;
            }
          }
          
          if(!allMatch) {
            continue;
          }
        }
        
        if(vm.stat.id >= 0) {
          var statFound = false;
          
          var statVal = {};
          for(var s=0;s<e.stats.length;++s) {
            var stat = e.stats[s];
            if(stat.id == vm.stat.id) {
              statFound = true;
              statVal.i = curDisplay;
              statVal.s = Number(stat.max);
              break;
            }
            else if(stat.id == pcStatId) {
              statFound = true;
              statVal.i = curDisplay;
              statVal.s = Number(stat.max);
            }
            else if(stat.id == altStatId) {
              statFound = true;
              statVal.i = curDisplay;
              statVal.s = Number(stat.max);
            }
          }
          
          if(!statFound) {
            continue;
          }
          else {
            statVals.push(statVal);
          }
        }
        
        newResults.push(e);
        curDisplay++;
      }
    }
    
    if(vm.stat.id >= 0) {
      
      var currentResults = Math.min(curDisplay, vm.maxDisplay);
      
      statVals = statVals.sort(function(value1, value2) {
        return value2.s - value1.s;
      });
      
      var statResults = [];
      for(var i=0;i<currentResults;++i) {
        statResults.push(newResults[statVals[i].i]);
      }
      newResults = statResults;
    }
    
    vm.totalNumResults = newResults.length;
    
    return newResults;
  }

  vm.showMoreResults = function() {
    $timeout(function() {
      vm.maxDisplay += 18;
      vm.results = getResults();
    });
  }
  
  region.init();
  if(translations.isLoaded()) {
    init();
  }
  else {
    translations.init(reportProgress, function() { $timeout(init); } );
  }
  
}]);
