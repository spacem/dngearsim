angular.module('setupController', ['translationService', 'dntServices','ngRoute'])
.controller('SetupCtrl', 
  ['$scope','$route','$routeParams','$timeout','translations','dntInit','dntReset',
   function($scope, $route, $routeParams, $timeout, translations, dntInit, dntReset) {
  
  var noLocation = '';
  var sessionLocation = $routeParams.location;
  if(sessionLocation == null) {
    sessionLocation = noLocation;
  }
  
  $scope.location = sessionLocation;
  $scope.uistringLocation = '';
  if($scope.location == noLocation) {
    $scope.testResults = ['No location set'];
  }
  else {
    $scope.testResults = ['Using location ' + $scope.location];
  }
  
  $scope.translationResults = [];
  
  $scope.hostedFiles = [
    {region: 'na', name: 'dec-2015', url : 'https://dnfiles.firebaseapp.com/na'},
    {region: 'cdn', name: 'dec-2015', url : 'https://dnfiles.firebaseapp.com/cdn'},
    {region: 'sea', name: 'dec-2015', url : 'https://dnfiles.firebaseapp.com/sea'},
    ];
  
  $scope.resetSessionData = function() {
    $scope.testResults = ['session data reset.. reloading page'];
    translations.reset();
    sessionStorage.clear();
    localStorage.clear();
    this.saveLocation();
    $timeout(function() {   
      location.hash = '';
      location.reload(true);
    });
  }
  
  $scope.loadUiString = function() {
    $scope.translationResults = [];
    localStorage.removeItem('UIStrings');
    translations.reset();
    translations.location = $scope.uistringLocation;
    translations.init(progressTranslations, translationsStatus);
  }
  
  function translationsStatus() {
    progressTranslations('current translations contain words like ' + translations.translate(329) + ', ' + translations.translate(323) + ' and ' + translations.translate(335));  }
  
  translations.init(progressTranslations, translationsStatus);
  
  function progress(msg) {
    $timeout(
      function() {
        if($scope.testResults != null) {
          $scope.testResults.push(msg);
        }
      });
  }
  
  function progressTranslations(msg) {
    $timeout(
      function() {
        if($scope.translationResults != null) {
          $scope.translationResults.push(msg);
        }
      });
  }
  
  $scope.saveLocation = function() {
    translations.reset();
    dntReset(progress);
    if($scope.location != noLocation) {
      var params = $routeParams;
      params['location'] = $scope.location;
      $route.updateParams(params);
      $scope.testResults = [
        'Location saved',
        'Using location ' + $scope.location];
    }
  }
  
  $scope.testLocation = function() {
    if($scope.location != noLocation) {
      $scope.testResults = [
        'Using location ' + $scope.location,
        'Loading all data used by the app'];

      translations.init(progress, function () {
        dntInit(progress);
      });
    }
  }
}]);
