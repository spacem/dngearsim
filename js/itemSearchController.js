angular.module('itemSearchController', ['translationService', 'dntServices', 'saveService'])
.controller('ItemSearchCtrl',
['$scope','$routeParams','$timeout','$uibModal',
'translations',
'items',
'jobs',
'getAllItems','hCodeValues',
'saveItem',
'initItem',
function(
  $scope,$routeParams,$timeout,$uibModal,
  translations,
  items,
  jobs,
  getAllItems,hCodeValues,
  saveItem,
  initItem) {
  
  $scope.job = {id: -1, name: '-- loading --'};
  $scope.jobs = [$scope.job];
  $scope.allJobs = [];
  
  $scope.simpleSearch = $routeParams.itemType == 'titles';
  
  var minLevel = Number(localStorage.getItem('minLevel'));
  if(!(minLevel > 0 && minLevel < 100) || $scope.simpleSearch) {
    minLevel = 1;
  }
  var maxLevel = Number(localStorage.getItem('maxLevel'));
  if(!(maxLevel > 0 && maxLevel < 100) || $scope.simpleSearch) {
    maxLevel = 99;
  }
  
  $scope.nameSearch = localStorage.getItem('nameSearch');
  if($scope.nameSearch == null) {
    $scope.nameSearch == '';
  }

  $scope.save = function() {
    if(!$scope.simpleSearch) {
      localStorage.setItem('minLevel', $scope.minLevel);
      localStorage.setItem('maxLevel', $scope.maxLevel);
      
      if($scope.job != null) {
        localStorage.setItem('jobNumber', $scope.job.id);
      }
      
      localStorage.setItem('nameSearch', $scope.nameSearch);
    }
  };
  
  $scope.minLevel = minLevel;
  $scope.maxLevel = maxLevel;
  $scope.results = [];
  $scope.selection = [];
  $scope.items = null;
  $scope.maxDisplay = 15;
  $scope.currentResults = 0;
  $scope.grades = hCodeValues.rankNames;
  
  $scope.getLocation = function() {
     return $routeParams.location;
  };
    
  $scope.search = function() {
    console.log('clicked search');
    equipInit();
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
          return 'unnamed group';
        }
      }
    });
  };
  
  translations.init(reportProgress, function() { $timeout(translationsInit); } );
  function translationsInit() {
    console.log('translations loaded');
    jobs.init(reportProgress, function() { $timeout(jobInit); } );
    angular.forEach(itemFactories, function(value, key) {
      value.init(reportProgress, function() { $timeout(itemInit); } );
    });
  }
  
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
  
  $scope.isLoadComplete = function() {
    for(var i=0;i<itemFactories.length;++i) {
      if(!itemFactories[i].isLoaded()) {
        return false;
      }
    }
    
    return true;
  };
  
  function reportProgress(msg) {
      // $scope.progress += '|' + msg;
      console.log('progress: ' + msg);
  }
  
  function jobInit() {
    console.log('called the job init func');
    if(translations.loaded && jobs.isLoaded()) {
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
  
  $scope.getJobName = function(job) {
    var numJobs = $scope.allJobs.length;
    for(var i=0;i<numJobs;++i) {
      if($scope.allJobs[i].id == job) {
        return $scope.allJobs[i].name;
      }
    }
    
    return '-';
  };
  
  $scope.getResults = function() {
    console.log('getting results');
    
      if($scope.items == null) {
        return [];
      }
      
      $scope.save();
    
      var newResults = [];
      var numEquip = $scope.items.length;
      var curDisplay = 0;
      for(var i=0;i<numEquip&&curDisplay<$scope.maxDisplay;++i) {
        var e = $scope.items[i];
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
          
          initItem(e);
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
    if(translations.loaded && jobs.isLoaded()) {
      console.log('trying to init equip');
      if($scope.isLoadComplete()) {
        $scope.items = getAllItems(itemFactories);
      }
    }
  }
}]);
