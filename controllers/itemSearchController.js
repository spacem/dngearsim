angular.module('itemSearchController', ['translationService', 'dntServices', 'saveService'])
.controller('ItemSearchCtrl',
['$scope','$routeParams','$timeout','$uibModal',
'translations',
'items',
'jobs',
'getAllItems','hCodeValues',
'saveHelper',
'initItem',
'region',
function(
  $scope,$routeParams,$timeout,$uibModal,
  translations,
  items,
  jobs,
  getAllItems,hCodeValues,
  saveHelper,
  initItem,
  region) {

  document.body.className = 'search-back';
  
  $scope.job = {id: -1, name: ''};
  $scope.jobs = [$scope.job];
  $scope.allJobs = [];
  $scope.minLevel = 1;
  $scope.maxLevel = 99;
  $scope.maxDisplay = 10;
  $scope.totalNumResults = 0;
  $scope.grades = hCodeValues.rankNames;
  $scope.simpleSearch = $routeParams.itemType == 'titles';
  $scope.stat = {id:-1, name:''};
  $scope.stats = [$scope.stat];
  angular.forEach(hCodeValues.stats, function(stat, statId) {
    if(stat.type) {
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
  
  $scope.itemType = $routeParams.itemType;
  
  if($routeParams.itemType == 'weapons') {
    $scope.itemType = 'equipment';
    $scope.extraFilterFunc = function(d) {
      return d.typeId == 0;
    };
  }
  else if($routeParams.itemType == 'armour') {
    $scope.itemType = 'equipment';
    $scope.extraFilterFunc = function(d) {
      return d.typeId == 1 && d.typeName == 'armour';
    }
  }
  else if($routeParams.itemType == 'accessories') {
    $scope.itemType = 'equipment';
    $scope.extraFilterFunc = function(d) {
      return d.typeId == 1 && d.typeName == 'accessories';
    }
  }
  else if($routeParams.itemType == 'offensive gems') {
    $scope.itemType = 'gems';
    $scope.extraFilterFunc = function(d) {
      return d.typeName == 'offensive gems';
    }
  }
  else if($routeParams.itemType == 'increasing gems') {
    $scope.itemType = 'gems';
    $scope.extraFilterFunc = function(d) {
      return d.typeName == 'increasing gems';
    }
  }
  else {
    $scope.itemType = $routeParams.itemType;
    $scope.extraFilterFunc = function(d) { return true; }
  }

  var allItemFactories = items.all;

  var itemFactories = [];
  if($scope.itemType != null) {
    for(var f=0;f<allItemFactories.length;++f) {
      if(allItemFactories[f].type == $scope.itemType) {
        itemFactories.push(allItemFactories[f]);
      }
    }
  }

  $scope.save = function() {
    if(!$scope.simpleSearch) {
      localStorage.setItem('minLevel', $scope.minLevel);
      localStorage.setItem('maxLevel', $scope.maxLevel);
      
      if($scope.job != null) {
        localStorage.setItem('jobNumber', $scope.job.id);
      }
      if($scope.stat != null) {
        localStorage.setItem('searchStat', $scope.stat.id);
      }
    }
    localStorage.setItem('nameSearch', $scope.nameSearch);
  };
  
  $scope.saveItem = function(item) {
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
  
  function init() {
    console.log('translations loaded');
    if(jobs.isLoaded()) {
      jobInit();
    }
    else {
      jobs.init(reportProgress, function() { $timeout(jobInit); } );
    }

    angular.forEach(itemFactories, function(value, key) {
      if(!value.loading) {
        value.init(reportProgress, function() { $timeout(); } );
      }
    });
  }
  
  $scope.isLoading = function() {
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

    for(var i=0;i<itemFactories.length;++i) {
      if(!itemFactories[i].isLoaded()) {
        console.log(itemFactories[i].name + ' not loaded');
        
        if(!itemFactories[i].loading) {
          init();
        }
        return true;
      }
    }
    
    return false;
  };
  
  function reportProgress(msg) {
    console.log('progress: ' + msg);
  }
  
  function jobInit() {
    console.log('called the job init func');
    if(translations.isLoaded() && jobs.isLoaded()) {
      console.log('trying to init jobs');
      console.log('job dropdown should be set');
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
  
  $scope.getResults = function() {
      if($scope.isLoading()) {
        return [];
      }
      var allItems = getAllItems(itemFactories);
      if(allItems == null) {
        return [];
      }
      
      allItems = allItems.sort(function(item1, item2) {
          return (item2.levelLimit - item1.levelLimit);
        });
      
      $scope.save();
            
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
          
          if(!$scope.simpleSearch) {
            if(e.levelLimit < $scope.minLevel || e.levelLimit > $scope.maxLevel) {
              continue;
            }
            
            if(e.rank != null && !$scope.grades[e.rank.id].checked) {
              continue;
            }
            
            if($scope.job != null && $scope.job.id > 0) {
              if(!$scope.job.isClassJob(e.needJobClass)) {
                continue;
              }
            }
          }
          
          initItem(e);
        
          if(!$scope.extraFilterFunc(e)) {
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
            angular.forEach(e.stats, function(stat, index) {
              if(stat.id == $scope.stat.id) {
                statFound = true;
                statVal.i = curDisplay;
                statVal.s = Number(stat.max);
              }
              else if(stat.id == pcStatId) {
                statFound = true;
                statVal.i = curDisplay;
                statVal.pc = Number(stat.max);
              }
            });
            
            if(!statFound) {
              continue;
            }
            else {
              if(statVal.s && statVal.pc) {
                statVal.s = statVal.s * (1.0 + statVal.pc);
              }
              else if(statVal.pc) {
                statVal.s = statVal.pc;
              }
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
      
      return newResults;
  };
  
  $scope.showMoreResults = function(extra) {
    $scope.maxDisplay = $scope.totalNumResults + extra;
    $scope.totalNumResults = 0;
  }
  
}]);
