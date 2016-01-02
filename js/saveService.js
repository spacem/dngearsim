var m = angular.module('saveService', ['ngRoute']);
m.factory('saveItem', ['getSavedItems','updatedSavedItems', function(getSavedItems,updatedSavedItems) {
  return function(group, item) {

    var items = getSavedItems();
    if(group in items && Array.isArray(items[group].items)) {
      
      items[group].items.push(item);
      items[group].lastUpdate = (new Date()).getTime();
      updatedSavedItems(group, items[group].items);
    }
    else {
      updatedSavedItems(group, [item]);
    }
    
    localStorage.setItem('lastSavedGroup', group);
  };
}]);

m.factory('importGroup', ['getSavedItems','updatedSavedItems', function(getSavedItems, updatedSavedItems) {
  return function(group, updatedItems) {
    var items = getSavedItems();
    
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
        updatedSavedItems(groupName, updatedItems);
        break;
      }
    }
  }
}]);

m.factory('updatedSavedItems', ['getSavedItems', function(getSavedItems) {
  return function(group, updatedItems) {

    var items = getSavedItems();
    if(group in items) {
      if(updatedItems.length == 0) {
        delete items[group];
      }
      else {
        items[group].items = updatedItems;
        items[group].lastUpdate = (new Date()).getTime();
        localStorage.setItem('lastSavedGroup', group);
      }
    }
    else {
      items[group] = {items : updatedItems, lastUpdate: (new Date()).getTime()};
      localStorage.setItem('lastSavedGroup', group);
    }
    
    var stringifiedData = JSON.stringify(items);
    console.log('saving: ' + stringifiedData);
    localStorage.setItem('savedItems', LZString.compressToUTF16(stringifiedData));
  };
}]);

m.factory('getSavedItems', ['$routeParams', function($routeParams) {
  return function() {
    try {
      var stringifiedData = LZString.decompressFromUTF16(localStorage.getItem('savedItems'));
      var savedItems = JSON.parse(stringifiedData);
      if(savedItems != null) {
        return savedItems;
      }
    }
    catch(ex) {
    }
    
    return {};
  };
}]);