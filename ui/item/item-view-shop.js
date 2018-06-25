angular.module('dnsim').controller('itemViewShopCtrl',

['$timeout','dntData','itemFactory','hCodeValues','translations',
  function($timeout, dntData, itemFactory, hCodeValues, translations) {
  'use strict';
  
  if(this.item == null) return;
  
  var vm = this;
  vm.shopCosts = [];
  
  var cShopFileName = 'combinedshoptable.json';
  var cSysShopFileName = 'combinedshoptable_system.json';
  var cCashShopFileName = 'combinedshoptable_cash.json';
  // var shopFileName = 'shoptable.json';
  var allItemFileName = 'all-items.json';
  
  var files = [cCashShopFileName,cSysShopFileName,cShopFileName,allItemFileName];
  for(var i=0;i<files.length;++i) {
    dntData.init(files[i], null, function() {}, function() {
      $timeout(function() {
        vm.initShops();
      });
    });
  }
  
  this.initShops = function() {
    for(var i=0;i<files.length;++i) {
      if(!dntData.isLoaded(files[i])) {
        return;
      }
    }
    
    vm.shopCosts = [];
    getCombinedCosts(cShopFileName);
    getCombinedCosts(cSysShopFileName);
    getCombinedCosts(cCashShopFileName);
    // getShopCosts();
    
    var newShopCosts = [];
    for(var i=0;i<vm.shopCosts.length;++i) {
      var found = false;
      for(var j=0;j<newShopCosts.length;++j) {
        if(vm.shopCosts[i].tabName == newShopCosts[j].tabName &&
          vm.shopCosts[i].gold == newShopCosts[j].gold &&
          vm.shopCosts[i].item1.id == newShopCosts[j].item1.id &&
          vm.shopCosts[i].numItem1.id == newShopCosts[j].numItem1.id &&
          vm.shopCosts[i].item2.id == newShopCosts[j].item2.id &&
          vm.shopCosts[i].numItem2.id == newShopCosts[j].numItem2.id) {
            found = true;
            break;
        }
      }
      
      if(!found) {
        newShopCosts.push(vm.shopCosts[i]);
      }
    }
    
    vm.shopCosts = newShopCosts;
  }
  
  /*
  function getShopCosts() {
    var shops = dntData.getData(shopFileName);
    
    for(var i=0;i<shops.length;++i) {
      var s = shops[i];
      
      var c = 0;
      for(;;) {
        ++c;
        
        var colName = 'itemIndex' + c;
        if(!(colName in s)) {
          break;
        }
        
        var itemId = s[colName];
        if(!itemId) {
          break;
        }
        
        if(itemId == vm.item.id) {
          s = {
            shopName: s.ShopID,
            tabName: translations.translate(s.TabNameID),
            gold: s['Quantity' + c],
          };
          
      
          if(s.shopName in hCodeValues.shopNames) {
            s.shopName = hCodeValues.shopNames[s.shopName];
          }
      
          if(!s.shopName) {
            s.shopName = s.ShopId;
          }
          vm.shopCosts.push(s);
        }
      }
    }
  }*/

  function getCombinedCosts(fileName) {
    var shops = dntData.find(fileName, 'itemindex', vm.item.id);
    
    for(var i=0;i<shops.length;++i) {
      var s = shops[i];
        
      var item1s = dntData.find(allItemFileName, 'id', s.PurchaseItem1);
      var item2s = dntData.find(allItemFileName, 'id', s.PurchaseItem2);
      
      var shopCost = {
        shopName: s.ShopID,
        tabName: translations.translate(s.TabNameID),
        gold: 0,
        nightmarePoints: 0,
        dungeonPoints: 0,
        nestPoints: 0,
        ladderPoints: 0,
        item1: itemFactory.createBasicItem(item1s[0]),
        item2: itemFactory.createBasicItem(item2s[0]),
        numItem1: 0,
        numItem2: 0,
      };
      
      if(shopCost.shopName in hCodeValues.shopNames) {
        shopCost.shopName = hCodeValues.shopNames[shopCost.shopName];
      }
      
      if(s.PurchaseType1 == 1) {
        shopCost.gold += s.PurchaseItemValue1;
      }
      else if(s.PurchaseType1 == 3) {
        shopCost.ladderPoints += s.PurchaseItemValue1;
      }
      else if(s.PurchaseType1 == 8) {
        shopCost.nightmarePoints += s.PurchaseItemValue1;
      }
      else if(s.PurchaseType1 == 13) {
        shopCost.nestPoints += s.PurchaseItemValue1;
      }
      else if(s.PurchaseType1 == 14) {
        shopCost.dungeonPoints += s.PurchaseItemValue1;
      }
      else {
        shopCost.numItem1 = s.PurchaseItemValue1;
        shopCost.pointsId1 = s.PurchaseType1;
      }
      
      if(s.PurchaseType2 == 1) {
        shopCost.gold += s.PurchaseItemValue2;
      }
      else if(s.PurchaseType2 == 3) {
        shopCost.ladderPoints += s.PurchaseItemValue2;
      }
      else if(s.PurchaseType2 == 8) {
        shopCost.nightmarePoints += s.PurchaseItemValue2;
      }
      else if(s.PurchaseType1 == 13) {
        shopCost.nestPoints += s.PurchaseItemValue2;
      }
      else if(s.PurchaseType1 == 14) {
        shopCost.dungeonPoints += s.PurchaseItemValue2;
      }
      else {
        shopCost.numItem2 = s.PurchaseItemValue2;
        shopCost.pointsId2 = s.PurchaseType2;
      }
      
      shopCost.gold = shopCost.gold/100/100;
      
      vm.shopCosts.push(shopCost);
    }
  }

}])
.directive('dngearsimItemViewShop', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
    },
    controller: 'itemViewShopCtrl',
    controllerAs: 'ctrl',
    templateUrl: 'ui/item/item-view-shop.html'
  };
});