angular.module('dnsim').controller('buildActionsCtrl',

['$location','saveHelper','exportLinkHelper',
function($location,saveHelper,exportLinkHelper) {
  'use strict';
  
  var vm = this;
  
  this.deleteGroup = function() {
    $location.path('/delete-build/' + vm.buildName);
  }
  
  this.editGroup = function() {
    $location.path('/edit-build/' + vm.buildName)
  }
  
  this.copyGroup = function() {
    var newGroupName = saveHelper.importGroup(vm.buildName, vm.build.items);
    
    saveHelper.renameSavedGroup(
      newGroupName, 
      newGroupName,
      vm.build.enemyLevel,
      vm.build.playerLevel,
      vm.build.heroLevel,
      vm.build.job,
      vm.build.damageType,
      vm.build.element,
      vm.build.secondaryElement,
      vm.build.enemyStatCaps, 
      vm.build.playerStatCaps, 
      vm.build.conversions, 
      vm.build.baseStats, 
      vm.build.heroStats);
    
    $location.path('/build/' + newGroupName);
  }
  
  this.reloaded = false;
  this.reloadGroup = function() {
    $location.path('/reload-build/' + vm.buildName);
  }
  
  function progress() {
  }
  
  this.createShortUrl = function() {
    exportLinkHelper.createShortUrl(vm.buildName, vm.build);
  }
    
  this.setShortUrl = function() {
    if(vm.build) {
      var longUrl = exportLinkHelper.createGroupLink(vm.buildName, vm.build);
      vm.build.shortUrl = sessionStorage.getItem(longUrl);
    }
  }
  
  this.setShortUrl();
}])
.directive('dngearsimBuildActions', function() {
  return {
    scope: true,
    bindToController: {
      buildName: '=buildName',
      build: '=build',
      onChange: '&onChange'
    },
    controller: 'buildActionsCtrl',
    controllerAs: 'buildActions',
    templateUrl: 'ui/builds/build-actions.html'
  };
});