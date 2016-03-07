(function () {
'use strict';

angular.module('dnsim').factory('dntReset',['items','jobs','dntData',dntReset]);
function dntReset(items, jobs, dntData) {
  return function() {
    
    angular.forEach(items, function(source, name) {
      source.reset();
    });
    
    jobs.reset();
    dntData.resetAll();
  }
}

})();