(function () {
'use strict';
angular.module('dnsim').controller('PublishedCtrl', ['onlineService', '$location', '$routeParams', 'saveHelper', 'statHelper', published]);

function published(onlineService, $location, $routeParams, saveHelper, statHelper) {
  'use strict';
  
  var vm = this;
  vm.uid = $routeParams.uid;
  vm.buildName = $routeParams.buildName;
  
  getBuild();
  getProfile();
  
  vm.copyLocally = function() {
    var newGroupName = saveHelper.importGroup(vm.buildName, vm.build.items);
    
    saveHelper.saveBuild(
      newGroupName, 
      newGroupName,
      vm.build);
      
    $location.path('/build');
    $location.search('buildName', newGroupName);
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
  
  function getBuild() {
    onlineService.getBuild(vm.uid, vm.buildName).then(function(build) {
      if(build) {
        vm.build = build;
        vm.stats = statHelper.getBuildStats(build);
      }
      else {
        vm.build = {};
      }
    });
  }
}

})();