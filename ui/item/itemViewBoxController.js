angular.module('dnsim').controller('itemViewBoxCtrl',

['$window','$timeout','$routeParams','hCodeValues','region','translations','dntData',
  function($window, $timeout, $routeParams, hCodeValues, region, translations, dntData) {
  'use strict';
  
  if(this.item == null) return;
  if(this.item.typeId != 46) {
    console.log('not box item type ' + this.item.typeId);
    return;
  }
  
  var vm = this;
  
  var allItemFileName = 'all-items.lzjson';
  var charmItemtable = 'charmitemtable.lzjson';
  var commonCharmItemtable = 'charmitemtable_common.lzjson';
  
  var files = [allItemFileName, charmItemtable, commonCharmItemtable];
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
      
      var boxType = d.TypeParam1;
      console.log('box: ' + boxType);
      this.items = [];
      
      var charmFiles = [charmItemtable, commonCharmItemtable];
      for(var i=0;i<charmFiles.length;++i) {

        var charmData = dntData.getData(charmFiles[i]);
        for(var c=0;c<charmData.length;++c) {
          var cd = charmData[c];
          if(cd.CharmNum == d.TypeParam1 && cd.Look) {
            
            var itemds = dntData.find(allItemFileName, 'id', cd.ItemID);
            if(itemds.length > 0) {
              this.items.push({
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