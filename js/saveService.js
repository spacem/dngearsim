var m = angular.module('saveService', ['ngRoute']);
m.factory('saveItem', ['getSavedItems', function(getSavedItems) {
  return function(item, group) {

    var items = getSavedItems();
    if(!(group in items)) {
      items[group] = [];
    }
    
    items[group].push(item);
    
    var stringifiedData = JSON.stringify(items);
    sessionStorage.setItem('savedItems', LZString.compress(stringifiedData));
  };
}]);
m.factory('removeSavedItem', ['getSavedItems', function(getSavedItems) {
  return function(group, index) {

    var items = getSavedItems();
    items[group].splice(index, 1);
    if(items[group].length == 0) {
      delete items[group];
    }
    
    var stringifiedData = JSON.stringify(items);
    sessionStorage.setItem('savedItems', LZString.compress(stringifiedData));
  };
}]);
m.factory('getSavedItems', ['$routeParams', function($routeParams) {
  return function() {
    try {
      var stringifiedData = LZString.decompress(sessionStorage.getItem('savedItems'));
      return JSON.parse(stringifiedData);
    }
    catch(ex) {
      return {};
    }
  };
}]);