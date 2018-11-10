angular.module('dnsim').controller('itemEditCtrl',

['hCodeValues',
function(hCodeValues) {
  'use strict';
  
  var vm = this;
  
  if(!vm.item) {
    return;
  }
  
  vm.onUpdateItem = function() {
    vm.updateItem();
  }
  
}])
.directive('dngearsimItemEdit', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
      onChange: '&onChange',
      updateItem: '&updateItem'
    },
    controller: 'itemEditCtrl',
    controllerAs: 'ctrl',
    templateUrl: 'ui/item/item-edit.html'
  };
});