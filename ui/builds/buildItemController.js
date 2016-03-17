angular.module('dnsim').controller('buildItemCtrl',

['$timeout','statHelper','saveHelper',
function($timeout,statHelper,saveHelper) {
  'use strict';
  
  var vm = this;
    
  this.removeItem = function() {
    vm.item.removeItem = true;
    var newItemList = [];
    angular.forEach(vm.build.items, function(gItem, index) {
      if(!gItem.removeItem) {
        newItemList.push(gItem);
      }
    });
    
    saveHelper.updatedSavedItems(vm.buildName, newItemList);
    $timeout(function() {
      vm.build.items = newItemList;
    });
  }
  
}])
.directive('dngearsimBuildItem', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
      buildName: '=buildName',
      build: '=build',
    },
    controller: 'buildItemCtrl',
    controllerAs: 'buildItem',
    templateUrl: 'ui/builds/build-item.html?bust=' + Math.random().toString(36).slice(2)
  };
});