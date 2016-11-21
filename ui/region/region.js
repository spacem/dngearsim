angular.module('dnsim').controller('RegionCtrl', 
  ['$timeout','$route','$routeParams','$location','translations','region','$http',
  function($timeout,$route,$routeParams,$location,translations,region,$http) {
    'use strict';
    
    var vm = this;

    vm.override = region.getOverride();
    region.init();
    translations.init(
      function(msg) { 
        // console.log(msg);
      }, 
      function() {
        $timeout();
      });
      
    vm.region = region;
    vm.tHoverLocation = region.tlocation;
    vm.hoverLocation = region.dntLocation;
    vm.edit = (region.dntLocation == null);
    vm.dntVersion = '';
    setDntVersion();
    
    function setDntVersion() {
      console.log('setting version for ', vm.region.dntLocation);
      if(vm.region.dntLocation && vm.region.dntLocation.url) {
        $http.get(vm.region.dntLocation.url + '/Version.cfg').then(function(res) {
          if(res && res.data) {
            var details = res.data.split('\r\n');
            if(details.length) {
              var details = details[0].split(' ');
              if(details.length > 1) {
                vm.dntVersion = 'v' + details[1];
              }
            }
          }
        });
      }
    }
    
    vm.getDntLocation = function() {
      return region.dntLocation;
    };
    vm.getTlocation = function() {
      return region.tlocation;
    };
     
    vm.getHostedFiles = function() {
      // console.log('getting hosted files');
      return region.hostedFiles;
    };
    
    vm.getWorldName = function() {
      if(translations.isLoaded()) {
        return translations.translate(10169);
      }
      else {
        return '';
      }
    };
    
    vm.setTLocation = function(location) {
      region.setTLocation(location);
      vm.edit = false;
    };
    
    vm.setLocation = function(location) {
      if(!vm.override) {
        vm.setTLocation(null);
      }
      
      if($routeParams.region) {
        $routeParams.region = location.region;
        $route.updateParams($routeParams);
        $route.reload();
      }
      else {
        region.setLocation(location);
      }
      vm.edit = false;
      setDntVersion();
    };
    
    vm.setOverride = function(value) {
      region.setOverride(value);
      vm.override = value;
      vm.edit = value;
    };
  }
])
.directive('dngearsimRegion', function() {
  return {
    templateUrl: 'ui/region/region.html',
    controllerAs: 'ctrl',
  };
});