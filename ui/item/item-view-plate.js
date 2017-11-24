angular.module('dnsim').controller('itemViewPlateCtrl',

['$timeout','dntData','itemFactory','hCodeValues','translations',
  function($timeout, dntData, itemFactory) {
  'use strict';
  
  if(this.item == null) return;
  
  var vm = this;
  vm.items = [];
  
  var plateFile = 'platetable.lzjson';
  var allItemFileName = 'all-items.lzjson';
  
  var allFiles = [plateFile,allItemFileName];
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
    getPlates();
  }
  
  function getPlates() {
    var rows = dntData.find(plateFile, 'ItemID', vm.item.id);
    for(var r=0;r<rows.length;++r) {
      var row = rows[r];
      var col=0;
      for(;;) {
        col++;
        var colName = 'CompoundTableIndex' + col;
        if(!(colName in row)) {
          break;
        }

        var itemData = dntData.find(allItemFileName, 'id', row[colName]);
        if(itemData.length > 0) {
          vm.items.push(itemFactory.createBasicItem(itemData[0]));
        }
      }
    }
  }

}])
.directive('dngearsimItemViewPlate', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
    },
    controller: 'itemViewPlateCtrl',
    controllerAs: 'ctrl',
    template: require('./item-view-plate.html')
  };
});