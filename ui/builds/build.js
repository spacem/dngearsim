angular.module('dnsim').controller('buildCtrl',

['$timeout','$location','hCodeValues','statHelper','itemCategory','saveHelper','dvStatcardHelper', 
function($timeout,$location,hCodeValues,statHelper,itemCategory,saveHelper, dvStatcardHelper) {
  'use strict';
  
  var vm = this;
  
  this.stats = statHelper.getBuildStats(this.build);
  
  var selectedCategory = localStorage.getItem('selectedItemCategory');
  this.category = itemCategory.byName(selectedCategory);
  if(!this.category || this.category.hideInBuild) {
    selectedCategory = 'titles';
    this.category = itemCategory.byName('titles');
  }
  
  this.getCategoryItems = function() {
    var itemsByCat = itemCategory.getItemsByCategory(this.build.items);
    if(vm.category.name in itemsByCat) {
      return itemsByCat[vm.category.name];
    }
    else {
      return [];
    }
  }

  this.changeCategory = function() {
    this.xsView = null;
    this.moveItem = null;
    this.categoryChanging = true;
    $timeout(function() {
      vm.categoryChanging = false;
    }, 0);
  }


  var subCats = {};
  var subCatCatName = '';
  this.getSubCategories = function() {
    if(subCatCatName != vm.category.name) {
      subCats = {};
      subCatCatName = vm.category.name;
      var subCatList = [];

      var items = vm.build.items.sort(function(item1, item2) {
        return item1.exchangeType - item2.exchangeType;
      });
      if(vm.category.name == 'increasing gems') {
        subCatList = _.filter(items, function(item) {
          return item.increasingGemSlots > 0;
        });
      }
      else if(vm.category.name == 'offensive gems') {
        subCatList = _.filter(items, function(item) {
          return item.offensiveGemSlots > 0;
        });
      }
      _.each(subCatList, function(item) {
        if(!(item.exchangeType in subCats)) {
          subCats[item.exchangeType] = {
            names: [],
            slots: 0,
            exchangeType: item.exchangeType
          };
        }

        subCats[item.exchangeType].names.push(item.name);
        if(vm.category.name == 'increasing gems') {
          subCats[item.exchangeType].slots += item.increasingGemSlots;
        }
        if(vm.category.name == 'offensive gems') {
          subCats[item.exchangeType].slots += item.offensiveGemSlots;
        }
      });
      subCats[0] = null;
    }
    
    return subCats;
  }

  this.getNumTaken = function(subCat) {
    var retVal = 0;
    var gemExchange = _.find(hCodeValues.gemExchanges, function(e) {
      return e.exchange == subCat.exchangeType;
    });

    if(gemExchange) {
      var items = this.getCategoryItems();
      _.each(items, function(item) {
        if(item.gemSlot == gemExchange.id) {
          ++retVal;
        }
      });
    }
    return retVal;
  }

  this.isInSubCat = function(item, subCat) {
    if(!subCat && !item.gemSlot) {
      return true;
    }
    else {
      var gemExchange = _.find(hCodeValues.gemExchanges, function(e) {
        return e.id == item.gemSlot;
      });

      if(!subCat && gemExchange) {
        // check for invalid slot
        var allSubCatItems = this.getSubCategories();
        var foundSubCatItem = _.find(allSubCatItems, function(subCatItem) {
          return subCatItem != null && gemExchange.exchange == subCatItem.exchangeType;
        });

        if(!foundSubCatItem) {
          return true;
        }
      }
      else if(subCat && gemExchange) {
        return gemExchange.exchange == subCat.exchangeType;
      }
      else {
        return false;
      }
    }
  }

  this.canMove = function() {
    return vm.category.name == 'increasing gems' || vm.category.name == 'offensive gems';
  }

  this.getGemSlot = function(subCat) {
    if(subCat) {
      var gemExchange = _.find(hCodeValues.gemExchanges, function(e) {
        return e.exchange == subCat.exchangeType;
      });
      return gemExchange.id;
    }
  }

  this.move = function(moveItem, destination) {
    moveItem.gemSlot = vm.getGemSlot(destination);
    saveHelper.updatedSavedItems(vm.buildName, vm.build.items);
    vm.handleChange();
  }
  
  this.getCategories = function() {
    return itemCategory.categories;
  }
    
  this.setSelectedCategory = function(value) {
    this.category = itemCategory.byName(value);
    localStorage.setItem('selectedItemCategory', value);
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
  
  this.newCustom = function() {
    var newCustom = {id: 0, typeName:'custom', name: 'new custom item', stats: []};
    vm.build.items = vm.build.items.concat(newCustom);
    saveHelper.updatedSavedItems(vm.buildName, vm.build.items);
    vm.handleChange();
  }
  
  this.handleChange = function() {
    vm.stats = statHelper.getBuildStats(vm.build);
    subCatCatName = '';
    vm.onChange();
  }
  
  this.handleItemEdit = function() {
    saveHelper.updatedSavedItems(vm.buildName, vm.build.items);
    vm.handleChange();
  }
  
  this.cancelEdit = function() {
    vm.onChange();
  }
  
  this.canEdit = function(item) {
    return item.typeName == 'custom' || item.typeName == 'weapons' || item.typeName == 'armour' || item.typeName == 'offensive gems' || item.typeName == 'increasing gems';
  }
  
  this.removeItem = function(item) {
    subCatCatName = '';
    item.removeItem = true;
    var newItemList = [];
    angular.forEach(vm.build.items, function(gItem, index) {
      if(gItem && !gItem.removeItem) {
        newItemList.push(gItem);
      }
    });

    vm.build.items = newItemList;
    saveHelper.updatedSavedItems(vm.buildName, newItemList);
    vm.handleChange();
  }

  this.statcard = function() {
    var stats = statHelper.getBuildStats(vm.build).calculatedStats;
    var dvCardStatHash = dvStatcardHelper.convertStats(stats, vm);
    var url = dvStatcardHelper.cardImportUrl + '?dngsimport=' + btoa(JSON.stringify(dvCardStatHash));
    window.open(url);
  }
  
}])
.directive('dngearsimBuild', function() {
  return {
    scope: true,
    bindToController: {
      buildName: '=buildName',
      build: '=build',
      onChange: '&onChange',
      server: '=server'
    },
    controller: 'buildCtrl',
    controllerAs: 'buildCtrl',
    templateUrl: 'ui/builds/build.html'
  };
});