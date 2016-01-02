var m = angular.module('exportLinkServices', ['translationService','ngRoute','valueServices','itemService']);

m.factory('createGroupLink',
[
function() {
  return function(groupName, groupItems) {
    var itemStrings = [];
    angular.forEach(groupItems, function(item, key) {
      var itemString = 'I' + item.id.toString(36) + ':_' + item.itemTypeName;
      if(item.enchantmentNum > 0) {
        itemString += ':E' + item.enchantmentNum.toString(36);
      }
      if(item.pid > 0) {
        itemString += ':P' + item.pid.toString(36);
      }
      if(item.setId > 0) {
        itemString += ':S' + item.setId.toString(36);
      }
      
      itemStrings.push(itemString);
    });

    var retVal = '#/view-group?';
    
    return retVal + '&g=' + encodeURI(groupName) + '&i=' + itemStrings.join(',');
  }
}]);