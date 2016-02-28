angular.module('groupAssignmentController', [])
.controller('groupAssignmentCtrl',

['hCodeValues','statHelper','saveHelper',
function(hCodeValues,statHelper,saveHelper) {
  'use strict';
  
  var vm = this;
  
  if(this.item == null) return;
  this.savedItems = saveHelper.getSavedItems();
  this.groupNames = Object.keys(this.savedItems);
  if(this.groupNames.length > 0) {
    this.groupName = localStorage.getItem('currentGroup');
  }
  else {
    this.groupName = null;
  }
  
  if(!this.groupName || !(this.groupName in this.savedItems)) {
    if(this.groupNames.length > 0) {
      this.groupName = this.groupNames[0];
    }
  }
  
  if(!this.groupName) {
    return;
  }
  
  this.clearGroup = function() {
    this.addHPAffectAmount = null;
    this.addMDmgAffectAmount = null;
    this.addPDmgAffectAmount = null;
    this.addAvgDmgAffectAmount = null;
    
    this.replaceHPAffectAmount = [];
    this.replaceMDmgAffectAmount = [];
    this.replacePDmgAffectAmount = [];
    this.replaceAvgDmgAffectAmount = [];

    this.groupItems = null;
    this.groupCalcStats = null
  }
  this.clearGroup();
  
  this.getAddHPAffectAmount = function() {
    this.initAddAffects();
    return this.addHPAffectAmount;
  }
  
  this.getAddMDmgAffectAmount = function() {
    this.initAddAffects();
    return this.addMDmgAffectAmount;
  }
  
  this.getAddPDmgAffectAmount = function() {
    this.initAddAffects();
    return this.addPDmgAffectAmount;
  }
  
  this.getAddAvgDmgAffectAmount = function() {
    this.initAddAffects();
    return this.addAvgDmgAffectAmount;
  }
  
  this.getReplaceHPAffectAmount = function(itemIndex, item) {
    this.initReplaceAffects(itemIndex, item);
    return this.replaceHPAffectAmount[itemIndex];
  }

  this.getReplaceMDmgAffectAmount = function(itemIndex, item) {
    this.initReplaceAffects(itemIndex, item);
    return this.replaceMDmgAffectAmount[itemIndex];
  }
  
  this.getReplacePDmgAffectAmount = function(itemIndex, item) {
    this.initReplaceAffects(itemIndex, item);
    return this.replacePDmgAffectAmount[itemIndex];
  }
  
  this.getReplaceAvgDmgAffectAmount = function(itemIndex, item) {
    this.initReplaceAffects(itemIndex, item);
    return this.replaceAvgDmgAffectAmount[itemIndex];
  }
  
  this.getGroupCalcStats = function() {
    if(this.groupCalcStats == null) {
      
      var group = vm.savedItems[vm.groupName];
      if(group) {
        this.groupCalcStats = this.getCalculatedStats(group, group.items);
      }
    }
    
    return this.groupCalcStats;
  }
  
  this.getCalculatedStats = function(group, items) {
    var nakedStats = statHelper.getNakedStats(group);
    var combinedStats = statHelper.getCombinedStats(items);
    var setStats = statHelper.getSetStats(items);
    var allStats = hCodeValues.mergeStats(nakedStats, combinedStats);
    allStats = hCodeValues.mergeStats(allStats, setStats);
    if(group.heroStats != null && group.heroStats.length > 0) {
      allStats = hCodeValues.mergeStats(allStats, group.heroStats);
    }
    
    return statHelper.getCalculatedStats(group, allStats);
  }
  
  this.initAddAffects = function() {
    if(vm.addHPAffectAmount || vm.addMDmgAffectAmount || vm.addPDmgAffectAmount || vm.addAvgDmgAffectAmount) {
      return;
    }
    
    var origStats = vm.getGroupCalcStats();
    
    var group = vm.savedItems[vm.groupName];
    var newItems = group.items.concat([vm.item]);
    var newStats = vm.getCalculatedStats(group, newItems);
    
    vm.addHPAffectAmount = calcStatPercent(vm.getHpStat(newStats).max, vm.getHpStat(origStats).max);
    vm.addPDmgAffectAmount = calcStatPercent(vm.getPDmgStat(newStats).max, vm.getPDmgStat(origStats).max);
    vm.addMDmgAffectAmount = calcStatPercent(vm.getMDmgStat(newStats).max, vm.getMDmgStat(origStats).max);
    vm.addAvgDmgAffectAmount = calcStatPercent(vm.getAvgDmgStat(newStats).max, vm.getAvgDmgStat(origStats).max);
  }
  
  this.initReplaceAffects = function(itemIndex, item) {
    if(vm.replaceHPAffectAmount[itemIndex] || vm.replaceMDmgAffectAmount[itemIndex] || vm.replacePDmgAffectAmount[itemIndex] || vm.replaceAvgDmgAffectAmount[itemIndex]) {
      return;
    }
    
    var group = vm.savedItems[vm.groupName];
    var newItems = [vm.item];
    angular.forEach(group.items, function(gItem , index) {
      if(item !== gItem) {
        newItems.push(gItem);
      }
    });
    
    var newStats = vm.getCalculatedStats(group, newItems);
    var origStats = vm.getGroupCalcStats();
    
    vm.replaceHPAffectAmount[itemIndex] = calcStatPercent(vm.getHpStat(newStats).max, vm.getHpStat(origStats).max);
    vm.replacePDmgAffectAmount[itemIndex] = calcStatPercent(vm.getPDmgStat(newStats).max, vm.getPDmgStat(origStats).max);
    vm.replaceMDmgAffectAmount[itemIndex] = calcStatPercent(vm.getMDmgStat(newStats).max, vm.getMDmgStat(origStats).max);
    vm.replaceAvgDmgAffectAmount[itemIndex] = calcStatPercent(vm.getAvgDmgStat(newStats).max, vm.getAvgDmgStat(origStats).max);
  }
  
  function calcStatPercent(newVal, origVal) {
    if(newVal && origVal) {
      // console.log('orig: ' + origVal + ',new: ' + newVal);
      return Math.round(10000 * (1 - (origVal / newVal))) / 100;
    }
    else {
      return 0;
    }
  }
  
  this.getHpStat = function(stats) {
    return getStat(3008, stats);
  }
  
  this.getPDmgStat = function(stats) {
    return getStat(1004, stats);
  }
  
  this.getMDmgStat = function(stats) {
    return getStat(1006, stats);
  }
  
  this.getAvgDmgStat = function(stats) {
    return getStat(1001, stats);
  }
  
  function getStat(id, stats) {
    var len = stats.length;
    for(var i=0;i<len;++i) {
      if(stats[i].id == id) {
        return stats[i];
      }
    }
    return {id: id, max:0};
  }
  
  this.getGroupItems = function() {

    var itemSplit;
    function numMatches(str) {
      if(str) {
        var numMatches = 0;
        for(var i=0;i<itemSplit.length;++i) {
          if(str.indexOf(itemSplit[i]) > 0) {
            numMatches++;
          }
        }
        return numMatches;
      }
      else {
        return -1;
      }
    }
    
    if(vm.groupItems == null && vm.groupName && vm.groupName in vm.savedItems && vm.item && vm.item.typeName) {
      vm.groupItems = [];
      
      var items = [];
      angular.forEach(vm.savedItems[vm.groupName].items, function(item, index) {
        if(item.typeName == vm.item.typeName) {
          items.push(item);
        }
      });
      
      if(vm.item.name) {
        itemSplit = vm.item.name.split(' ');
      }
      items.sort(function(a,b) {
        return numMatches(b.name)-numMatches(a.name);
      });
      
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
  }
  
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
  }
  
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
  }
  
  this.addToGroup = function() {
    saveHelper.saveItem(vm.groupName, vm.item);
    this.savedItems = saveHelper.getSavedItems();
    vm.clearGroup();
  }
  
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
  }
  
  function saveGroup() {
    localStorage.setItem('currentGroup', vm.groupName);
  }
  
}])
.directive('dngearsimGroupAssignment', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
    },
    controller: 'groupAssignmentCtrl',
    controllerAs: 'editCtrl',
    templateUrl: 'ui/item/group-assignment.html?bust=' + Math.random().toString(36).slice(2)
  };
});