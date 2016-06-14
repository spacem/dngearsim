angular.module('dnsim').controller('itemViewExtractionCtrl',

['$timeout','hCodeValues','translations','dntData','itemFactory','items',
  function($timeout, hCodeValues, translations, dntData, itemFactory, items) {
  'use strict';
  
  if(this.item == null) return;
  
  var vm = this;
  
  var extractFileName = 'itemdroptable_disjoint.lzjson';
  var allItemFileName = 'all-items.lzjson';
  
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

      var itemIndex = 0;
      do {
        itemIndex++;
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
                item: {
                  id: pouchItem,
                  name: vm.translate(itemds[0].NameID, itemds[0].NameIDParam),
                  rank: hCodeValues.rankNames[itemds[0].Rank],
                  icon: itemds[0].IconImageIndex,
                  levelLimit : itemds[0].LevelLimit,
                  fileName: itemds[0].fileName,
                }
              });
            }
          }
        }
      } while(pouchItem);
    }
  }
  
  this.translate = function(nameId, nameParam) {
    return translations.translate(nameId, nameParam);
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