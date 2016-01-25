var m = angular.module('exportLinkServices', ['translationService','ngRoute','valueServices','itemService']);

m.factory('exportLinkHelper', ['$http', function($http) {
  
  return {
    createGroupLink: function(groupName, group) {
      var itemStrings = [];
      angular.forEach(group.items, function(item, key) {
        if(item != null && item.id && item.typeName != 'custom') {
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
          if(item.sparkId > 0) {
            itemString += ':H' + item.sparkId.toString(36);
          }
          
          itemStrings.push(itemString);
        }
      });
  
      var retVal = '#/view-group?';
      
      return retVal + '&g=' + encodeURI(groupName) + '&i=' + itemStrings.join(',');
    },

    createShortUrl: function(groupName, group) {
      
      var path = this.createGroupLink(groupName, group);
      var longUrl = window.location.href.split("#")[0] + path;
      var data = { longUrl: longUrl };
      
    	$http.post(
    	  'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyD5t5o7ZcSAvM-xMwc14ft2BA-MKQA7LMo', data).success(
    	    function(data,status,headers,config){
        		group.shortUrl = data.id;
    	      sessionStorage.setItem(path, data.id);
        	}).
        	error(function(data,status,headers,config){
        		console.log(data);
        		console.log(status);
        		console.log(headers);
        		console.log(config);
        	});
    }
  }
}]);