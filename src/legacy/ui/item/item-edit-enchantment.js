angular.module('dnsim').controller('itemEditEnchantmentCtrl',

function(dntData,hCodeValues,items,$timeout,translations,itemColumnsToLoad,itemFactory) {
  'use strict';
  
  var vm = this;
  
  if(!vm.item || !vm.item.enchantmentId) {
    console.log('no item to ehnance', vm.item);
    return;
  }
  
  if('itemSource' in this.item) {
    vm.itemType = items[vm.item.itemSource];
  }
  
  if(!vm.itemType) {
    console.log('no item type to ehnance');
    return;
  }
  if(!('enchantDnt' in vm.itemType) && !('petLevelDnt' in vm.itemType)) {
    console.log('no dnt for ehnance');
    return;
  }
  
  if(vm.itemType.enchantDnt) {
    dntData.init(vm.itemType.enchantDnt, itemColumnsToLoad.enchantDnt, null, vm.getEnchantments);
  }
  if(vm.itemType.enchantDnt2) {
    dntData.init(vm.itemType.enchantDnt2, itemColumnsToLoad.enchantDnt, null, vm.getEnchantments);
  }
  
  if(vm.itemType.petLevelDnt) {
    dntData.init(vm.itemType.petDnt, itemColumnsToLoad.petDnt, null, vm.getEnchantments);
    dntData.init(vm.itemType.petLevelDnt, itemColumnsToLoad.petLevelDnt, null, vm.getEnchantments);
  }
  
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
        vm.item.enchantmentNum = 0;
        vm.onChange();
      }
      
      for(var i=0;i<vm.enchantments.length;++i) {
        if(vm.item.enchantmentNum == getEnchantLevel(i)) {
          vm.enchantment = vm.enchantments[i];
          
          vm.item.enchantmentStats = hCodeValues.getStats(vm.enchantment);
        }
        else if(vm.item.enchantmentNum + 1 == getEnchantLevel(i)) {
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
  
  function getEnchantLevel(num) {
    if('petLevelDnt' in vm.itemType) {
      return vm.enchantments[num].PetLevel;
    }
    else {
      return vm.enchantments[num].EnchantLevel;
    }
  }
  
  this.setPetLevel = function() {
    vm.item.enchantmentStats = [];

    if(vm.enchantments && vm.enchantments.length > 0) {

      if(typeof vm.item.enchantmentNum != 'number') {
        vm.item.enchantmentNum = 6;
        vm.onChange();
      }
      
      for(var i=0;i<vm.enchantments.length;++i) {
        if(vm.item.enchantmentNum == vm.enchantments[i].PetLevel) {
          vm.enchantment = vm.enchantments[i];
          
          vm.item.enchantmentStats = hCodeValues.getStats(vm.enchantment);
        }
      }
    }
  }
  
  this.isMaxEnchantLevel = function() {

    if(vm.enchantments != null &&
      vm.enchantments.length > 0 &&
      typeof vm.item.enchantmentNum == 'number') {

      for(var i=0;i<vm.enchantments.length;++i) {
        if(vm.item.enchantmentNum + 1 == getEnchantLevel(i)) {
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
    if('petLevelDnt' in vm.itemType) {
      vm.setPetLevel();
    }
    else {
      vm.setEnchantment();
    }
    vm.onChange();
  }
  
  this.nextEnchantment = function() {
    for(var i=vm.item.enchantmentNum;i==0||vm.enchantments[i-1];++i) {
      if(i == 0) {
        vm.enhancementOptions.push({number: 0});
      }
      else {
        vm.enhancementOptions.push(vm.getOption(i-1));
      }
    }
  }
  
  this.prevEnchantment = function() {
    vm.enhancementOptions = [];
    for(var i=vm.item.enchantmentNum;i>0;--i) {
      vm.enhancementOptions.push(vm.getOption(i-1));
    }
    
    vm.enhancementOptions.push({number: 0});
  }
  
  this.getOption = function(enchantmentNum) {
    return {
      number: getEnchantLevel(enchantmentNum),
      stats: hCodeValues.getStats(vm.enchantments[enchantmentNum])
    };
  }
  
  this.getEnchantments = function() {
    if(!vm.enchantments && vm.item && vm.item.enchantmentId) {
      if(vm.itemType.enchantDnt && dntData.isLoaded(vm.itemType.enchantDnt)) {
        vm.enchantments = dntData.find(vm.itemType.enchantDnt, 'EnchantID', vm.item.enchantmentId);
        if(!vm.enchantments.length && vm.itemType.enchantDnt2) {
          vm.enchantments = dntData.find(vm.itemType.enchantDnt2, 'EnchantID', vm.item.enchantmentId);
        }
        vm.setEnchantment();
      }
      if(vm.itemType.petLevelDnt && dntData.isLoaded(vm.itemType.petLevelDnt)) {
        vm.enchantments = dntData.find(vm.itemType.petLevelDnt, 'PetLevelTypeID', vm.item.enchantmentId);
        vm.setPetLevel();
      }
    }
    
    return vm.enchantments;
  }
  
  var fileName = 'all-items.json';
  
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
              if(item) {
                var material = {
                  item: itemFactory.createBasicItem(item),
                  num: itemCount,
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
})
.directive('dngearsimItemEditEnchantment', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
      onChange: '&onChange',
    },
    controller: 'itemEditEnchantmentCtrl',
    controllerAs: 'editCtrl',
    template: require('./item-edit-enchantment.html')
  };
});