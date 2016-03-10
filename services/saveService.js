(function () {
'use strict';

angular.module('dnsim').factory('saveHelper', ['itemCategory',saveHelper]);
function saveHelper(itemCategory) {
  return {
    saveItem: function(groupName, item) {
      var groups = this.getSavedItems();
      if(groupName in groups && Array.isArray(groups[groupName].items)) {
        
        groups[groupName].items.push(item);
        groups[groupName].lastUpdate = (new Date()).getTime();
        this.updatedSavedItems(groupName, groups[groupName].items);
      }
      else {
        this.updatedSavedItems(groupName, [item]);
      }
      
      localStorage.setItem('lastSavedGroup', groupName);
    },
    
    importGroup: function(groupName, updatedItems) {
      var items = this.getSavedItems();
      groupName = this.getUniqueGroupName(groupName, items);
      this.updatedSavedItems(groupName, updatedItems);
    },
    
    getUniqueGroupName: function(groupName, existingGroups) {
      var groupNameIndex = 0;
      if(groupName.lastIndexOf(')') == groupName.length-1) {
        var startIndex = groupName.lastIndexOf('(');
        if(startIndex > 0) {
          var foundIndex = Number(groupName.substr(startIndex+1, groupName.length-startIndex-2));
          if(foundIndex > 0) {
            groupNameIndex = foundIndex + 1;
            groupName = groupName.substr(0, startIndex - 1);
          }
        }
      }
      
      var originalName = groupName;
      for(;;) {
        var groupName = originalName;
        if(groupNameIndex > 0) {
          groupName = originalName + ' (' + groupNameIndex + ')';
        }
        
        if(groupName in existingGroups) {
          groupNameIndex++;
        }
        else {
          break;
        }
      }
      
      return groupName;
    },
    
    updatedSavedItems: function(groupName, updatedItems) {
      var items = this.getSavedItems();
      if(groupName in items) {
        if(updatedItems.length == 0) {
          delete items[groupName];
          // console.log('no items to update');
        }
        else {
          items[groupName].items = updatedItems;
          items[groupName].lastUpdate = (new Date()).getTime();
          localStorage.setItem('lastSavedGroup', groupName);
          // console.log('set group');
        }
      }
      else {
        items[groupName] = {items : updatedItems, lastUpdate: (new Date()).getTime()};
        localStorage.setItem('lastSavedGroup', groupName);
          // console.log('created group');
      }
      
      var stringifiedData = JSON.stringify(items);
      // console.log('saving: ' + stringifiedData);
      localStorage.setItem('savedItems', LZString.compressToUTF16(stringifiedData));
    },
    
    getSavedItemsByType: function(savedItems) {
      var savedItemsByType = {};
      if(savedItems != null) {
        angular.forEach(savedItems, function(group, groupName) {
          var types = {};
          angular.forEach(group.items, function(item, index) {
            if(item != null) {
              if(!(item.typeName in types)) {
                types[item.typeName] = [];
              }
              types[item.typeName].push(item);
            }
          });
          
          function addType(typeName) {
            if(typeName in types) {
              var sorted = types[typeName].sort(function(item1, item2) {
                if('rank' in item1 && 'exchangeType' in item1 && 'levelLimit' in item1 &&
                  'rank' in item2 && 'exchangeType' in item2 && 'levelLimit' in item2) {

                  if(item2.exchangeType == item1.exchangeType) {
                    if(item2.levelLimit == item1.levelLimit) {
                      return (item2.rank.id - item1.rank.id);
                    }
                    else {
                      return item2.levelLimit.id - item1.levelLimit.id;
                    }
                  }
                  else {
                    return item1.exchangeType - item2.exchangeType;
                  }
                }
                else {
                  return item1.name.localeCompare(item2.name);
                }
              });
              savedItemsByType[groupName][typeName] = sorted;
            }
            else {
              savedItemsByType[groupName][typeName] = [];
            }
          }
          
          savedItemsByType[groupName] = {};
          angular.forEach(itemCategory.categories, function(category, index) {
            addType(category.name);
          });
          
          angular.forEach(group.items, function(item, index) {
            if(item != null && !(item.typeName in savedItemsByType[groupName])) {
              // console.log('we dont know ' + item.typeName + ' anymore')
              savedItemsByType[groupName].typeError = true;
            }
          });
        });
      }
      return savedItemsByType;
    },
    
    renameSavedGroup: function(
      oldGroupName, newGroupName, enemyLevel, playerLevel, heroLevel, job, damageType, element,
      enemyStatCaps, playerStatCaps, conversions, baseStats, heroStats) {
        
      var savedItems = this.getSavedItems();
      
      if(newGroupName in savedItems || oldGroupName == newGroupName) {
        // console.log('not changing name');
        newGroupName = oldGroupName;
      }
      else if(oldGroupName in savedItems) {
        var group = savedItems[oldGroupName];
        savedItems[newGroupName] = group;
        delete savedItems[oldGroupName];
      }
      
      savedItems[newGroupName].enemyLevel = enemyLevel;
      savedItems[newGroupName].playerLevel = playerLevel;
      savedItems[newGroupName].heroLevel = heroLevel;
      savedItems[newGroupName].job = job;
      savedItems[newGroupName].damageType = damageType;
      savedItems[newGroupName].element = element;
      savedItems[newGroupName].enemyStatCaps = enemyStatCaps;
      savedItems[newGroupName].playerStatCaps = playerStatCaps;
      savedItems[newGroupName].conversions = conversions;
      savedItems[newGroupName].baseStats = baseStats;
      savedItems[newGroupName].heroStats = heroStats;
      
      var stringifiedData = JSON.stringify(savedItems);
      localStorage.setItem('savedItems', LZString.compressToUTF16(stringifiedData));
    },
    
    getSavedItems: function() {
      try {
        var stringifiedData = LZString.decompressFromUTF16(localStorage.getItem('savedItems'));
        var savedItems = JSON.parse(stringifiedData);
        return savedItems;
      }
      catch(ex) {
      }
      
      return {};
    },
    
    getCustomItems: function() {
      try {
        var stringifiedData = LZString.decompressFromUTF16(localStorage.getItem('customItems'));
        var savedItems = JSON.parse(stringifiedData);
        return savedItems;
      }
      catch(ex) {
      }
      
      return [];
    },
    
    saveCustomItems: function(items) {
      var stringifiedData = JSON.stringify(items);
      // console.log('saving: ' + stringifiedData);
      localStorage.setItem('customItems', LZString.compressToUTF16(stringifiedData));
    },
    
    getHiddenTypes: function() {
      try {
        var stringifiedData = LZString.decompressFromUTF16(localStorage.getItem('hiddenTypes'));
        var savedItems = JSON.parse(stringifiedData);
        return savedItems;
      }
      catch(ex) {
      }
      
      return {};
    },
    
    saveHiddenTypes: function(items) {
      var stringifiedData = JSON.stringify(items);
      // console.log('saving: ' + stringifiedData);
      localStorage.setItem('hiddenTypes', LZString.compressToUTF16(stringifiedData));
    }
  };
}

})();