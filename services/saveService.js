var m = angular.module('saveService', ['ngRoute']);
m.factory('saveHelper', [function() {
  return {
    saveItem: function(group, item) {
      var items = this.getSavedItems();
      if(group in items && Array.isArray(items[group].items)) {
        
        items[group].items.push(item);
        items[group].lastUpdate = (new Date()).getTime();
        this.updatedSavedItems(group, items[group].items);
      }
      else {
        this.updatedSavedItems(group, [item]);
      }
      
      localStorage.setItem('lastSavedGroup', group);
    },
    importGroup: function(group, updatedItems) {
      var items = this.getSavedItems();
      
      var groupNameIndex = 0;
      if(group.lastIndexOf(')') == group.length-1) {
        var startIndex = group.lastIndexOf('(');
        if(startIndex > 0) {
          var foundIndex = Number(group.substr(startIndex+1, group.length-startIndex-2));
          if(foundIndex > 0) {
            groupNameIndex = foundIndex + 1;
            group = group.substr(0, startIndex - 1);
          }
        }
      }
      
      for(;;) {
        var groupName = group;
        if(groupNameIndex > 0) {
          groupName = groupName + ' (' + groupNameIndex + ')';
        }
        
        if(groupName in items) {
          groupNameIndex++;
        }
        else {
          this.updatedSavedItems(groupName, updatedItems);
          break;
        }
      }
    },
    
    updatedSavedItems: function(group, updatedItems) {
      var items = this.getSavedItems();
      if(group in items) {
        if(updatedItems.length == 0) {
          delete items[group];
          console.log('no items to update');
        }
        else {
          items[group].items = updatedItems;
          items[group].lastUpdate = (new Date()).getTime();
          localStorage.setItem('lastSavedGroup', group);
          console.log('set group');
        }
      }
      else {
        items[group] = {items : updatedItems, lastUpdate: (new Date()).getTime()};
        localStorage.setItem('lastSavedGroup', group);
          console.log('created group');
      }
      
      var stringifiedData = JSON.stringify(items);
      console.log('saving: ' + stringifiedData);
      localStorage.setItem('savedItems', LZString.compressToUTF16(stringifiedData));
    },
    
    getSavedItemsByType: function(savedItems, groupNameToUse) {
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
          
          // add them in a sensible order
          // some browsers wont work with this
          function addType(typeName) {
            if(typeName in types) {
              savedItemsByType[groupName][typeName] = types[typeName];
            }
            else {
              savedItemsByType[groupName][typeName] = [];
            }
          }
          
          savedItemsByType[groupName] = {};
          addType('titles');
          addType('weapons');
          addType('armour');
          addType('accessories');
          addType('techs');
          addType('gems');
          addType('plates');
          addType('talisman');
          addType('cash');
          addType('custom');
          
          angular.forEach(group.items, function(item, index) {
            if(item != null && !(item.typeName in savedItemsByType[groupName])) {
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
        console.log('not changing name');
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
      console.log('saving: ' + stringifiedData);
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
      console.log('saving: ' + stringifiedData);
      localStorage.setItem('hiddenTypes', LZString.compressToUTF16(stringifiedData));
    }
  };
}]);