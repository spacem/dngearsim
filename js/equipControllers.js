angular.module('equipControllers', ['translationService', 'dntServices'])
.controller('EquipCtrl', ['$scope','translations','jobs','equipment','$timeout',function($scope,translations, jobs, equipment,$timeout) {
  $scope.job = {id: -1, name: '-- loading --'};
  $scope.jobs = [$scope.job];
  $scope.allJobs = [];
  $scope.minLevel = 80;
  $scope.maxLevel = 90;
  $scope.nameSearch = '';
  $scope.results = [];
  $scope.selection = [];
  $scope.equipment = null;
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
    
  $scope.search = function() {
    console.log('clicked search');
    equipInit();
  };
  
  translations.init(reportProgress, function() { $timeout(translationsInit); } );
  jobs.init(reportProgress, function() { $timeout(jobInit); } );
  equipment.init(reportProgress, function() { $timeout(equipInit); } );
  
  function translationsInit() {
      console.log('translations loaded');
      jobInit();
      equipInit();
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
      equipInit();
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
    
      if($scope.equipment == null) {
        return [];
      }
    
      var newResults = [];
      var numEquip = $scope.equipment.length;
      var curDisplay = 0;
      for(var i=0;i<numEquip&&curDisplay<$scope.maxDisplay;++i) {
        var e = $scope.equipment[i];
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
  
  function equipInit() {
    if(translations.loaded && equipment.isLoaded() && jobs.isLoaded()) {
      console.log('trying to init equip');
      if($scope.equipment == null) {
        $scope.equipment = equipment.getEquipment();
      }
    }
  }
}]);
