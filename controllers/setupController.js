angular.module('setupController', ['translationService', 'dntServices','ngRoute'])
.controller('SetupCtrl', 
  ['$scope','$route','$timeout','translations','dntInit','dntReset','region',
   function($scope, $route, $timeout, translations, dntInit, dntReset, region) {
     
  document.body.className = 'default-back';
  
  $scope.advancedSetup = false;
  $scope.isLoading = translations.startedLoading && !translations.isLoaded();
  $scope.translationResults = [];
  $scope.hostedFiles = region.hostedFiles;
  
  var noLocation = '';
  var sessionLocation = region.alternativeFiles.url;
  if(sessionLocation == null) {
    sessionLocation = noLocation;
  }
  
  $scope.location = sessionLocation;
  if($scope.location == noLocation) {
    $scope.testResults = ['No location set'];
  }
  else {
    $scope.testResults = ['Using location ' + $scope.location];
  }
  
  $scope.setLocation = function(url) {
    $scope.location = url;
    $scope.isLoading = true;
    $scope.saveLocation();
    dntReset();

    $scope.translationResults = [];
    var existingFile = localStorage.getItem('UIStrings_file');
    if(existingFile == null || existingFile.indexOf(url) == -1) {
      localStorage.removeItem('UIStrings');
    }
    translations.reset();
    translations.location = url;
    translations.init(progressTranslations, translationsStatus);
  }
  
  $scope.resetSessionData = function() {
    $scope.testResults = ['session data reset.. reloading page'];
    region.tlocation = null;
    region.dntLocation = null;
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
    dntReset();
    translations.reset();
    translations.location = region.tlocation.url;
    translations.init(progressTranslations, translationsStatus);
  }
  
  function translationsStatus() {
    progressTranslations('current translations contain words like ' + translations.translate(329) + ', ' + translations.translate(323) + ' and ' + translations.translate(335));
    $scope.isLoading = false;
  }
  
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
    dntReset();
    if($scope.location != noLocation) {
      region.alternativeFiles.url = $scope.location;
      
      region.init();
      if(region.alternativeFiles.region == region.tlocation.region) {
        translations.reset();
        translations.init(progressTranslations, translationsStatus);
      }
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
