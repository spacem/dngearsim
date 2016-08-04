angular.module('dnsim').controller('itemViewSetCtrl',

['$timeout','dntData','itemFactory','hCodeValues','translations',
  function($timeout, dntData, itemFactory) {
  'use strict';
  
  if(this.item == null) return;
  
  var vm = this;
  vm.items = [];
  
  var files = [
  'partstable.optimised.lzjson',
  'partstable_cash.optimised.lzjson',
  'partstable_common2014.optimised.lzjson',
  'partstable_common2015.optimised.lzjson',
  'partstable_common2016.lzjson',
  'partstable_commoncash.lzjson',
  'partstable_equipment.optimised.lzjson',
  'partstable_event.lzjson',
  'partstable_guild.lzjson',
  'partstable_pvp.optimised.lzjson',
  'partstable_reboot.optimised.lzjson',
  'partstable_skilllevelup.lzjson',
  'weapontable.optimised.lzjson',
  'weapontable_cash.optimised.lzjson',
  'weapontable_common2014.optimised.lzjson',
  'weapontable_common2015.optimised.lzjson',
  'weapontable_common2016.lzjson',
  'weapontable_commoncash.lzjson',
  'weapontable_equipment.optimised.lzjson',
  'weapontable_event.lzjson',
  'weapontable_guild.lzjson',
  'weapontable_pvp.optimised.lzjson',
  'weapontable_reboot.optimised.lzjson',
  //'weapontable_skilllevelup.lzjson'
  ];
  
  var allItemFileName = 'all-items.lzjson';
  
  var allFiles = files.concat([allItemFileName]);
  for(var i=0;i<allFiles.length;++i) {
    dntData.init(allFiles[i], null, function() {}, function() {
      $timeout(function() {
        vm.initSets();
      });
    });
  }
  
  this.initSets = function() {
    for(var i=0;i<allFiles.length;++i) {
      if(!dntData.isLoaded(allFiles[i])) {
        return;
      }
    }
    
    vm.items = [];
    for(var i=0;i<files.length;++i) {
      getSetItems(files[i]);
    }
  }
  
  function getSetItems(fileName) {
    var rows = dntData.find(fileName, 'SetItemID', vm.item.setId);
    for(var r=0;r<rows.length;++r) {
      var itemData = dntData.find(allItemFileName, 'id', rows[r].id);
      if(itemData.length > 0) {
        vm.items.push(itemFactory.createBasicItem(itemData[0]));
      }
    }
  }

}])
.directive('dngearsimItemViewSet', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
    },
    controller: 'itemViewSetCtrl',
    controllerAs: 'ctrl',
    templateUrl: 'ui/item/item-view-set.html'
  };
});