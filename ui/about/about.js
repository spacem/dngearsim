(function () {
'use strict';
angular.module('dnsim')
.controller('AboutCtrl', 
  ['$window',
  function($window) {
    'use strict';
    document.body.className = 'default-back';
    $window.document.title = 'dngearsim | ABOUT/FAQ';
    $(document).ready(function($) { 
        $('meta[name=description]').attr('content', 'Information about the simulator');
    });
  }]
);
})();