angular.module('dnsim').controller('buildActionsCtrl',

['$location','saveHelper','exportLinkHelper',
function($location,saveHelper,exportLinkHelper) {
  'use strict';
  
  var vm = this;
  
  this.deleteGroup = function() {
    $location.path('/delete-build');
    $location.search('name', vm.buildName);
  }
  
  this.editGroup = function() {
    $location.path('/edit-build');
    $location.search('buildName', vm.buildName);
  }
  
  this.copyGroup = function() {
    var newGroupName = saveHelper.importGroup(vm.buildName, vm.build.items);
    
    saveHelper.saveBuild(
      newGroupName, 
      newGroupName,
      vm.build);
    
    $location.path('/build');
    $location.search('buildName', newGroupName);
  }
  
  this.reloaded = false;
  this.reloadGroup = function() {
    $location.path('/reload-build');
    $location.search('name', vm.buildName);
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
    template: require('!raw-loader!./build-actions.html').default
  };
});