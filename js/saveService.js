var m = angular.module('saveService', ['ngRoute']);
m.factory('saveItem', ['getSavedItems','updatedSavedItems', function(getSavedItems,updatedSavedItems) {
  return function(group, item) {

    var items = getSavedItems();
    if(group in items && Array.isArray(items[group].items)) {
      
      items[group].items.push(item);
      updatedSavedItems(group, items[group].items);
    }
    else {
      updatedSavedItems(group, [item]);
    }
  };
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
      }
    }
    else {
      items[group] = {items : updatedItems};
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