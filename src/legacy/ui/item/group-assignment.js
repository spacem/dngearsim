(function () {
'use strict';

angular.module('dnsim').directive('dngearsimGroupAssignment', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
      compact: '=compact',
      onChange: '&onChange'
    },
    controller: groupAssignment,
    controllerAs: 'editCtrl',
    templateUrl: 'ui/item/group-assignment.html'
  };
});

function groupAssignment(hCodeValues,statHelper,saveHelper,itemCategory,$scope,exportLinkHelper,dntData) {
  
  var vm = this;
  
  this.savedItems = saveHelper.getSavedItems();
  this.groupNames = Object.keys(this.savedItems);
  if(!this.groupName) {
    this.groupName = saveHelper.getCurrentBuild();
  }

  if(!(this.groupName in this.savedItems)) {
    this.groupName = null;
  }

  if(!this.groupName && this.savedItems) {
    for(var savedGroup in this.savedItems) {
      this.groupName = savedGroup;
      break;
    }
  }

  if(!this.groupName) {
    return;
  }
  
  this.summaryStatIds = [];
  for(var id in hCodeValues.stats) {
    if(hCodeValues.stats[id].summaryDisplay) {
      this.summaryStatIds.push(id);
    }
  }
    
  this.clearGroup = function() {
    vm.addAffectAmount = null;
    vm.newAffectAmount = null;
    vm.oldAffectAmount = null;
    vm.replaceAffectAmount = {};

    vm.groupItems = null;
    vm.groupCalcStats = null;
  }

  vm.tryToSetItem = function(dntFiles) {
    if(!dntData.anyLoading()) {
      
      var allLoaded = true;
      angular.forEach(dntFiles, function(columns, fileName) {
        if(!dntData.isLoaded(fileName)) {
          allLoaded = false;
        }
      });
      
      if(allLoaded) {
        vm.item = exportLinkHelper.reloadItem(vm.item);
      }
    }
  }

  var dntFiles = exportLinkHelper.getDntFiles(vm.item);
  angular.forEach(dntFiles, function(columns, fileName) {
    if(vm.item.fileName && fileName.indexOf(vm.item.fileName) == 0 && dntData.isLoaded(vm.item.fileName + '.optimised.json')) {
      delete dntFiles[fileName];
    }
    else {
      dntData.init(fileName, columns, function() {}, function() {
        vm.tryToSetItem(dntFiles);
      });
    }
  });
  vm.tryToSetItem(dntFiles);

  $scope.$watch('editCtrl.item', function() {
    vm.clearGroup();
  });
  
  this.getAddAffectAmount = function(stat) {
    this.initAddAffects();
    // console.log('add affect: ', this.addAffectAmount[stat], this.item);
    return this.addAffectAmount[stat];
  };

  this.getNewAffectAmount = function(stat) {
    this.initAddAffects();
    // console.log('add affect: ', this.addAffectAmount[stat], this.item);
    return this.newAffectAmount[stat];
  };

  this.getOldAffectAmount = function(stat) {
    this.initAddAffects();
    // console.log('add affect: ', this.addAffectAmount[stat], this.item);
    return this.oldAffectAmount[stat];
  };
  
  this.getReplaceAffectAmount = function(statId, itemIndex, item) {
    this.initReplaceAffects(itemIndex, item);
    return this.replaceAffectAmount[itemIndex][statId];
  };
  
  this.getGroupCalcStats = function() {
    
    if(this.groupCalcStats == null) {
      
      var group = vm.savedItems[vm.groupName];
      if(group) {
        this.groupCalcStats = statHelper.getCalculatedStatsFromItems(group, group.items);
      }
    }
    
    return this.groupCalcStats;
  };
  
  this.getBuild = function() {
    return vm.savedItems[vm.groupName];
  };
  
  this.initAddAffects = function() {
    
    if(vm.addAffectAmount) {
      return;
    }
    
    // console.log('initialising add affects ');
    
    var origStats = vm.getGroupCalcStats();
    var group = vm.savedItems[vm.groupName];
    var newItems = [];
    if(group.items) {
      newItems = group.items.concat([vm.item]);
    }
    var newStats = statHelper.getCalculatedStatsFromItems(group, newItems);
    
    this.addAffectAmount = {};
    this.newAffectAmount = {};
    this.oldAffectAmount = {};
    for(var id in hCodeValues.stats) {
      if(hCodeValues.stats[id].summaryDisplay) {
        vm.newAffectAmount[id] = vm.getStat(id, newStats).max;
        vm.oldAffectAmount[id] = vm.getStat(id, origStats).max;
        vm.addAffectAmount[id] = calcStatPercent(vm.newAffectAmount[id], vm.oldAffectAmount[id]);
      }
    }
  };
  
  this.initReplaceAffects = function(itemIndex, item) {
    if(vm.replaceAffectAmount[itemIndex]) {
      return;
    }
    
    var group = vm.savedItems[vm.groupName];
    var newItems = [vm.item];
    angular.forEach(group.items, function(gItem , index) {
      if(item !== gItem) {
        newItems.push(gItem);
      }
    });
    
    var newStats = statHelper.getCalculatedStatsFromItems(group, newItems);
    var origStats = vm.getGroupCalcStats();
    
    this.replaceAffectAmount[itemIndex] = {};
    for(var id in hCodeValues.stats) {
      if(hCodeValues.stats[id].summaryDisplay) {
        vm.replaceAffectAmount[itemIndex][id] = calcStatPercent(vm.getStat(id, newStats).max, vm.getStat(id, origStats).max);
      }
    }
  };
  
  function calcStatPercent(newVal, origVal) {
    if(newVal && origVal) {
      // console.log('orig: ' + origVal + ',new: ' + newVal);
      return Math.round(10000 * ((newVal-origVal)/origVal)) / 100;
    }
    else {
      return 0;
    }
  }
  
  this.getStat = function(id, stats) {
    var len = stats.length;
    for(var i=0;i<len;++i) {
      if(stats[i].id == id) {
        return stats[i];
      }
    }
    return {id: id, max:0};
  };
  
  this.getStatName = function(id) {
    var retVal = '';
    if(hCodeValues.stats[id].element == 'primary') {
      var eleId = 0;
      if(vm.savedItems[vm.groupName].element) {
        eleId = vm.savedItems[vm.groupName].element.id;
      }
      retVal += hCodeValues.elements[eleId].name;
    }
    else if(hCodeValues.stats[id].element == 'secondary') {
      var eleId = 0;
      if(vm.savedItems[vm.groupName].secondaryElement) {
        eleId = vm.savedItems[vm.groupName].secondaryElement.id;
      }
      retVal += hCodeValues.elements[eleId].name;
    }
    return retVal + ' ' + hCodeValues.stats[id].name;
  };
  
  this.getGroupItems = function() {

    var itemSplit;
    function numMatches(str) {
      if(str) {
        var matches = 0;
        for(var i=0;i<itemSplit.length;++i) {
          if(str.indexOf(itemSplit[i]) > 0) {
            matches++;
          }
        }
        return matches;
      }
      else {
        return -1;
      }
    }
    
    if(vm.groupItems == null && vm.groupName && vm.groupName in vm.savedItems && vm.item && vm.item.typeName) {
      vm.groupItems = [];

      var existing;
      if(vm.item.itemSource == 'plate' || vm.item.itemSource == 'tman') {
        existing = _.find(vm.savedItems[vm.groupName].items, function(item) {
          return item.sparkTypeId == vm.item.sparkTypeId && vm.item.itemSource == item.itemSource;
        });
      }

      var items = [];
      if(existing) {
        items.push(existing);
      }
      else {
        _.each(vm.savedItems[vm.groupName].items, function(item) {
          if(item.exchangeType && item.itemSource != 'gem' && item.itemSource != 'plate' && item.itemSource != 'plate95' && item.itemSource != 'tman') {
            if(item.exchangeType == vm.item.exchangeType) {
              items.push(item);
            }
          }
          else if(item.typeName == vm.item.typeName) {
            items.push(item);
          }
        });
        
        if(vm.item.name) {
          itemSplit = vm.item.name.split(' ');
        }
        items.sort(function(a,b) {
          return numMatches(b.name)-numMatches(a.name);
        });
      }
      
      angular.forEach(items, function(item, index) {
        if(item.name == vm.item.name) {
          vm.groupItems.push(item);
        }
      });
      
      angular.forEach(items, function(item, index) {
        if(item.name != vm.item.name) {
          vm.groupItems.push(item);
        }
      });
    }
    return vm.groupItems;
  };
  
  this.hasMaxExchangable = function() {
    var cat = itemCategory.byName(this.item.typeName);
    var items = this.getGroupItems();

    if(vm.item.itemSource == 'plate' || vm.item.itemSource == 'tman') {
      if(_.find(items, function(item) {
        return item.sparkTypeId == vm.item.sparkTypeId;
      })) {
        return true;
      }
    }
    
    if(cat && cat.maxCat) {
      if(items.length >= cat.maxCat) {
        return true;
      }
    }
    
    if(cat && cat.maxExchange) {
      if(items.length >= cat.maxExchange) {
        for(var i=0;i<items.length;++i) {
          if(!items[i].exchangeType) {
            return false;
          }
        }
        // console.log('maxexchange reached ' + items.length + '>=' + cat.maxExchange + ' for ' + cat.name);
        return true;
      }
    }
    return false;
  };
  
  this.nextGroup = function() {
    
    var uptoItem = false;
    var nextGroup = null;
    angular.forEach(vm.groupNames, function(groupName, index) {
      if(uptoItem) {
        if(nextGroup == null) {
          nextGroup = groupName;
        }
      }
      if(groupName == vm.groupName) {
        uptoItem = true;
      }
    });
    
    if(nextGroup == null) {
      nextGroup = vm.groupNames[0];
    }
    
    vm.groupName = nextGroup;
    saveGroup();
    vm.clearGroup();
  };
  
  this.prevGroup = function() {
    
    var foundGroup = false;
    var prevGroup = null;
    angular.forEach(vm.groupNames, function(groupName, index) {
      if(groupName == vm.groupName) {
        foundGroup = true;
      }
      
      if(!foundGroup) {
        prevGroup = groupName;
      }
    });
    
    if(prevGroup == null) {
      prevGroup = vm.groupNames[vm.groupNames.length-1];
    }
    
    vm.groupName = prevGroup;
    saveGroup();
    vm.clearGroup();
  };
  
  this.addToGroup = function() {
    saveHelper.saveItem(vm.groupName, vm.item);
    this.savedItems = saveHelper.getSavedItems();
    vm.clearGroup();
    vm.onChange();
  };
  
  this.replace = function(item) {
    item.replaceItem = true;
    var newItemList = [];
    angular.forEach(vm.savedItems[vm.groupName].items, function(gItem, index) {
      if(gItem.replaceItem) {
        // console.log('found replace item');
        newItemList.push(vm.item);
      }
      else {
        newItemList.push(gItem);
      }
    });
    
    saveHelper.updatedSavedItems(vm.groupName, newItemList);
    this.savedItems = saveHelper.getSavedItems();
    vm.clearGroup();
    vm.onChange();
  };
  
  function saveGroup() {
    saveHelper.saveBuildSelection(vm.groupName, vm.savedItems);
  }
  
};

})();