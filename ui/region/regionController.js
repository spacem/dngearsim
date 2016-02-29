angular.module('dnsim').controller('RegionCtrl', 
  ['$scope','$timeout','$route','$routeParams','$location','translations','region',
  function($scope,$timeout,$route,$routeParams,$location,translations,region) {
    'use strict';

    region.init();
    translations.init(
      function(msg) { 
        // console.log(msg);
      }, 
      function() {
        $timeout();
      });
    
    $scope.dntLocation = region.dntLocation;
    $scope.tlocation = region.tlocation;
     
    $scope.getHostedFiles = function() {
      // console.log('getting hosted files');
      return region.hostedFiles;
    }
    
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
    templateUrl: 'ui/region/region.html?bust=' + Math.random().toString(36).slice(2)
  };
});