(function () {
'use strict';
angular.module('dnsim').controller('PublishCtrl', ['$location', 'saveHelper', 'onlineService', '$routeParams', 'region', publish]);

function publish($location, saveHelper, onlineService, $routeParams, region) {
  'use strict';
  
  var vm = this;
  
  vm.show = $routeParams.show;
  
  onlineService.login().then(function(user) {
    getSavedBuilds();
    getProfile();
  
    vm.builds = saveHelper.getSavedItems();
  });
  
  function getSavedBuilds() {
    var user = vm.getUser();
    if(user) {
      onlineService.getUserBuilds(user.uid).then(function(builds) {
        if(builds) {
          vm.storedBuilds = builds;
        }
        else {
          vm.storedBuilds = {};
        }
      });
    }
  }
  
  function getProfile() {
    var user = vm.getUser();
    if(user) {
      onlineService.getProfile(user.uid).then(function(profile) {
        if(profile) {
          vm.profile = profile;
        }
        else {
          vm.profile = {};
        }
      });
    }
  }
  
  this.saveProfile = function() {
    onlineService.saveProfile(vm.profile).then(getProfile).catch(handleError);
  }
  
  this.getUser = function() {
    return onlineService.getUser();
  }
  
  this.save = function(buildName, build) {
    build.lastUpdate = (new Date()).getTime();
    onlineService.saveBuild(buildName, build).then(getSavedBuilds).catch(handleError);
    vm.publishBuild = null;
  }
  
  this.startPublish = function(buildName) {
    if(buildName in vm.storedBuilds) {
      if(!vm.builds[buildName].region) {
        vm.builds[buildName].region = vm.storedBuilds[buildName].region;
      }
      
      if(!vm.builds[buildName].about) {
        vm.builds[buildName].about = vm.storedBuilds[buildName].about;
      }
      
      if(!vm.builds[buildName].guild) {
        vm.builds[buildName].guild = vm.storedBuilds[buildName].guild;
      }
    }
    
    if(!vm.builds[buildName].region) {
      vm.builds[buildName].region = region.dntLocation.region;
    }
    
    vm.publishBuild = buildName;
  }
  
  function handleError(err) {
    console.log(err);
  }
  
  this.deleteAccount = function() {
    onlineService.deleteAccount(vm.storedBuilds);
  }
  
  this.openLocal = function(buildName) {
    $location.path('/build/' + buildName);
  }
  
  this.openServer = function(buildName) {
    $location.path('/published/' + vm.getUser().uid + '/' + buildName);
  }
  
  this.getBuildLimit = function() {
    if(vm.profile && vm.profile.maxBuilds) {
      return vm.profile.maxBuilds;
    }
    else {
      return 15;
    }
  }
  
  this.getNumStoredBuilds = function() {
    return _.size(vm.storedBuilds);
  }
  
  this.getNumBuilds = function() {
    return _.size(vm.builds);
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
  }
  
  this.signOut = function() {
    onlineService.signOut();
  }
  
  vm.deleteLocal = function(buildName) {
    vm.localToDelete = buildName;
  }
  
  vm.getAllBuildNames = function() {
    var allKeys = _.keys(vm.builds).concat(_.keys(vm.storedBuilds));
    return _.uniq(allKeys.sort(), true);
  }
  
  vm.reallyDeleteLocal = function(buildName) {
    saveHelper.updatedSavedItems(buildName, []);
    vm.localToDelete = null;
    vm.builds = saveHelper.getSavedItems();
  }
  
  vm.deleteServer = function(buildName) {
    vm.serverToDelete = buildName;
  }
  
  vm.reallyDeleteServer = function(buildName) {
    onlineService.deleteBuild(buildName, vm.storedBuilds[buildName]).then(getSavedBuilds);
    vm.serverToDelete = null;
  }
  
}

})();