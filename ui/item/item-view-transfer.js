angular.module('dnsim').controller('itemViewTransferCtrl',

['$timeout','dntData','itemFactory','hCodeValues',
  function($timeout, dntData, itemFactory, hCodeValues) {
  'use strict';
  
  if(this.item == null) return;
  
  var vm = this;
  vm.matchingTransfers = [];
  
  var transferFileName = 'enchanttransfertable.lzjson';
  var allItemFileName = 'all-items.lzjson';
  var transferItemsFileName = 'enchanttransferitemtable.lzjson';
  
  var files = [transferFileName,allItemFileName,transferItemsFileName];
  for(var i=0;i<files.length;++i) {
    dntData.init(files[i], null, function() {}, function() {
      $timeout(function() {
        vm.initTransfers();
      });
    });
  }
  
  this.initTransfers = function() {
    for(var i=0;i<files.length;++i) {
      if(!dntData.isLoaded(files[i])) {
        return;
      }
    }
    vm.matchingTransfers = [];
    
    var transferItem = dntData.find(transferItemsFileName, 'ItemID', vm.item.id);
    if(transferItem && transferItem.length > 0) {
      var transfers = dntData.find(transferFileName, 'EnchantLevel', vm.item.enchantmentNum);
      
      for(var i=0;i<transfers.length;++i) {
        var t = transfers[i];
        if(t.Rank == vm.item.rank.id && t.LevelLimit == vm.item.levelLimit) {
          
          var item1s = dntData.find(allItemFileName, 'id', t.NeedItemID1);
          var item2s = dntData.find(allItemFileName, 'id', t.NeedItemID2);
          
          vm.matchingTransfers.push({
            level: t.ResultLevel,
            enchantmentNum: t.ResultEnchantLevel,
            gold: t.NeedCoin/100/100,
            rank: hCodeValues.rankNames[t.ResultRank],
            numItem1: t.NeedItemCount1,
            item1: itemFactory.createBasicItem(item1s[0]),
            numItem2: t.NeedItemCount2,
            item2: itemFactory.createBasicItem(item2s[0]),
          });
        }
      }
    }
  }

}])
.directive('dngearsimItemViewTransfer', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
    },
    controller: 'itemViewTransferCtrl',
    controllerAs: 'ctrl',
    template: require('./item-view-transfer.html')
  };
});