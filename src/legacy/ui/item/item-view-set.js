angular.module('dnsim').controller('itemViewSetCtrl',

['$timeout','dntData','itemFactory','hCodeValues','translations',
  function($timeout, dntData, itemFactory) {
  'use strict';
  
  if(this.item == null) return;
  
  var vm = this;
  vm.items = [];
  
  var files = [
  'partstable.optimised.json',
  'partstable_cash.optimised.json',
  'partstable_common2014.optimised.json',
  'partstable_common2015.optimised.json',
  'partstable_common2016.json',
  'partstable_commoncash.json',
  'partstable_equipment.optimised.json',
  'partstable_event.json',
  'partstable_guild.json',
  'partstable_pvp.optimised.json',
  'partstable_reboot.optimised.json',
  'partstable_skilllevelup.json',
  'weapontable.optimised.json',
  'weapontable_cash.optimised.json',
  'weapontable_common2014.optimised.json',
  'weapontable_common2015.optimised.json',
  'weapontable_common2016.json',
  'weapontable_commoncash.json',
  'weapontable_equipment.optimised.json',
  'weapontable_event.json',
  'weapontable_guild.json',
  'weapontable_pvp.optimised.json',
  'weapontable_reboot.optimised.json',
  //'weapontable_skilllevelup.json'
  ];
  
  var allItemFileName = 'all-items.json';
  
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
    template: require('./item-view-set.html')
  };
});