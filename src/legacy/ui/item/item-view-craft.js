angular.module('dnsim').controller('itemViewCraftCtrl',

['$timeout','dntData','itemFactory','hCodeValues','translations',
  function($timeout, dntData, itemFactory, hCodeValues, translations) {
  'use strict';
  
  if(this.item == null) return;
  
  var vm = this;
  vm.crafts = [];

  var cFiles = [
    'itemcompoundtable.json',
    'itemcompoundtable_custom.json',
    'itemcompoundtable_glyph.json',
    'itemcompoundtable_glyph95.json',
    'itemcompoundtable_jewel.json',
    'itemcompoundtable_renewal.json',
    'itemcompoundtable_set.json'];
  
  var dropFile = 'itemdroptable.json';
  
  var allItemFileName = 'all-items.json';
  
  var files = cFiles.concat([allItemFileName, dropFile]);
  for(var i=0;i<files.length;++i) {
    dntData.init(files[i], null, function() {}, function() {
      $timeout(function() {
        vm.initCrafts();
      });
    });
  }
  
  this.initCrafts = function() {
    for(var i=0;i<files.length;++i) {
      if(!dntData.isLoaded(files[i]) && !dntData.hasFailed(files[i])) {
        return;
      }
    }
    
    vm.crafts = [];
    for(var i=0;i<cFiles.length;++i) {
      vm.initCraft(cFiles[i], vm.item.id);
    }

    for(var di=1;di<=20;++di) {
      var drops = dntData.find(dropFile, 'Item' + di + 'Index', vm.item.id);
      if(drops.length) {
        drops.forEach(function(drop) {
          for(var i=0;i<cFiles.length;++i) {
            vm.initCraft(cFiles[i], drop.id);
          }
        });
      }
    }
    
    var newCrafts = [];
    for(var i=0;i<vm.crafts.length;++i) {
      var found = false;
      for(var j=0;j<newCrafts.length;++j) {
        if(vm.crafts[i].gold == newCrafts[j].gold &&
          vm.crafts[i].items.length == newCrafts[j].items.length) {
            
            found = true;
            for(var k=0;k<vm.crafts[i].items.length;++k) {
              if(vm.crafts[i].items[k].item.id != newCrafts[j].items[k].item.id ||
                vm.crafts[i].items[k].num != newCrafts[j].items[k].num) {
                  found = false;
              }
            }
        }
      }
      
      if(!found) {
        newCrafts.push(vm.crafts[i]);
      }
    }
    
    vm.crafts = newCrafts;
  }

  this.initCraft = function(fileName, id) {
    var fCrafts = dntData.find(fileName, 'SuccessItemID1', id);
    
    for(var i=0;i<fCrafts.length;++i) {
      var c = fCrafts[i];
      
      var craft = {
        id: c.id,
        fileName: fileName.replace('.json', ''),
        gold: c.Cost/100/100,
        items: [],
      };
      
      var j=0;
      for(;;) {
        j++;
        var itemColName = 'Slot' + j +'Id';
        var qtyColName = 'Slot' + j +'Num';
        if(!(itemColName in c)) {
          break;
        }

        var items = dntData.find(allItemFileName, 'id', c[itemColName]);
        if(items.length > 0) {
          craft.items.push({
            item: itemFactory.createBasicItem(items[0]),
            num: c[qtyColName],
          });
        }
      }
      
      vm.crafts.push(craft);
    }
  }

}])
.directive('dngearsimItemViewCraft', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
    },
    controller: 'itemViewCraftCtrl',
    controllerAs: 'ctrl',
    template: require('./item-view-craft.html')
  };
});