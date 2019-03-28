(function () {
'use strict';
angular.module('dnsim').filter('escape', [function() {
  'use strict';

  function escapeFilter(input) {
      if(input) {
          return encodeURIComponent(input);
      }
      return '';
  }

  return escapeFilter;
}]);

})();