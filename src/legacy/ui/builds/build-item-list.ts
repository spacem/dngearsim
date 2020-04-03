import * as _ from 'lodash';
  
angular.module('dnsim').directive('dngearsimBuildItemList', function() {
  return {
    scope: true,
    bindToController: {
      buildName: '=buildName',
      build: '=build',
      category: '=category',
      server: '=server',
      onChange: '&onChange'
    },
    controller: ['hCodeValues', 'itemCategory', 'saveHelper', buildItemListController],
    controllerAs: 'buildCtrl',
    template: require('!raw-loader!./build-item-list.html').default
  };
});

function buildItemListController(hCodeValues, itemCategory, saveHelper) {

  var vm = this;

  vm.getSubCategoryItems = function(subCat) {
    return vm.getCategoryItems().filter(i => vm.isInSubCat(i, subCat));
  };

  vm.getCategoryItems = function() {
    var itemsByCat = itemCategory.getItemsByCategory(vm.build.items);
    if(vm.category.name in itemsByCat) {
      return itemsByCat[vm.category.name];
    }
    else {
      return [];
    }
  }

  var subCats = {};
  var subCatCatName = '';
  vm.getSubCategories = function() {
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
      else if(vm.category.name == 'imprint') {
        var costumeCat = itemCategory.byName('costume');
        subCatList = _.filter(items, function(item) {
          return itemCategory.isItemForCat(costumeCat, item) ||
            item.exchangeType == 26 ||
            item.exchangeType == 27 ||
            item.exchangeType == 28;
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
        else if(vm.category.name == 'offensive gems') {
          subCats[item.exchangeType].slots += item.offensiveGemSlots;
        }
        else {
            subCats[item.exchangeType].slots = 1;
        }
      });
      subCats[0] = null;
    }
    
    return subCats;
  }

  vm.getNumTaken = function(subCat) {
    var retVal = 0;
    var exchangeId;
    if(vm.category.name == 'imprint') {
      exchangeId = subCat.exchangeType;
    }
    else {
      var gemExchange = _.find(hCodeValues.gemExchanges, function(e) {
        return e.exchange == subCat.exchangeType;
      });

      exchangeId = gemExchange.id;
    }

    if(exchangeId) {
      var items = vm.getCategoryItems();
      _.each(items, function(item) {
        if(item.gemSlot == exchangeId) {
          ++retVal;
        }
      });
    }
    return retVal;
  }

  vm.isInSubCat = function(item, subCat) {
    if(!subCat && !item.gemSlot) {
      return true;
    }
    else {
      var exchangeId;
      if(vm.category.name == 'imprint') {
        exchangeId = item.gemSlot;
      }
      else {
        var gemExchange = _.find(hCodeValues.gemExchanges, function(e) {
          return e.id == item.gemSlot;
        });
        if(gemExchange) {
          exchangeId = gemExchange.exchange;
        }
      }

      if(!subCat && exchangeId) {
        // check for invalid slot
        var allSubCatItems = vm.getSubCategories();
        var foundSubCatItem = _.find(allSubCatItems, function(subCatItem) {
          return subCatItem != null && exchangeId == subCatItem.exchangeType;
        });

        if(!foundSubCatItem) {
          return true;
        }
      }
      else if(subCat && exchangeId) {
        return exchangeId == subCat.exchangeType;
      }
      else {
        return false;
      }
    }
  }

  vm.canMove = function() {
    return vm.category.name == 'increasing gems' || vm.category.name == 'offensive gems' || vm.category.name == 'imprint';
  }

  vm.getGemSlot = function(subCat) {
    if(vm.category.name == 'imprint') {
      return subCat.exchangeType;
    }
    else if(subCat) {
      var gemExchange = _.find(hCodeValues.gemExchanges, function(e) {
        return e.exchange == subCat.exchangeType;
      });

      if(!gemExchange) {
          console.log('cannot find exchange for', subCat);
      }
      return gemExchange.id;
    }
  }

  vm.move = function(moveItem, destination) {
    moveItem.gemSlot = vm.getGemSlot(destination);
    saveHelper.updatedSavedItems(vm.buildName, vm.build.items);
    vm.handleChange();
  }
  
  vm.allowMoreItems = function() {
    return !vm.category.maxCat || vm.getCategoryItems().length < vm.category.maxCat;
  }
  
  vm.handleChange = function() {
    subCatCatName = '';
    vm.onChange();
  }
  
  vm.handleItemEdit = function() {
    saveHelper.updatedSavedItems(vm.buildName, vm.build.items);
    vm.handleChange();
  }
  
  vm.cancelEdit = function() {
    vm.onChange();
  }
  
  vm.canEdit = function(item) {
    return item.typeName == 'custom' || item.typeName == 'weapons' || item.typeName == 'armour' || item.typeName == 'offensive gems' || item.typeName == 'increasing gems';
  }
  
  vm.removeItem = function(item) {
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
}