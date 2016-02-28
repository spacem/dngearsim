angular.module('itemEditEnchantmentController', ['translationService', 'dntServices'])
.controller('itemEditEnchantmentCtrl',

['dntData','hCodeValues','items',
function(dntData,hCodeValues,items) {
  'use strict';
  
  if(this.item == null) return;
  if('itemSource' in this.item) {
    this.itemType = items[this.item.itemSource];
  }
  
  if(!this.itemType || !('enchantDnt' in this.itemType)) {
    return;
  }
  
  var vm = this;
  
  vm.enchantments = null;
  vm.enchantment = null;
  vm.enchantmentAfter = null;
  vm.enchantmentCost = '';
  if(vm.item.enchantmentStats == null) {
    vm.item.enchantmentStats = [];
  }
  
  this.setEnchantment = function() {
    vm.item.enchantmentStats = [];
      
    if(vm.enchantments && vm.enchantments.length > 0) {

      if(typeof vm.item.enchantmentNum != 'number') {
        vm.item.enchantmentNum = 6;
      }
      
      for(var i=0;i<vm.enchantments.length;++i) {
        if(vm.item.enchantmentNum == vm.enchantments[i].EnchantLevel) {
          vm.enchantment = vm.enchantments[i];
          
          vm.item.enchantmentStats = hCodeValues.getStats(vm.enchantment);
        }
        else if(vm.item.enchantmentNum + 1 == vm.enchantments[i].EnchantLevel) {
          vm.enchantmentAfter = vm.enchantments[i];
          if(vm.enchantmentAfter.NeedCoin < 10000) {
            vm.enchantmentCost = Math.round(vm.enchantmentAfter.NeedCoin / 1000)/10 + 'g';
          }
          else {
            vm.enchantmentCost = Math.round(vm.enchantmentAfter.NeedCoin / 10000) + 'g';
          }
        }
      }
    }
  }
  
  this.isMaxEnchantLevel = function() {

    if(vm.enchantments != null &&
      vm.enchantments.length > 0 &&
      typeof vm.item.enchantmentNum == 'number') {

      for(var i=0;i<vm.enchantments.length;++i) {
        if(vm.item.enchantmentNum + 1 == vm.enchantments[i].EnchantLevel) {
          return false;
        }
      }
      return true;
    }
    else {
      return false;
    }
  }
  
  this.nextEnchantment = function() {
    if(vm.item.enchantmentNum < vm.enchantments.length) {
      vm.item.enchantmentNum++;
      vm.setEnchantment();
      vm.onChange();
    }
  }
  
  this.prevEnchantment = function() {
    if(vm.item.enchantmentNum > 0) {
      vm.item.enchantmentNum--;
    }
    else {
      vm.item.enchantmentNum = 0;
    }

    vm.setEnchantment();
    vm.onChange();
  }
  
  this.getEnchantments = function() {
    if(!vm.enchantments && vm.item && vm.item.enchantmentId) {
      if(dntData.isLoaded(vm.itemType.enchantDnt)) {
        var eid = vm.item.enchantmentId;
        vm.enchantments = dntData.find(vm.itemType.enchantDnt, 'EnchantID', eid);
        vm.setEnchantment();
      }
    }
    
    return vm.enchantments;
  }

  function reportProgress(msg) {
    // console.log('progress: ' + msg);
  }
}])
.directive('dngearsimItemEditEnchantment', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
      onChange: '&onChange',
    },
    controller: 'itemEditEnchantmentCtrl',
    controllerAs: 'editCtrl',
    templateUrl: 'ui/item/item-edit-enchantment.html?bust=' + Math.random().toString(36).slice(2)
  };
});