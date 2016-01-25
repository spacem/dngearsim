var m = angular.module('groupServices', ['saveService','valueServices','itemService','exportLinkServices','groupServices']);

m.factory('groupHelper', ['items','dntData','createItem','initItem','hCodeValues','itemColumnsToLoad', function(items,dntData,createItem,initItem,hCodeValues,itemColumnsToLoad) {
  
  return {
    reloadGroup: function(groupName, group) {
      var newItems = [];
      angular.forEach(group.items, function(item, key) {
        
        if(item == null) {
          
        }
        else if(item.typeName == 'custom') {
          newItems.push(item);
        }
        else if(item.itemTypeName in items) {
          var itemType = items[item.itemTypeName];
          var ds = dntData.find(itemType.mainDnt, 'id', item.id);
          if(ds.length > 0) {
            var d = ds[0];
          
            var totalRatio = 0;
            var p = null;
            if(item.pid > 0) {
              var ps = dntData.find(itemType.potentialDnt, 'id', item.pid);
              if(ps.length > 0) {
                p = ps[0];
                
                if(p.PotentialID != d.TypeParam1) {
                  // this happened one time
                  // not sure how but it corrupted the stats
                  p = null;
                }
                else {
                  var potentials = dntData.find(itemType.potentialDnt, 'PotentialID', p.PotentialID);
                  angular.forEach(potentials, function(value, key) {
                    totalRatio += value.PotentialRatio;
                  });
                }
              }
            }
            
            var newItem = createItem(item.itemTypeName, d, p, totalRatio);
            initItem(newItem);
            
            var sets = dntData.find(itemType.setDnt, 'id', item.setId);
            if(sets.length > 0) {
              newItem.setId = item.setId;
              newItem.setStats = hCodeValues.getStats(sets[0]);
            }
            
            if(item.enchantmentNum > 0) {
              newItem.enchantmentNum = item.enchantmentNum;
              
              if(newItem.typeName == 'talisman') {
                var extraStats = [];
                angular.forEach(newItem.stats, function(stat, index) {
                  extraStats.push({id: stat.id, max: stat.max * (newItem.enchantmentNum/100)});
                });
                
                newItem.enchantmentStats = extraStats;
                newItem.fullStats = hCodeValues.mergeStats(newItem.enchantmentStats, newItem.stats);
              }
              else {
                var enchantments = dntData.find(itemType.enchantDnt, 'EnchantID', item.enchantmentId);
                angular.forEach(enchantments, function(enchantment, index) {
                  if(enchantment.EnchantLevel == newItem.enchantmentNum) {
                    newItem.enchantmentStats = hCodeValues.getStats(enchantment);
                    newItem.fullStats = hCodeValues.mergeStats(newItem.enchantmentStats, newItem.stats);
                  }
                });
              }
            }
            else {
              item.enchantmentNum = 0;
              newItem.fullStats = newItem.stats;
            }
            
            newItems.push(newItem);
          }
        }
      });
      
      return newItems;
    },
    
    getDntFiles: function(group) {

      var dntFiles = {};
      angular.forEach(group.items, function(item, key) {
        if(item != null && item.itemTypeName in items) {
          var itemType = items[item.itemTypeName];
  
          dntFiles[itemType.mainDnt] = itemColumnsToLoad.mainDnt;
          if(item.pid > 0 && 'potentialDnt' in itemType) {
            dntFiles[itemType.potentialDnt] = itemColumnsToLoad.potentialDnt;
          }
          
          if(item.enchantmentNum > 0 && 'enchantDnt' in itemType) {
            dntFiles[itemType.enchantDnt] = itemColumnsToLoad.enchantDnt;
          }
          
          if(item.setId > 0 && 'setDnt' in itemType) {
            dntFiles[itemType.setDnt] = itemColumnsToLoad.setDnt;
          }
        }
      });
      
      return dntFiles;
    }
  }
}]);