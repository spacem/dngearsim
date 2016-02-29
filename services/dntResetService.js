(function () {
'use strict';

angular.module('dnsim').factory('dntReset',['items','jobs','dntData',dntReset]);
function dntReset(items, jobs,dntData) {
  return function() {
    
    var allFactories = [jobs].concat(items.all);
    angular.forEach(allFactories, function(value, key) {
      value.reset();
      });
      
      dntData.resetAll();
  }
}

})();