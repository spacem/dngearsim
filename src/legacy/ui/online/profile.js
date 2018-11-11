(function () {
'use strict';
angular.module('dnsim').controller('ProfileCtrl', ['$location', '$routeParams', 'onlineService', 'saveHelper', profile]);

function profile($location, $routeParams, onlineService, saveHelper) {
  'use strict';
  
  var vm = this;
  vm.uid = $routeParams.uid;
  
  getSavedBuilds();
  getProfile();
  
  function getSavedBuilds() {
    onlineService.getUserBuilds(vm.uid).then(function(builds) {
      if(builds) {
        vm.storedBuilds = builds;
      }
      else {
        vm.storedBuilds = {};
      }
    });
  }
  
  function getProfile() {
    onlineService.getProfile(vm.uid).then(function(profile) {
      if(profile) {
        vm.profile = profile;
      }
      else {
        vm.profile = {};
      }
    });
  }
  
  this.load = function(buildName, build) {

    var newGroupName = saveHelper.importGroup(buildName, build.items);
    
    saveHelper.saveBuild(
      newGroupName, 
      newGroupName,
      build);
      
    vm.builds = saveHelper.getSavedItems();
    
    $location.path('/build');
    $location.search('buildName', newGroupName);
  }
}

})();