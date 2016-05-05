angular.module('dnsim').controller('buildCtrl',

['$timeout','$location','hCodeValues','statHelper','itemCategory',
function($timeout,$location,hCodeValues,statHelper,itemCategory) {
  'use strict';
  
  var vm = this;
  
  this.stats = statHelper.getBuildStats(this.build);
  
  var selectedCategory = localStorage.getItem('selectedItemCategory');
  this.category = itemCategory.byName(selectedCategory);
  if(!this.category) {
    selectedCategory = 'titles';
    this.category = itemCategory.byName('titles');
  }
  
  this.getCategoryItems = function() {
    return itemCategory.getItemsByCategory(this.build.items)[vm.category.name];
  }
  
  this.getCategories = function() {
    return itemCategory.categories;
  }
    
  this.setSelectedCategory = function(value) {
    this.category = itemCategory.byName(value);
    localStorage.setItem('selectedItemCategory', value);
  }

  this.toggleGroup = function() {
    localStorage.setItem('currentGroup', null);
    $location.url('/builds');
  }
  
  this.getSaveDate = function(group) {
    if(vm.build.lastUpdate > 0) {
      var lastUpdate = new Date(vm.build.lastUpdate);
      return lastUpdate.toLocaleDateString();
    }
  }
  
  this.getSaveTime = function(group) {
    if(vm.build.lastUpdate > 0) {
      var lastUpdate = new Date(vm.build.lastUpdate);
      return lastUpdate.toLocaleTimeString();
    }
  }
  
  this.allowMoreItems = function() {
    return !vm.category.maxCat || this.getCategoryItems().length < vm.category.maxCat;
  }
  
  this.getItemCount = function() {
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
          if(!(item.sparkTypeId in numIncreasingGems)) {
            numIncreasingGems[item.sparkTypeId] = 0;
          }
          numIncreasingGems[item.sparkTypeId]++;
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
        if(item.typeName == vm.category.name) {
          numItems++;
        }
      });
      
      itemCountText = numItems;
      var cat = itemCategory.byName(vm.category.name);
      if(cat && 'numItemText' in cat) {
        itemCountText += ' / ' + cat.numItemText;
      }
    }
    
    return itemCountText + ' ' + vm.category.name;
  }
  
  this.handleChange = function() {
    vm.onChange();
    $timeout(function() {
      vm.stats = statHelper.getBuildStats(vm.build);
    });
  }
  
}])
.directive('dngearsimBuild', function() {
  return {
    scope: true,
    bindToController: {
      buildName: '=buildName',
      build: '=build',
      onChange: '&onChange'
    },
    controller: 'buildCtrl',
    controllerAs: 'buildCtrl',
    templateUrl: 'ui/builds/build.html?bust=' + Math.random().toString(36).slice(2)
  };
});