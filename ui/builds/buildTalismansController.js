angular.module('dnsim').controller('BuildTalismansCtrl',

['$location','$routeParams','$timeout','saveHelper','statHelper','jobs','hCodeValues','itemColumnsToLoad','character',
function($location,$routeParams,$timeout,saveHelper,statHelper,jobs,hCodeValues,itemColumnsToLoad,character) {
  'use strict';
  
  var vm = this;
  this.savedItems = saveHelper.getSavedItems();
  this.groupNames = Object.keys(this.savedItems);
  if(!this.groupNames) {
    this.groupNames = [];
  }
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
    console.log('cannot find build');
    return;
  }
  
  this.getGroupCalcStats = function() {
    if(this.groupCalcStats == null) {
      console.log('getting group calc stats');
      
      var group = vm.savedItems[vm.groupName];
      if(group) {
        this.groupCalcStats = this.getCalculatedStats(group, group.items);
      }
    }
    
    return this.groupCalcStats;
  }
  
  this.pickup = function(index) {
    vm.selectedIndex = index;
    
    vm.replaceHPAffectAmount = [];
    vm.replaceMDmgAffectAmount = [];
    vm.replacePDmgAffectAmount = [];
    vm.replaceAvgDmgAffectAmount = [];
  }
  
  this.getCalculatedStats = function(group, items) {
    var nakedStats = statHelper.getNakedStats(group);
    var combinedStats = statHelper.getCombinedStats(items);
    var setStats = statHelper.getSetStats(items);
    var allStats = nakedStats.concat(combinedStats).concat(setStats);
    if(group.heroStats != null && group.heroStats.length > 0) {
      allStats = allStats.concat(group.heroStats);
    }
    allStats = hCodeValues.mergeStats(allStats);
    
    return statHelper.getCalculatedStats(group, allStats);
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
    vm.groupCalcStats = null;
    saveGroup();
    vm.savedItems = saveHelper.getSavedItems();
    vm.updateRows();
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
    vm.groupCalcStats = null;
    saveGroup();
    vm.savedItems = saveHelper.getSavedItems();
    vm.updateRows();
  }
  
  function saveGroup() {
    localStorage.setItem('currentGroup', vm.groupName);
  }
  
  this.headers = [
    '+100%',
    '+75%',
    '+25%',
    '+0%',
    ];
  
  this.pcIndexes = {};
  this.pcIndexes['100'] = 0;
  this.pcIndexes['75'] = 1;
  this.pcIndexes['25'] = 2;
  this.pcIndexes['0'] = 3;
  
  this.selectedIndex = -1;
  
  this.rows = [];
  
  this.updateRows = function() {
    vm.rows = [];
        
    angular.forEach(vm.savedItems[vm.groupName].items, function(item, index) {
      if(item.typeName == 'talisman') {
        var pcIndex = vm.pcIndexes[item.enchantmentNum];
        if(!pcIndex && pcIndex != 0) {
          pcIndex = 3;
        }
        
        var rowIndex = 0;
        for(;;) {
          if(!vm.rows[rowIndex]) {
            vm.rows[rowIndex] = [{enchantNum:100},{enchantNum:75},{enchantNum:25},{enchantNum:0}];
          }
          
          if(!vm.rows[rowIndex][pcIndex].item) {
            var data = { item: item, index: index };
            vm.rows[rowIndex][pcIndex] = data;
            break;
          }
          else {
            rowIndex++;
          }
        }
      }
      
    });
    
    if(vm.rows.length < 3) {
      vm.rows[vm.rows.length+1] = [{enchantNum:100},{enchantNum:75},{enchantNum:25},{enchantNum:0}];
    }
  }
  
  this.move = function(col) {
    
    var items = vm.savedItems[vm.groupName].items;
    if(col.item) {
      var swapEnchantmentNumber = col.item.enchantmentNum;
      
      vm.setTalisman(col.item, items[vm.selectedIndex].enchantmentNum);
      vm.setTalisman(items[vm.selectedIndex], swapEnchantmentNumber);
      
      items[col.index] = items[vm.selectedIndex];
      items[vm.selectedIndex] = col.item;
    }
    else {
      var item = items[vm.selectedIndex];
      vm.setTalisman(item, col.enchantNum);
      items.splice(vm.selectedIndex, 1);
      items.push(item);
    }

    vm.groupCalcStats = null;
    vm.selectedIndex = -1;
    vm.updateRows();
    
    $timeout();
  }
  
  this.setTalisman = function(item, newEnhancementNum) {
    var extraStats = [];
    angular.forEach(item.stats, function(stat, index) {
      extraStats.push({id: stat.id, max: stat.max * (newEnhancementNum/100)});
    });
    
    item.enchantmentStats = extraStats;
    item.enchantmentNum = newEnhancementNum;
    
    item.fullStats = hCodeValues.mergeStats(item.enchantmentStats, item.stats);
  }
  
    
  this.replaceHPAffectAmount = [];
  this.replaceMDmgAffectAmount = [];
  this.replacePDmgAffectAmount = [];
  this.replaceAvgDmgAffectAmount = [];

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
  
  this.initReplaceAffects = function(itemIndex, item) {
    if(vm.replaceHPAffectAmount[itemIndex] || vm.replaceMDmgAffectAmount[itemIndex] || vm.replacePDmgAffectAmount[itemIndex] || vm.replaceAvgDmgAffectAmount[itemIndex]) {
      return;
    }
    
    var group = vm.savedItems[vm.groupName];
    
    var item2 = group.items[vm.selectedIndex];
    var extraStats = [];
    angular.forEach(item.stats, function(stat, index) {
      extraStats.push({id: stat.id, max: stat.max * (item2.enchantmentNum/100)});
    });
    var fullStats1 = hCodeValues.mergeStats(extraStats, item.stats);
    
    extraStats = [];
    angular.forEach(item2.stats, function(stat, index) {
      extraStats.push({id: stat.id, max: stat.max * (item.enchantmentNum/100)});
    });
    var fullStats2 = hCodeValues.mergeStats(extraStats, item2.stats);
    
    
    var newItems = [{fullStats: fullStats1}, {fullStats: fullStats2}];
    angular.forEach(group.items, function(gItem , index) {
      if(item !== gItem && item2 != gItem) {
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
  
  function calcStatPercent(newVal, origVal) {
    if(newVal && origVal) {
      // console.log('orig: ' + origVal + ',new: ' + newVal);
      return Math.round(10000 * (1 - (origVal / newVal))) / 100;
    }
    else {
      return 0;
    }
  }
  
  
  
  this.updateRows();
  
}]); 