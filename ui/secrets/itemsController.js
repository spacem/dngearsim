angular.module('dnsim')
.controller('ItemsCtrl', 
  ['$window','$timeout','hCodeValues','region','translations','dntData',
  function($window, $timeout, hCodeValues, region, translations, dntData) {
    
    'use strict';
    
    var vm = this;
    
    this.boxes = null;
    this.boxeContents = [];
    this.maxDisplay = 10;
    this.currentResults = 0;

    this.nameSearch = localStorage.getItem('itemNameSearch');
    if(this.nameSearch == null) {
      this.nameSearch = '';
    }
    
    document.body.className = 'default-back';
    $window.document.title = 'DN Gear Sim | ITEM SEARCH';
    
    var fileName = 'all-items.lzjson';
    
    dntData.init(fileName, null, function() {}, function() {
      $timeout(function() {
        vm.initBoxes();
      });
    });
    
    this.initBoxes = function() {
      // console.log('init boxes');
      if(dntData.isLoaded(fileName) && translations.isLoaded()) {
        vm.boxes = [];
        
        var datas = dntData.getData(fileName);
        // console.log(datas.length + ' boxes');
        for(var i=0;i<datas.length;++i) {
          var data = datas[i];
          if(data.NameID > 0) {
            var box = {
              id: data.id,
              name: vm.translate(data.NameID, data.NameIDParam),
              rank: hCodeValues.rankNames[data.Rank],
              icon: data.IconImageIndex,
              fileName: data.fileName,
            }
            vm.boxes.push(box);
          }
        }
      }
    }
    
    this.getResults = function() {
      localStorage.setItem('itemNameSearch', vm.nameSearch);
      if(vm.boxes == null) {
        vm.initBoxes();
      }
      
      if(vm.boxes == null) {
        return;
      }
  
      var newResults = [];
      var numBoxes = vm.boxes.length;
      var curDisplay = 0;
      for(var i=0;i<numBoxes && (curDisplay<vm.maxDisplay);++i) {
        var e = vm.boxes[i];

        if(vm.nameSearch != '') {
          var nameSearches = vm.nameSearch.split(' ');
          if(nameSearches.length == 0) {
            nameSearches = [vm.nameSearch];
          }
          var allMatch = true;
          for(var ns=0;ns<nameSearches.length;++ns) {
            if(e.name && e.name.toString().toUpperCase().indexOf(nameSearches[ns].toUpperCase()) == -1) {
              allMatch = false;
              break;
            }
          }
          
          if(!allMatch) {
            continue;
          }
        }
        
        newResults.push(e);
        curDisplay++;
      }
      
      vm.totalNumResults = newResults.length;
      return newResults;
    }
  
    this.showMoreResults = function(extra) {
      vm.maxDisplay = vm.totalNumResults + extra;
      vm.totalNumResults = 0;
    }
    
    this.translate = function(nameId, nameParam) {
      return translations.translate(nameId, nameParam);
    }
  }]
);
