angular.module('dnsim').controller('ReloadBuildCtrl',
['$location','$routeParams','$timeout','saveHelper','dntData','dntReset','groupHelper','translations',reloadBuildCtrl]);

function reloadBuildCtrl($location,$routeParams,$timeout,saveHelper,dntData,dntReset,groupHelper,translations) {
  'use strict';
  
  var vm = this;
  if('name' in $routeParams) {
      vm.name = $routeParams.name;
  }
  
  var savedItems = saveHelper.getSavedItems();
  if(vm.name in savedItems) {
    vm.build = savedItems[vm.name];
  }
  
  vm.reloaded = false;
  vm.reload = function() {
    dntReset();
    vm.reloaded = false;
    
    translations.init(progress, tryInit);

    var files = groupHelper.getDntFiles(vm.build);
    angular.forEach(files, function(columns, fileName) {
      dntData.init(fileName, columns, progress, tryInit);
    });
  }
  
  vm.goToBuild = function() {
    $location.path('/build/' + vm.name);
  }
  
  function progress() {
  }

  function tryInit() {
    if(vm.reloaded) {
      return;
    }
    
    var allLoaded = true;
    var files = groupHelper.getDntFiles(vm.build);
    angular.forEach(files, function(columns, fileName) {
      if(!dntData.isLoaded(fileName)) {
        allLoaded = false;
        return;
      }
    });
    
    if(allLoaded && translations.isLoaded()) {
      var newItems = groupHelper.reloadGroup(vm.name, vm.build);
      saveHelper.updatedSavedItems(vm.name, newItems);
      vm.build.items = newItems;
      
      vm.reloaded = true;
    }
  }
    
}