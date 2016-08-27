angular.module('dnsim').controller('ItemSearchCtrl',
['$scope','$window','$routeParams','$timeout','$location',
'translations',
'itemCategory',
'jobs',
'hCodeValues',
'itemFactory',
'region',
'saveHelper',
function(
  $scope,$window,$routeParams,$timeout,$location,
  translations,
  itemCategory,
  jobs,
  hCodeValues,
  itemFactory,
  region,
  saveHelper) {
  'use strict';
  
  $scope.itemCategory = itemCategory.byPath('search/' + $routeParams.itemType);
  if(!$scope.itemCategory) {
     var catName = localStorage.getItem('selectedItemCategory');
     if(!catName) {
       catName = 'titles';
     }
     
     $scope.itemCategory = itemCategory.byName(catName);
     if($scope.itemCategory) {
       console.log('moving');
       $location.path($scope.itemCategory.path);
     }
     return;
  }
  
  $window.document.title = 'DN Gear Sim | ' + $scope.itemCategory.name.toUpperCase();
  
  $scope.job = {id: -1, name: ''};
  $scope.jobs = [$scope.job];
  $scope.allJobs = [];
  $scope.minLevel = 1;
  $scope.maxLevel = 99;
  $scope.maxDisplay = 10;
  $scope.totalNumResults = 0;
  $scope.grades = hCodeValues.rankNames;
  $scope.stat = {id:-1, name:''};
  $scope.stats = [$scope.stat];
  
  angular.forEach(hCodeValues.stats, function(stat, statId) {
    if(stat.searchable) {
      $scope.stats.push(stat);
    }
  });
  
  var minLevel = Number(localStorage.getItem('minLevel'));
  if(minLevel > 0 && minLevel < 100) {
    $scope.minLevel = minLevel;
  }
  var maxLevel = Number(localStorage.getItem('maxLevel'));
  if(maxLevel > 0 && maxLevel < 100) {
    $scope.maxLevel = maxLevel;
  }
  
  $scope.nameSearch = localStorage.getItem('nameSearch');
  if($scope.nameSearch == null) {
    $scope.nameSearch = '';
  }
  
  var savedSearchStatId = localStorage.getItem('searchStat');
  if(savedSearchStatId > -1 && savedSearchStatId in hCodeValues.stats) {
    $scope.stat = hCodeValues.stats[savedSearchStatId];
  }
  
  region.init();
  if(translations.isLoaded()) {
    init();
  }
  else {
    translations.init(reportProgress, function() { $timeout(init); } );
  }

  $scope.navigate = function() {
    var catName = localStorage.getItem('selectedItemCategory');
    if(catName) {
      $scope.itemCategory = itemCategory.byName(catName);
      if($scope.itemCategory) {
        console.log('navigating to ', $scope.itemCategory.path);
        $location.path($scope.itemCategory.path);
      }
    }
  }

  $scope.save = function() {
    if(!$scope.itemCategory.hideLevel) {
      localStorage.setItem('minLevel', $scope.minLevel);
      localStorage.setItem('maxLevel', $scope.maxLevel);
    }
    
    if(!$scope.itemCategory.hideJob) {
      if($scope.job != null) {
        localStorage.setItem('jobNumber', $scope.job.id);
      }
    }
  
    if($scope.stat != null) {
      localStorage.setItem('searchStat', $scope.stat.id);
    }

    localStorage.setItem('nameSearch', $scope.nameSearch);
  };
  
  function init() {
    // console.log('translations loaded');
    if(jobs.isLoaded()) {
      jobInit();
    }
    else {
      jobs.init(reportProgress, function() { $timeout(jobInit); } );
    }

    itemCategory.init($scope.itemCategory.name, $timeout);
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

      newJobs.splice(0, 0, $scope.jobs[0]);
      $scope.jobs = newJobs;
      $scope.allJobs = jobs.getAllJobs();
      
      var lastJobNumber = Number(localStorage.getItem('jobNumber'));
      if(lastJobNumber != null) {
        angular.forEach(newJobs, function(value, key) {
          if(value.id == lastJobNumber) {
            $scope.job = value;
            return;
          }
        });
      }
    }
  }
  
  $scope.rankChecked = hCodeValues.checkedRank;
  
  $scope.getResults = function() {
    var allItems = itemCategory.getItems($scope.itemCategory.name);
    if(allItems == null && searchObject && searchObject.getItems) {
      allItems = searchObject.getItems();
    }

    if(allItems == null) {
      console.log('no items');
      return null;
    }
    
    allItems = allItems.sort(function(item1, item2) {
        return (item2.levelLimit - item1.levelLimit);
      });
    console.log('got ', allItems);
    
    $scope.save();
    
    var start = new Date().getTime();
          
    var pcStatId = -1;
    if('pc' in $scope.stat) {
      pcStatId = $scope.stat.pc;
    }
  
    var statVals = [];
    var newResults = [];
    var numEquip = allItems.length;
    var curDisplay = 0;
    for(var i=0;i<numEquip && (curDisplay<$scope.maxDisplay || $scope.stat.id >= 0);++i) {
      var e = allItems[i];
      if(e != null) {
        
        if(!$scope.itemCategory.hideLevel) {
          if(e.levelLimit < $scope.minLevel || e.levelLimit > $scope.maxLevel) {
            continue;
          }
        }
          
        if(!$scope.itemCategory.hideRank) {
          if(e.rank != null && !$scope.rankChecked[e.rank.id]) {
            continue;
          }
        }
          
        if(!$scope.itemCategory.hideJob) {
          if($scope.job != null && $scope.job.id > 0) {
            if(!$scope.job.isClassJob(e.needJobClass)) {
              continue;
            }
          }
        }
        
        itemFactory.initItem(e);
        if(e.typeName != $scope.itemCategory.name) {
          continue;
        }
        
        if($scope.nameSearch != '') {
          var nameSearches = $scope.nameSearch.split(' ');
          if(nameSearches.length == 0) {
            nameSearches = [$scope.nameSearch];
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
        
        if($scope.stat.id >= 0) {
          var statFound = false;
          
          var statVal = {};
          for(var s=0;s<e.stats.length;++s) {
            var stat = e.stats[s]
            if(stat.id == $scope.stat.id) {
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
    
    if($scope.stat.id >= 0) {
      
      var currentResults = Math.min(curDisplay, $scope.maxDisplay);
      
      statVals = statVals.sort(function(value1, value2) {
        return value2.s - value1.s;
      });
      
      var statResults = [];
      for(var i=0;i<currentResults;++i) {
        statResults.push(newResults[statVals[i].i]);
      }
      newResults = statResults;
    }
    
    $scope.totalNumResults = newResults.length;
            
    var end = new Date().getTime();
    var time = end - start;
    
    return newResults;
  };
  
  $scope.showMoreResults = function(extra) {
    $scope.maxDisplay = $scope.totalNumResults + extra;
    $scope.totalNumResults = 0;
  }
  
}]);
