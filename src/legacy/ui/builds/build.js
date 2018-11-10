angular.module('dnsim').directive('dngearsimBuild', function() {
  return {
    scope: true,
    bindToController: {
      buildName: '=buildName',
      build: '=build',
      onChange: '&onChange',
      server: '=server'
    },
    controller: bulidController,
    controllerAs: 'buildCtrl',
    templateUrl: 'ui/builds/build.html'
  };
});

function bulidController($timeout, statHelper, itemCategory, saveHelper) {
  'use strict';  
  var vm = this;
  
  vm.stats = statHelper.getBuildStats(vm.build);
  
  var selectedCategory = localStorage.getItem('selectedItemCategory');
  vm.category = itemCategory.byName(selectedCategory);
  if(!vm.category || vm.category.hideInBuild) {
    selectedCategory = 'titles';
    vm.category = itemCategory.byName('titles');
  }
  
  vm.getCategoryItems = function() {
    var itemsByCat = itemCategory.getItemsByCategory(vm.build.items);
    if(vm.category.name in itemsByCat) {
      return itemsByCat[vm.category.name];
    }
    else {
      return [];
    }
  }

  vm.changeCategory = function() {
    vm.xsView = null;
    vm.moveItem = null;
    vm.categoryChanging = true;
    $timeout(function() {
      vm.categoryChanging = false;
    }, 0);
  }
  
  vm.getCategories = function() {
    return itemCategory.categories;
  }
    
  vm.setSelectedCategory = function(value) {
    vm.category = itemCategory.byName(value);
    localStorage.setItem('selectedItemCategory', value);
  }
  
  vm.getSaveDate = function(group) {
    if(vm.build.lastUpdate > 0) {
      var lastUpdate = new Date(vm.build.lastUpdate);
      return lastUpdate.toLocaleDateString();
    }
  }
  
  vm.getSaveTime = function(group) {
    if(vm.build.lastUpdate > 0) {
      var lastUpdate = new Date(vm.build.lastUpdate);
      return lastUpdate.toLocaleTimeString();
    }
  }
  
  vm.allowMoreItems = function() {
    return !vm.category.maxCat || vm.getCategoryItems().length < vm.category.maxCat;
  }
  
  vm.getItemCount = function() {
    var itemCountText = '';
    var allItems = vm.build.items;
    
    if(vm.category.name == 'offensive gems') {
      var numOffensiveSlots = 0;
      var numOffensiveGems = 0;
      angular.forEach(allItems, function(item, index) {
        if(item.typeName == vm.category.name) {
          numOffensiveGems++;
        }
        else if(item.offensiveGemSlots) {
          numOffensiveSlots += item.offensiveGemSlots;
        }
      });
      
      itemCountText = numOffensiveGems + ' / ' + numOffensiveSlots;
    }
    else if(vm.category.name == 'increasing gems') {
      
      var totalIncreasingGems = 0;
      var numIncreasingSlots = 0;
      var numIncreasingGems = {};
      angular.forEach(allItems, function(item, index) {
        if(item.typeName == vm.category.name) {
          var gemType = item.sparkTypeId;
          if(!gemType) {
            gemType = 0;
          }
          
          if(!(gemType in numIncreasingGems)) {
            numIncreasingGems[gemType] = 0;
          }
          numIncreasingGems[gemType]++;
          totalIncreasingGems++;
        }
        else if(item.increasingGemSlots) {
          numIncreasingSlots += item.increasingGemSlots;
        }
      });
      
      itemCountText = ''
      angular.forEach(numIncreasingGems, function(number, gemType) {
        if(itemCountText.length > 0) {
          itemCountText += '+';
        }
        itemCountText += number;
      });
      
      itemCountText = totalIncreasingGems + ' (' + itemCountText + ') / ' + numIncreasingSlots;
    }
    else {
      var numItems = 0;
      angular.forEach(allItems, function(item, index) {
        if(item && item.typeName == vm.category.name) {
          numItems++;
        }
      });
      
      itemCountText = numItems;
      var cat = itemCategory.byName(vm.category.name);
      if(cat && 'numItemText' in cat) {
        itemCountText += ' / ' + cat.numItemText;
      }
    }
    
    return itemCountText;
  }
  
  vm.newCustom = function() {
    var newCustom = {id: 0, typeName:'custom', name: 'new custom item', stats: []};
    vm.build.items = vm.build.items.concat(newCustom);
    saveHelper.updatedSavedItems(vm.buildName, vm.build.items);
    vm.handleChange();
  }
  
  vm.handleChange = function() {
    vm.stats = statHelper.getBuildStats(vm.build);
    vm.onChange();
  }
}