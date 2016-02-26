var m = angular.module('groupServices', ['saveService','valueServices','itemService','exportLinkServices','groupServices']);

m.factory('groupHelper', ['items','dntData','createItem','initItem','hCodeValues','itemColumnsToLoad','jobs','statHelper','translations','exportLinkHelper',
function(items,dntData,createItem,initItem,hCodeValues,itemColumnsToLoad,jobs,statHelper,translations,exportLinkHelper) {
  'use strict';
  
  return {
    reloadGroup: function(groupName, group) {
      var newItems = [];
      angular.forEach(group.items, function(item, key) {
        var newItem = exportLinkHelper.reloadItem(item);
        if(newItem != null) {
          newItems.push(newItem);
        }
      });
      
      return newItems;
    },
    
    getDntFiles: function(group) {

      var allDntFiles = {};
      angular.forEach(group.items, function(item, key1) {
        
        var dntFiles = exportLinkHelper.getDntFiles(item);

        angular.forEach(dntFiles, function(value, key) {
          allDntFiles[key] = value;
        });
      });
      
      return allDntFiles;
    }
  }
}]);