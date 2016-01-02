angular.module('regionController', ['ngRoute','translationService','regionService'])
.controller('RegionCtrl', 
  ['$scope','$route','$routeParams','$location','translations','region',
  function($scope,$route,$routeParams,$location,translations,region) {

    region.init();
    $scope.hostedFiles = region.hostedFiles;
    $scope.dntLocation = region.dntLocation;
    $scope.tlocation = region.tlocation;
    
    $scope.getWorldName = function() {
      if(translations.isLoaded()) {
        return translations.translate(10169);
      }
      else {
        return '';
      }
    }
    
    $scope.setTLocation = function(location) {
      region.setTLocation(location);
      $scope.tlocation = region.tlocation;
      $scope.edit = false;
    }
    
    $scope.setLocation = function(location) {
      region.setLocation(location);
      $scope.dntLocation = region.dntLocation;
      $scope.tlocation = region.tlocation;
      $scope.edit = false;
    }
  }
])
.directive('dngearsimRegion', function() {
  return {
    templateUrl: 'partials/region.html'
  };
});