(function () {
'use strict';
angular.module('dnsim').controller('ProfileCtrl', ['$location', '$routeParams', 'onlineService', profile]);

function profile($location, $routeParams, onlineService) {
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
  
  this.openServer = function(buildName) {
    $location.path('/published/' + vm.uid + '/' + buildName);
  }
  
  this.load = function(buildName, build) {

    var newGroupName = saveHelper.importGroup(buildName, build.items);
    
    saveHelper.renameSavedGroup(
      newGroupName, 
      newGroupName,
      build.enemyLevel,
      build.playerLevel,
      build.heroLevel,
      build.job,
      build.damageType,
      build.element,
      build.secondaryElement,
      build.enemyStatCaps, 
      build.playerStatCaps, 
      build.conversions, 
      build.baseStats, 
      build.heroStats);
      
    vm.builds = saveHelper.getSavedItems();
    
    $location.path('/builds/' + newGroupName);
  }
}

})();