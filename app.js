(function () {
'use strict';

// templates are imported via gulp job
angular.module('templates', []);
angular.module('dnsim', ['ngAnimate','ngRoute','angulartics','angulartics.google.analytics','templates', 'ngAria', 'infinite-scroll']);

angular.module('dnsim').config(['$locationProvider', setupHtml5Mode]);

function setupHtml5Mode($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true,
        rewriteLinks: true
    });
};

})();