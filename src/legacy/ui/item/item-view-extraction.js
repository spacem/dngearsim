angular.module('dnsim').controller('itemViewExtractionCtrl',

['$timeout','dntData','itemFactory','items',
  function($timeout, dntData, itemFactory, items) {
  'use strict';
  
  if(this.item == null) return;
  
  var vm = this;
  
  var extractFileName = 'itemdroptable_disjoint.json';
  var allItemFileName = 'all-items.json';
  
  var files = [extractFileName,allItemFileName];
  for(var i=0;i<files.length;++i) {
    dntData.init(files[i], null, function() {}, function() {
      $timeout(function() {
        vm.initExtract();
      });
    });
  }
  
  this.initExtract = function() {
    for(var i=0;i<files.length;++i) {
      if(!dntData.isLoaded(files[i])) {
        return;
      }
    }
    
    var disjoint;
    var d = itemFactory.getItemData(vm.item);
    if(d && d.DisjointDrop1 > 0) {
      disjoint = d.DisjointDrop1;
    }
    
    var itemType = items[vm.item.itemSource];
    if(itemType && d.EnchantID) {
      var enchantments = dntData.find(itemType.enchantDnt, 'EnchantID', d.EnchantID);
      if(!enchantments.length && itemType.enchantDnt2) {
        enchantments = dntData.find(itemType.enchantDnt2, 'EnchantID', d.EnchantID);
      }

      for(var i=0;i<enchantments.length;++i) {
        if(enchantments[i].EnchantLevel == vm.item.enchantmentNum) {
          disjoint = enchantments[i].DisjointDrop;
          break;
        }
      }
    }
    
    vm.items = [];
    if(disjoint) {
      vm.getItems(disjoint);
    }
  }
  
  this.getGold = function() {
    var d = itemFactory.getItemData(this.item);
    return Number(d.Disjointamount)/100/100;
  }
  
  this.getItems = function(disjoint) {
    // console.log('checking ' + pouchFileName + ' for ' + boxType);
    
    var pouchData = dntData.find(extractFileName, 'id', disjoint);
    if(pouchData.length == 0) {
    }
    else {
      var gold = pouchData[0].GoldMin;

      var itemIndex = 1;
      while('Item' + itemIndex + 'Index' in pouchData[0]) {
        var isGroup = pouchData[0]['IsGroup' + itemIndex];
        var pouchItem = pouchData[0]['Item' + itemIndex + 'Index'];
        var pouchItemCount = pouchData[0]['Item' + itemIndex + 'Info'];
        //console.log('pouch contains ' + pouchItem);
        if(pouchItem) {
          if(isGroup) {
            vm.getItems(pouchItem);
          }
          else {
            var itemds = dntData.find(allItemFileName, 'id', pouchItem);
            if(itemds.length > 0) {
              //console.log('found item ');
  
              vm.items.push({
                count: pouchItemCount,
                gold: gold,
                item: itemFactory.createBasicItem(itemds[0]),
              });
            }
          }
        }
        itemIndex++;
      }
    }
  }

}])
.directive('dngearsimItemViewExtraction', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
    },
    controller: 'itemViewExtractionCtrl',
    controllerAs: 'ctrl',
    templateUrl: 'ui/item/item-view-extraction.html'
  };
});