angular.module('dnsim').controller('itemViewBoxCtrl',

['$window','$timeout','$routeParams','hCodeValues','region','translations','dntData',
  function($window, $timeout, $routeParams, hCodeValues, region, translations, dntData) {
  'use strict';
  
  if(this.item == null) return;
  if(this.item.typeId != 46 && this.item.typeId != 8) {
    console.log('not box item type ' + this.item.typeId);
    return;
  }
  
  var vm = this;
  
  var pouchFileName = 'itemdroptable_item.lzjson';
  var allItemFileName = 'all-items.lzjson';
  var charmItemtable = 'charmitemtable.lzjson';
  var commonCharmItemtable = 'charmitemtable_common.lzjson';
  
  var files;
  if(this.item.typeId == 46) {
    files = [allItemFileName, charmItemtable, commonCharmItemtable];
  }
  else if (this.item.typeId == 8) {
    files = [allItemFileName, pouchFileName];
  }

  for(var i=0;i<files.length;++i) {
    dntData.init(files[i], null, function() {}, function() {
      $timeout(function() {
        vm.initBoxContents();
      });
    });
  }
  
  this.initBoxContents = function() {
    console.log('init contents');

    for(var i=0;i<files.length;++i) {
      if(!dntData.isLoaded(files[i])) {
        return;
      }
    }

    var datas = dntData.find(this.item.fileName + '.lzjson', 'id', this.item.id);
    if(datas.length > 0) {
      var d = datas[0];
      vm.items = [];
      
      
      if(this.item.typeId == 46) {
        vm.getCharmItems(d.TypeParam1);
      }
      else if (this.item.typeId == 8) {
        vm.getPouchItems(d.TypeParam1);
      }
      
    }
  }
  
  this.getPouchItems = function(boxType) {
    console.log('TypeParam1 ' + boxType);
    
    var pouchData = dntData.find(pouchFileName, 'id', boxType);
    if(pouchData.length == 0) {
      vm.noDropsFound = true;
      console.log('no drops');
    }
    else {
      console.log('found pouch');
      var gold = pouchData[0].GoldMin;

      var itemIndex = 0;
      do {
        itemIndex++;
        var isGroup = pouchData[0]['IsGroup' + itemIndex];
        var pouchItem = pouchData[0]['Item' + itemIndex + 'Index'];
        var pouchItemCount = pouchData[0]['Item' + itemIndex + 'Info'];
        console.log('pouch contains ' + pouchItem);
        if(pouchItem) {
          if(isGroup) {
            vm.getPouchItems(pouchItem);
          }
          else {
            var itemds = dntData.find(allItemFileName, 'id', pouchItem);
            if(itemds.length > 0) {
              console.log('found item ');
  
              vm.items.push({
                count: pouchItemCount,
                gold: gold,
                item: {
                  id: pouchItem,
                  name: vm.translate(itemds[0].NameID, itemds[0].NameIDParam),
                  rank: hCodeValues.rankNames[itemds[0].Rank],
                  icon: itemds[0].IconImageIndex,
                  fileName: itemds[0].fileName,
                }
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
      
      console.log('box: ' + boxType);

      var charmData = dntData.getData(charmFiles[i]);
      for(var c=0;c<charmData.length;++c) {
        var cd = charmData[c];
        if(cd.CharmNum == boxType && cd.Look) {
          
          var itemds = dntData.find(allItemFileName, 'id', cd.ItemID);
          if(itemds.length > 0) {
            vm.items.push({
              count: cd.Count,
              gold: cd.Gold,
              item: {
                id: itemds[0].id,
                name: vm.translate(itemds[0].NameID, itemds[0].NameIDParam),
                rank: hCodeValues.rankNames[itemds[0].Rank],
                icon: itemds[0].IconImageIndex,
                fileName: itemds[0].fileName,
              }
            });
          }
        }
      }
    }
  }
  
  this.translate = function(nameId, nameParam) {
    if(!nameId) {
      return 'unknown';
    }
    else 
    {
      var translated = translations.translate(nameId);
      if(translated.indexOf('{0}') == 0) {
        translated = translations.translate(nameParam);
      }
      
      return translated;
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
    templateUrl: 'ui/item/item-view-box.html?bust=' + Math.random().toString(36).slice(2)
  };
});