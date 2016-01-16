angular.module('regionController', ['ngRoute','translationService','regionService'])
.controller('RegionCtrl', 
  ['$scope','$timeout','$route','$routeParams','$location','translations','region',
  function($scope,$timeout,$route,$routeParams,$location,translations,region) {

    region.init();
    translations.init(
      function(msg) { console.log(msg) }, 
      function() {
        $timeout();
      });
    
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
      $scope.edit = !$scope.edit;
    }
  }
])
.directive('dngearsimRegion', function() {
  return {
    templateUrl: 'partials/region.html'
  };
});