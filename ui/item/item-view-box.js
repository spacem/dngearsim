angular.module('dnsim').controller('itemViewBoxCtrl',

['$timeout','dntData','itemFactory',
  function($timeout, dntData, itemFactory) {
  'use strict';
  
  if(this.item == null) return;
  if(this.item.typeId != 46 && this.item.typeId != 8 && this.item.typeId != 112 && this.item.typeId != 122 && this.item.typeId != 142) {
    console.log('not box item type ' + this.item.typeId);
    return;
  }
  
  var vm = this;
  
  var pouchFileNames = [
    'itemdroptable.lzjson',
    'itemdroptable_abyss.lzjson',
    'itemdroptable_apprentice.lzjson',
    'itemdroptable_cook.lzjson',
    'itemdroptable_darklair.lzjson',
    'itemdroptable_dimension.lzjson',
    'itemdroptable_disjoint.lzjson',
    'itemdroptable_dnexpedition.lzjson',
    'itemdroptable_event.lzjson',
    'itemdroptable_farm.lzjson',
    'itemdroptable_fishing.lzjson',
    'itemdroptable_guildwar.lzjson',
    'itemdroptable_item.lzjson',
    'itemdroptable_monsteritem.lzjson',
    'itemdroptable_propdrop.lzjson',
    'itemdroptable_pvp.lzjson',
    'itemdroptable_randomcompound.lzjson',
    'itemdroptable_stageclear.lzjson',
    'itemdroptable_themepark.lzjson',
    'itemdroptable_union.lzjson']
  
  var allItemFileName = 'all-items.lzjson';
  var charmItemtable = 'charmitemtable.lzjson';
  var commonCharmItemtable = 'charmitemtable_common.lzjson';
  
  var files;
  if(this.item.typeId == 46 || this.item.typeId == 112 || this.item.typeId == 122 || this.item.typeId == 142) {
    files = [allItemFileName, charmItemtable, commonCharmItemtable];
  }
  else if (this.item.typeId == 8) {
    files = [allItemFileName].concat(pouchFileNames);
  }

  for(var i=0;i<files.length;++i) {
    dntData.init(files[i], null, function() {}, function() {
      $timeout(function() {
        vm.initBoxContents();
      });
    });
  }
  
  this.initBoxContents = function() {
    console.log('init contents', this.item.fileName);

    for(var i=0;i<files.length;++i) {
      if(!dntData.isLoaded(files[i])) {
        return;
      }
    }

    var datas = dntData.find(this.item.fileName + '.lzjson', 'id', this.item.id);
    if(datas.length > 0) {
      var d = datas[0];
      vm.items = [];
      
      
      if(vm.item.typeId == 46 || vm.item.typeId == 112 || vm.item.typeId == 122 || vm.item.typeId == 142) {
        vm.getCharmItems(d.TypeParam1);
      }
      else if (vm.item.typeId == 8) {
        vm.getPouchItems(d.TypeParam1);
      }
      
    }
  }
  
  this.getPouchItems = function(boxType) {
    for(var f=0;f<pouchFileNames.length;++f) {
      vm.getPouchItemsFromFile(boxType, pouchFileNames[f]);
    }
  }
  
  this.getPouchItemsFromFile = function(boxType, pouchFileName) {
    
    var pouchData = dntData.find(pouchFileName, 'id', boxType);
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
            vm.getPouchItems(pouchItem, pouchFileName);
          }
          else {
            // console.log('adding item ' + pouchItem);
            var itemds = dntData.find(allItemFileName, 'id', pouchItem);
            if(itemds.length > 0) {
              var basicItem = itemFactory.createBasicItem(itemds[0]);
              // console.log('found item ' + basicItem.name);
  
              vm.items.push({
                count: pouchItemCount,
                gold: gold,
                item: basicItem
              });
            }
          }
        }
      } while(pouchItem);
    }
  }
  
  this.getCharmItems = function(boxType) {
    var charmFiles = [charmItemtable, commonCharmItemtable];
    for(var i=0;i<charmFiles.length;++i) {

      var charmData = dntData.getData(charmFiles[i]);
      console.log('box: ' + boxType, charmData);
      
      for(var c=0;c<charmData.length;++c) {
        var cd = charmData[c];
        if(cd.CharmNum == boxType && cd.Look) {
          
          if(cd.CharmType) {
            this.getCharmItems(cd.ItemID);
          }
          else {
            var itemds = dntData.find(allItemFileName, 'id', cd.ItemID);
            if(itemds.length > 0) {
              vm.items.push({
                count: cd.Count,
                gold: cd.Gold,
                item: itemFactory.createBasicItem(itemds[0])
              });
            }
          }
        }
      }
    }
  }

}])
.directive('dngearsimItemViewBox', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
    },
    controller: 'itemViewBoxCtrl',
    controllerAs: 'ctrl',
    templateUrl: 'ui/item/item-view-box.html'
  };
});