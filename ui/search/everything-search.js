(function () {
'use strict';

var everythingParams = ['$window','$timeout','$routeParams','$location','hCodeValues','region','translations','dntData',everythingSearchCtrl];

angular.module('dnsim').controller('ItemsCtrl',everythingParams);
angular.module('dnsim').directive('dngearsimEverythingSearch', function() {
  return {
    scope: {},
    bindToController: {
      nameSearch: '=nameSearch'
    },
    controller: everythingParams,
    controllerAs: 'items',
    templateUrl: 'ui/search/everything-search.html'
  };
});


function everythingSearchCtrl ($window, $timeout, $routeParams, $location, hCodeValues, region, translations, dntData) {
  
  'use strict';
  
  var vm = this;
  
  vm.boxes = null;
  vm.maxDisplay = 32;
  vm.currentResults = 0;
  vm.results = null;
  vm.minLevel = 1;
  vm.maxLevel = 99;

  
  var minLevel = Number(localStorage.getItem('minLevel'));
  if($routeParams.minLevel) {
    minLevel = Number($routeParams.minLevel);
  }
  if(minLevel > 0 && minLevel < 100) {
    vm.minLevel = minLevel;
  }
  vm.origMinLevel = minLevel;
  
  var maxLevel = Number(localStorage.getItem('maxLevel'));
  if($routeParams.maxLevel) {
    maxLevel = Number($routeParams.maxLevel);
  }
  if(maxLevel > 0 && maxLevel < 100) {
    vm.maxLevel = maxLevel;
  }
  vm.origMaxLevel = maxLevel;

  if(!vm.nameSearch) {
    vm.nameSearch = localStorage.getItem('nameSearch');
    if($routeParams.name) {
      vm.nameSearch = $routeParams.name;
    }
    if(vm.nameSearch == null) {
      vm.nameSearch = '';
    }
  }
  
  $window.document.title = 'dngearsim | ALL ITEM SEARCH';
  
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

      if(e.levelLimit < vm.minLevel || e.levelLimit > vm.maxLevel || (!e.levelLimit)) {
        continue;
      }

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
    if(vm.minLevel != vm.origMinLevel) {
      localStorage.setItem('minLevel', vm.minLevel);
      $location.search('minLevel', vm.minLevel);
      vm.origMinLevel = vm.minLevel;
    }
    
    if(vm.maxLevel != vm.origMaxLevel) {
      localStorage.setItem('maxLevel', vm.maxLevel);
      $location.search('maxLevel', vm.maxLevel);
      vm.origMaxLevel = vm.maxLevel;
    }

    localStorage.setItem('nameSearch', vm.nameSearch);
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
}

})();
