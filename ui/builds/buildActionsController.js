angular.module('dnsim').controller('buildActionsCtrl',

['$timeout','$location','hCodeValues','statHelper','itemCategory','saveHelper','exportLinkHelper','groupHelper','translations','dntData',
function($timeout,$location,hCodeValues,statHelper,itemCategory,saveHelper,exportLinkHelper,groupHelper,translations,dntData) {
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
    $location.path('/builds/' + newGroupName);
  }
  
  this.reloadGroup = function() {
  
    var files = groupHelper.getDntFiles(vm.build);
    angular.forEach(files, function(columns, fileName) {
      dntData.init(fileName, columns, progress, tryInit);
    });
    
    translations.init(progress, tryInit);
    vm.onChange();
  }

  function tryInit() {
    var allLoaded = true;
    var files = groupHelper.getDntFiles(vm.build);
    angular.forEach(files, function(columns, fileName) {
      if(!dntData.isLoaded(fileName)) {
        allLoaded = false;
        return;
      }
    });
    
    if(allLoaded && translations.isLoaded()) {
      var newItems = groupHelper.reloadGroup(vm.buildName, vm.build);
      saveHelper.updatedSavedItems(vm.buildName, newItems);
      vm.build.items = newItems;
      $timeout();
    }
  }
  
  function progress() {
  }
  
  this.createShortUrl = function() {
    exportLinkHelper.createShortUrl(vm.buildName, vm.build);
  }
    
  this.setShortUrl = function() {
    var longUrl = exportLinkHelper.createGroupLink(vm.buildName, vm.build);
    vm.build.shortUrl = sessionStorage.getItem(longUrl);
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
    templateUrl: 'ui/builds/build-actions.html?bust=' + Math.random().toString(36).slice(2)
  };
});