angular.module('dnsim').controller('BuildTalismansCtrl',

['$window','$location','$timeout','saveHelper','statHelper','hCodeValues',
function($window,$location,$timeout,saveHelper,statHelper,hCodeValues) {
  'use strict';
  
  var vm = this;
  
  $window.document.title = 'dngearsim | TALISMANS';
  $window.scrollTo(0, 0);
  
  this.savedItems = saveHelper.getSavedItems();
  this.groupNames = Object.keys(this.savedItems);
  if(!this.groupNames) {
    this.groupNames = [];
  }
  if(this.groupNames.length > 0) {
    this.groupName = saveHelper.getCurrentBuild();
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
    // console.log('cannot find build');
    return;
  }
  
  this.getGroupCalcStats = function() {
    if(this.groupCalcStats == null) {
      var group = vm.savedItems[vm.groupName];
      if(group) {
        this.groupCalcStats = statHelper.getCalculatedStatsFromItems(group, group.items);
      }
    }
    
    return this.groupCalcStats;
  }
  
  this.getBuild = function() {
    return vm.savedItems[vm.groupName];
  }
  
  this.pickup = function(index) {
    vm.selectedIndex = index;
    
    vm.replaceHPAffectAmount = [];
    vm.replaceMDmgAffectAmount = [];
    vm.replacePDmgAffectAmount = [];
    vm.replaceAvgDmgAffectAmount = [];
  }
  
  function saveGroup() {
    saveHelper.saveBuildSelection(vm.groupName, vm.savedItems);
  }
  
  this.headers = [
    '+100%',
    '+75%',
    '+25%',
    '+0%',
    ];
  
  this.summaryStatIds = [];
  for(var id in hCodeValues.stats) {
    if(hCodeValues.stats[id].summaryDisplay) {
      this.summaryStatIds.push(id);
    }
  }
  
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
            vm.rows[rowIndex] = vm.makeFakeCells();
          }
          
          if(vm.rows[rowIndex][pcIndex].index < 0) {
            if(!item.enchantmentNum) {
              item.enchantmentNum = 0;
            }
            
            var data = vm.makeCell(item, index);
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
      vm.rows[vm.rows.length+1] = vm.makeFakeCells();
    }
  };
  
  this.makeFakeCells = function(num) {
    return [vm.makeCell({enchantmentNum:100},-1),vm.makeCell({enchantmentNum:75},-2),vm.makeCell({enchantmentNum:25},-3),vm.makeCell({enchantmentNum:0},-4)];
  };
  
  this.makeCell = function(item, index) {
    return { item: item, index: index };
  };
  
  this.click = function(col) {
    if(vm.selectedIndex == -1) {
      if(col.index >= 0) {
        vm.pickup(col.index);
      }
    }
    else {
      vm.move(col);
    }
  };
  
  this.move = function(col) {
    
    var items = vm.savedItems[vm.groupName].items;
    if(col.index >= 0) {
      var swapEnchantmentNumber = col.item.enchantmentNum;
      
      vm.setTalisman(col.item, items[vm.selectedIndex].enchantmentNum);
      vm.setTalisman(items[vm.selectedIndex], swapEnchantmentNumber);
      items[col.index] = items[vm.selectedIndex];
      items[vm.selectedIndex] = col.item;
    }
    else {
      var item = items[vm.selectedIndex];
      vm.setTalisman(item, col.item.enchantmentNum);
      items.splice(vm.selectedIndex, 1);
      items.push(item);
    }

    vm.groupCalcStats = null;
    vm.selectedIndex = -1;
    vm.updateRows();
    vm.replaceAffectAmount = {};
    $timeout();
  };
  
  this.setTalisman = function(item, newEnhancementNum) {
    var extraStats = [];
    var useStats = hCodeValues.mergeStats(item.stats, []);
    angular.forEach(useStats, function(stat, index) {
      if(newEnhancementNum) {
        extraStats.push({id: stat.id, max: stat.max * (newEnhancementNum/100)});
      }
    });
    
    item.enchantmentStats = extraStats;
    item.enchantmentNum = newEnhancementNum;
    
    item.fullStats = hCodeValues.mergeStats(item.enchantmentStats, item.stats);
  };
  
    
  this.replaceAffectAmount = {};
  this.getReplaceAffectAmount = function(statId, itemIndex, item) {
    this.initReplaceAffects(itemIndex, item);
    if(this.replaceAffectAmount[itemIndex]) {
      return this.replaceAffectAmount[itemIndex][statId];
    }
  };
  
  this.initReplaceAffects = function(itemIndex, item) {
    if(vm.replaceAffectAmount[itemIndex] || vm.selectedIndex == -1) {
      return;
    }
    this.replaceAffectAmount[itemIndex] = {};
    
    var group = vm.savedItems[vm.groupName];
    var item2 = group.items[vm.selectedIndex];
    
    var extraStats = [];
    var fullStats1 = [];
    if(item.stats) {
      var useStats = hCodeValues.mergeStats(item.stats, []);
      angular.forEach(useStats, function(stat, index) {
        extraStats.push({id: stat.id, max: stat.max * (item2.enchantmentNum/100)});
      });
      fullStats1 = hCodeValues.mergeStats(extraStats, item.stats);
    }
    
    extraStats = [];
    var useItem2Stats = hCodeValues.mergeStats(item2.stats, []);
    angular.forEach(useItem2Stats, function(stat, index) {
      extraStats.push({id: stat.id, max: stat.max * (item.enchantmentNum/100)});
    });
    var fullStats2 = hCodeValues.mergeStats(extraStats, item2.stats);

    var newItems = [{stats: fullStats1}, {stats: fullStats2}];
    angular.forEach(group.items, function(gItem , index) {
      if(item !== gItem && item2 !== gItem) {
        newItems.push(gItem);
      }
    });
    
    var newStats = statHelper.getCalculatedStatsFromItems(group, newItems);
    var origStats = vm.getGroupCalcStats();
    
    for(var id in hCodeValues.stats) {
      if(hCodeValues.stats[id].summaryDisplay) {
        vm.replaceAffectAmount[itemIndex][id] = calcStatPercent(vm.getStat(id, newStats).max, vm.getStat(id, origStats).max);
      }
    }
  };
  
  this.getStatName = function(id) {
    return statHelper.getStatName(vm.savedItems[vm.groupName], id);
  };
  
  this.getStat = function(id, stats) {
    var len = stats.length;
    for(var i=0;i<len;++i) {
      if(stats[i].id == id) {
        return stats[i];
      }
    }
    return {id: id, max:0};
  };
  
  function calcStatPercent(newVal, origVal) {
    if(newVal && origVal) {
      return Math.round(10000 * (1 - (origVal / newVal))) / 100;
    }
    else {
      return 0;
    }
  }
  
  this.save = function() {
    saveHelper.updatedSavedItems(vm.groupName, vm.savedItems[vm.groupName].items);
    $location.path('/build');
    $location.search('buildName', vm.groupName);
  };
  
  this.updateRows();
  
}]); 