angular.module('equipmentController', ['translationService', 'dntServices'])
.controller('EquipmentCtrl',

['$scope','$window','dntData','hCodeValues','items','jobs','exportLinkHelper','$routeParams','translations','$location',
function($scope,$window,dntData,hCodeValues,items,jobs,exportLinkHelper,$routeParams,translations,$location) {
  'use strict';
  
  $scope.jobName = null;
  $scope.item = exportLinkHelper.decodeItem($routeParams.itemString);
  if('itemSource' in $scope.item) {
    $scope.itemType = items[$scope.item.itemSource];
  }
  
  $scope.item.setStats = null;
  $scope.item.setId = null;
  
  $scope.handleChange = function() {
    setFullStats();
    
    $location.path('/item/' + exportLinkHelper.encodeItem($scope.item));
    $location.replace();
  }
  
  $scope.getLocation = function() {
    // todo: re-encode
    return '#/item/' + exportLinkHelper.encodeItem($scope.item);
  }
  
  function getJobName() {
    var retVal = '';
    var allJobs = jobs.getAllJobs();
    angular.forEach(allJobs, function(job, index) {
      if(job.id == $scope.item.needJobClass) {
        $scope.jobName = job.name;
        return;
      }
    });
  }
  
  function init() {
    var anyToLoad = false;
    
    angular.forEach(exportLinkHelper.getDntFiles($scope.item), function(columns, fileName) {
      if(!dntData.isLoaded(fileName)) {
        dntData.init(fileName, columns, reportProgress, function() { tryInit() });
        anyToLoad = true;
      }
    });
    
    if(!translations.isLoaded()) {
      translations.init(reportProgress,function() { tryInit() });
      anyToLoad = true;
    }
    
    if(!jobs.isLoaded()) {
      jobs.init(reportProgress, function() { tryInit(); });
      anyToLoad = true;
    }
    
    if(!anyToLoad) {
      tryInit();
    }
  }
  init();
  
  function tryInit() {
    if(!dntData.anyLoading() && translations.isLoaded() && jobs.isLoaded()) {
      $scope.item = exportLinkHelper.reloadItem($scope.item);
      if($scope.item == null) {
        return;
      }
      
      $window.document.title = 'DN Gear Sim | ' + $scope.item.name;
      if($scope.item.itemSource != 'custom') {
      
        if($scope.item.typeName == 'skills') {
          if(!$scope.item.pve || $scope.item.pve != 'pvp') {
            $scope.item.pve = 'pve';
          }
        }
    
        if($scope.item.needJobClass > 0) {
          getJobName();
        }
      }
    }
  }

  
  function setFullStats() {
    $scope.item.fullStats = $scope.item.stats;
    
    if($scope.item.enchantmentStats != null && $scope.item.enchantmentStats.length > 0) {
      $scope.item.fullStats = hCodeValues.mergeStats($scope.item.enchantmentStats, $scope.item.fullStats);
    }
    
    if($scope.item.sparkStats != null && $scope.item.sparkStats.length > 0) {
      $scope.item.fullStats = hCodeValues.mergeStats($scope.item.sparkStats, $scope.item.fullStats);
    }
  }
  
  function reportProgress(msg) {
    // $scope.progress += '|' + msg;
    // console.log('progress: ' + msg);
  }
}]);