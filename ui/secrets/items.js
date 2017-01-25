angular.module('dnsim')
.controller('ItemsCtrl', 
  ['$window','$timeout','$routeParams','$location','hCodeValues','region','translations','dntData',
  function($window, $timeout, $routeParams, $location, hCodeValues, region, translations, dntData) {
    
    'use strict';
    
    var vm = this;
    
    vm.boxes = null;
    vm.maxDisplay = 32;
    vm.currentResults = 0;
    vm.results = null;

    vm.nameSearch = localStorage.getItem('itemNameSearch');
    if($routeParams.name) {
      vm.nameSearch = $routeParams.name;
    }
    if(vm.nameSearch == null) {
      vm.nameSearch = '';
    }
    
    $window.document.title = 'DN Gear Sim | ITEM SEARCH';
    
    var fileName = 'all-items.lzjson';
    
    dntData.init(fileName, null, function() {}, function() {
      $timeout(function() {
        vm.initBoxes();
      });
    });
    
    vm.initBoxes = function() {
      if(dntData.isLoaded(fileName) && translations.isLoaded()) {
        vm.boxes = [];
        
        var datas = dntData.getData(fileName);
        // console.log(datas.length + ' boxes');
        for(var i=0;i<datas.length;++i) {
          var data = datas[i];
          if(data.NameID > 0) {
            var box = {
              id: data.id,
              name: translations.translate(data.NameID, data.NameIDParam),
              rank: hCodeValues.rankNames[data.Rank],
              icon: data.IconImageIndex,
              levelLimit: data.LevelLimit,
              fileName: data.fileName,
            }
            vm.boxes.push(box);
          }
        }
        
        vm.boxes = _.sortBy(vm.boxes, 'name');
        
        $timeout(function() {
          vm.showMoreResults();
        });
      }
    }
    
    vm.getResults = function() {
      if(vm.boxes == null) {
        vm.initBoxes();
      }
      
      if(vm.boxes == null) {
        return [];
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
    
    vm.changeSearch = function() {
      localStorage.setItem('itemNameSearch', vm.nameSearch);
      $location.search('name', vm.nameSearch);
      
      vm.maxDisplay = 64;
      vm.results = vm.getResults();
    }
  
    vm.showMoreResults = function() {
      $timeout(function() {
        // console.log('show more', vm.maxDisplay);
        vm.maxDisplay += 18;
        vm.results = vm.getResults();
      });
    }
  }]
);
