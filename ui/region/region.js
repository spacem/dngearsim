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
      
    $scope.region = region;
    
    $scope.getDntLocation = function() {
      return region.dntLocation;
    }
    $scope.getTlocation = function() {
      return region.tlocation;
    }
     
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
      $scope.edit = false;
    }
    
    $scope.setLocation = function(location) {
      if($routeParams.region) {
        $routeParams.region = location.region;
        $route.updateParams($routeParams);
      }
      else {
        region.setLocation(location);
      }
      $scope.edit = !$scope.edit;
    }
  }
])
.directive('dngearsimRegion', function() {
  return {
    templateUrl: 'ui/region/region.html'
  };
});