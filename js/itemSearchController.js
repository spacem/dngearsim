angular.module('itemSearchController', ['translationService', 'dntServices', 'saveService'])
.controller('ItemSearchCtrl',
['$scope','$routeParams','$timeout','$uibModal',
'translations',
'items',
'jobs',
'getAllItems','hCodeValues',
'saveItem',
'initItem',
'region',
function(
  $scope,$routeParams,$timeout,$uibModal,
  translations,
  items,
  jobs,
  getAllItems,hCodeValues,
  saveItem,
  initItem,
  region) {
  
  $scope.job = {id: -1, name: '-- loading --'};
  $scope.jobs = [$scope.job];
  $scope.allJobs = [];
  $scope.minLevel = 1;
  $scope.maxLevel = 99;
  $scope.results = [];
  $scope.selection = [];
  $scope.maxDisplay = 15;
  $scope.currentResults = 0;
  $scope.grades = hCodeValues.rankNames;
  $scope.simpleSearch = $routeParams.itemType == 'titles';
  
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
  
  region.init();
  translations.init(reportProgress, function() { $timeout(init); } );
  
  var allItemFactories = items.all;
  var itemFactories = [];
  if($routeParams.itemType == null) {
    itemFactories = allItemFactories;
  }
  else {
    for(var f=0;f<allItemFactories.length;++f) {
      if(allItemFactories[f].type == $routeParams.itemType) {
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
    }
    localStorage.setItem('nameSearch', $scope.nameSearch);
  };
  
  $scope.getFullStats = function(item) {
    if('fullStats' in item && item.fullStats != null) {
      return item.fullStats;
    }
    else {
      return item.stats;
    }
  }
  
  $scope.saveItem = function(item) {
    console.log('opening item for save ' + item.name);
    var modalInstance = $uibModal.open({
      animation: false,
      backdrop : false,
      keyboard : true,
      templateUrl: 'partials/use-options.html', //?bust=' + Math.random().toString(36).slice(2),
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
    jobs.init(reportProgress, function() { $timeout(jobInit); } );
    angular.forEach(itemFactories, function(value, key) {
      if(!value.loading) {
        value.init(reportProgress, function() { $timeout(itemInit); } );
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
      // $scope.progress += '|' + msg;
      console.log('progress: ' + msg);
  }
  
  function jobInit() {
    console.log('called the job init func');
    if(translations.isLoaded() && jobs.isLoaded()) {
      console.log('trying to init jobs');
      console.log('job dropdown should be set');
      var newJobs = jobs.getFinalJobs();
      
      var lastJobNumber = Number(localStorage.getItem('jobNumber'));
      if(lastJobNumber != null) {
        angular.forEach(newJobs, function(value, key) {
          if(value.id == lastJobNumber) {
            $scope.job = value;
          }
        });
        
        $scope.jobs[0].name = '';
        newJobs.splice(0, 0, $scope.jobs[0]);
        $scope.jobs = newJobs;
        $scope.allJobs = jobs.getAllJobs();
        itemInit();
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
      
      $scope.save();
    
      var newResults = [];
      var numEquip = allItems.length;
      var curDisplay = 0;
      for(var i=0;i<numEquip&&curDisplay<$scope.maxDisplay;++i) {
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
          
          if($scope.nameSearch != '') {
            var nameSearches = $scope.nameSearch.split(' ');
            if(nameSearches.length == 0) {
              nameSearches = [$scope.nameSearch];
            }
            initItem(e);
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
          else {
            initItem(e);
          }
          newResults.push(e);
          curDisplay++;
        }
      }
      $scope.currentResults = curDisplay;
      
      return newResults;
  };
  
  $scope.open = function (item) {
    console.log('opening item ' + item.name);
    var modalInstance = $uibModal.open({
      animation: false,
      backdrop : false,
      keyboard : true,
      templateUrl: 'partials/equipment.html', //?bust=' + Math.random().toString(36).slice(2),
      controller: 'EquipmentCtrl',
      size: 'lg',
      resolve: {
        item: function () {
          return item;
        }
      }
    });
  }
  
  function itemInit() {
    if(translations.isLoaded() && jobs.isLoaded()) {
      console.log('trying to init equip');
      if(!$scope.isLoading()) {
        // do something?
        console.log('should be done');
      }
    }
  }
}]);
