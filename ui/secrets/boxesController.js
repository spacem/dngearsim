angular.module('dnsim')
.controller('BoxesCtrl', 
  ['$window','$timeout','$routeParams','hCodeValues','region','translations','dntData',
  function($window, $timeout, $routeParams, hCodeValues, region, translations, dntData) {
    
    'use strict';
    
    var vm = this;
    
    this.box = $routeParams.box;
    this.boxes = [];
    this.boxeContents = [];
    
    document.body.className = 'default-back';
    $window.document.title = 'Boxes';
    
    var fileName = 'all-items.lzjson';
    var pouchFileName = 'itemdroptable_item.lzjson';
    var charmItemtable = 'itemdroptable_item.lzjson';
    var commonCharmItemtable = 'charmitemtable_common.lzjson';
    
    dntData.init(fileName, null, function() {}, function() {
      $timeout(function() {
        vm.initBoxes();
      });
    });
    
    if(this.box) {
      var files = [pouchFileName, charmItemtable, commonCharmItemtable];
      for(var i=0;i<files.length;++i) {
        dntData.init(files[i], null, function() {}, function() {
          $timeout(function() {
            vm.initBoxContents();
          });
        });
      }
    }
    
    this.initBoxes = function() {
      console.log('init boxes');
      if(dntData.isLoaded(fileName)) {
        var datas = dntData.getData(fileName);
        console.log(datas.length + ' boxes');
        for(var i=0;i<datas.length;++i) {
          var data = datas[i];
          if(data.Type == 46 || data.Type == 8) {
            var box = {
              id: data.id,
              name: vm.translate(data.NameID, data.NameIDParam),
              rank: hCodeValues.rankNames[data.Rank],
              icon: data.IconImageIndex,
            }
            vm.boxes.push(box);
          }
        }
      }
    }
    
    this.initBoxContents = function() {
      for(var i=0;i<files.length;++i) {
        if(!dntData.isLoaded(files[i])) {
          return;
        }
      }
      
      var charmFiles = [charmItemtable, commonCharmItemtable];
      for(var i=0;i<charmFiles.length;++i) {
        var fileName = charmFiles[i];
        
        
        var id = charms[i].charmNum;
        delete charms[i].charmNum;
        
        if(id in vm.boxes) {
          vm.boxes[id].items.push(charms[i]);
        }
        else {
          if(id in eggItems) {
            vm.boxes[id] = {
              nameId: eggItems[id].nameId, 
              nameParam: eggItems[id].nameParam, 
              items:[charms[i]],
              rank: eggItems[id].rank,
            };
          }
        }
      }
    }

    this.getRankName = function(rank) {
      return hCodeValues.rankNames[rank].name;
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
  }]
);
