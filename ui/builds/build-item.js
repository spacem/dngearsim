angular.module('dnsim').controller('buildItemCtrl',

['$timeout','statHelper','saveHelper','hCodeValues',
function($timeout,statHelper,saveHelper,hCodeValues) {
  'use strict';
  
  var vm = this;
  
  vm.updateItem = setFullStats;
  vm.gemSlots = hCodeValues.gemExchanges;
  vm.getGemSlotName = getGemSlotName;
  
  function getGemSlotName(item) {
    if(item.gemSlot) {
      for(var i=0;i<vm.gemSlots.length;++i) {
        if(vm.gemSlots[i].id == item.gemSlot) {
          return vm.gemSlots[i].name;
        }
      }
    }
  }
  
  function setFullStats() {
    // full stats are cleared when publishing builds
    vm.item.fullStats = vm.item.stats;
    
    if(vm.item.enchantmentStats != null && vm.item.enchantmentStats.length > 0) {
      vm.item.fullStats = hCodeValues.mergeStats(vm.item.enchantmentStats, vm.item.fullStats);
    }
    
    if(vm.item.sparkStats != null && vm.item.sparkStats.length > 0) {
      vm.item.fullStats = hCodeValues.mergeStats(vm.item.sparkStats, vm.item.fullStats);
    }
  }
  
}])
.directive('dngearsimBuildItem', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
      editMode: '=editMode',
      onChange: '&onChange',
      cancelEdit: '&cancelEdit'
    },
    controller: 'buildItemCtrl',
    controllerAs: 'ctrl',
    templateUrl: 'ui/builds/build-item.html'
  };
});