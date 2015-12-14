angular.module('itemSearchController', ['translationService', 'dntServices'])
.controller('ItemSearchCtrl',
['$scope','$routeParams','translations','jobs','equipment','plates','talisman','techs','rebootEquipment','getAllItems','$timeout',
function($scope,$routeParams,translations, jobs,equipment,plates,talisman,techs,rebootEquipment,getAllItems,$timeout) {
  $scope.job = {id: -1, name: '-- loading --'};
  $scope.jobs = [$scope.job];
  $scope.allJobs = [];
  $scope.minLevel = 80;
  $scope.maxLevel = 90;
  $scope.nameSearch = '';
  $scope.results = [];
  $scope.selection = [];
  $scope.items = null;
  $scope.maxDisplay = 15;
  $scope.currentResults = 0;
  $scope.grades = [
    {id: 0, name: '--'},
    {id: 1, name: 'normal'},
    {id: 2, name: 'magic'},
    {id: 3, name: 'epic'},
    {id: 4, name: 'unique'},
    {id: 5, name: 'legendary'},
    ];
    
  $scope.grade = $scope.grades[0];
  
  $scope.getLocation = function() {
     return $routeParams.location;
  };
    
  $scope.search = function() {
    console.log('clicked search');
    equipInit();
  };
  
  translations.init(reportProgress, function() { $timeout(translationsInit); } );
  jobs.init(reportProgress, function() { $timeout(jobInit); } );
  
  var itemFactories = [
    equipment,plates,talisman,techs,rebootEquipment
    ];
  
  angular.forEach(itemFactories, function(value, key) {
    value.init(reportProgress, function() { $timeout(itemInit); } );
  });
  
  $scope.isLoadComplete = function() {
    for(var i=0;i<itemFactories.length;++i) {
      if(!itemFactories[i].isLoaded()) {
        return false;
      }
    }
    
    return true;
  };
  
  function translationsInit() {
      console.log('translations loaded');
      jobInit();
      itemInit();
  }
  
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
      newJobs.splice(0, 0, $scope[0]);
      $scope.jobs = newJobs;
      $scope.allJobs = jobs.getAllJobs();
      itemInit();
    }
  }
  
  $scope.getRankName = function(rank) {
    return $scope.grades[rank].name;
  };
  
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
    
      var newResults = [];
      var numEquip = $scope.items.length;
      var curDisplay = 0;
      for(var i=0;i<numEquip&&curDisplay<$scope.maxDisplay;++i) {
        var e = $scope.items[i];
        if(e.levelLimit >= $scope.minLevel && e.levelLimit <= $scope.maxLevel) {
          if($scope.grade.id > 0) {
            if($scope.grade.id != e.rank) {
              continue;
            }
          }
          
          if($scope.job != null && $scope.job.id > 0) {
            if(!$scope.job.isClassJob(e.needJobClass)) {
              continue;
            }
          }
          
          if($scope.nameSearch != '') {
            if(e.name.toUpperCase().indexOf($scope.nameSearch.toUpperCase()) == -1) {
              continue;
            }
          }
          
          newResults.push(e);
          curDisplay++;
        }
      }
      $scope.currentResults = curDisplay;
      
      return newResults;
  };
  
  function itemInit() {
    if(translations.loaded && jobs.isLoaded()) {
      console.log('trying to init equip');
      $scope.items = getAllItems();
    }
  }
}]);
