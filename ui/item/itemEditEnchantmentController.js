angular.module('dnsim').controller('itemEditEnchantmentCtrl',

['dntData','hCodeValues','items','$timeout','translations',
function(dntData,hCodeValues,items,$timeout,translations) {
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
  vm.enhancementOptions = [];
  if(vm.item.enchantmentStats == null) {
    vm.item.enchantmentStats = [];
  }
  
  this.setEnchantment = function() {
    vm.item.enchantmentStats = [];

    if(vm.enchantments && vm.enchantments.length > 0) {

      if(typeof vm.item.enchantmentNum != 'number') {
        vm.item.enchantmentNum = 6;
        vm.onChange();
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
  
  this.setEnchantmentNum = function(enhancementOption) {
    vm.item.enchantmentNum = enhancementOption;
    vm.enhancementOptions = [];
    vm.setEnchantment();
    vm.onChange();
  }
  
  this.nextEnchantment = function() {
    vm.enhancementOptions = [vm.item.enchantmentNum];
    for(var i=vm.item.enchantmentNum;vm.enchantments[i];++i) {
      vm.enhancementOptions.push(vm.enchantments[i].EnchantLevel);
    }
  }
  
  this.prevEnchantment = function() {
    vm.enhancementOptions = [vm.item.enchantmentNum];
    for(var i=vm.item.enchantmentNum;i>0;--i) {
      vm.enhancementOptions.push(vm.enchantments[i-1].EnchantLevel-1);
    }
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
  
  var fileName = 'all-items.lzjson';
  
  this.showMaterials = function() {
    dntData.init(fileName, null, function() {}, function() {
      $timeout(function() {
        
        if(!vm.enchantmentAfter) {
          return;
        }
        
        vm.materials = [];
        for(var i=1;i<=5;++i) {
          var itemId = vm.enchantmentAfter['NeedItemID' + i];
          var itemCount = vm.enchantmentAfter['NeedItemCount' + i];
          if(itemId > 0 && itemCount > 0) {
            
            var items = dntData.find(fileName, 'id', itemId);
            if(items.length == 0) {
              vm.materials.push({num: itemCount, name: 'unknown (' + itemId + ')'});
            }
            else {
              var item = items[0];
              var name = translations.translate(item.NameID, item.NameIDParam);
              
              if(item) {
                var material = {
                  num: itemCount,
                  icon: item.IconImageIndex,
                  rank: item.Rank,
                  levelLimit: item.LevelLimit,
                  name: name
                };
                vm.materials.push(material);
              }
            }
          }
        }
      });
    });
  }
  
  if(dntData.isLoaded(fileName)) {
    this.showMaterials();
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
    templateUrl: 'ui/item/item-edit-enchantment.html'
  };
});