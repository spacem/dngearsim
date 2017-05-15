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
    
    saveHelper.saveBuild(
      newGroupName, 
      newGroupName,
      vm.build);
    
    $location.path('/build/' + newGroupName);
  }
  
  this.reloaded = false;
  this.reloadGroup = function() {
    $location.path('/reload-build/' + vm.buildName);
  }
  
  function progress() {
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