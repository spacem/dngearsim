angular.module('dnsim').controller('buildStatsCtrl',

['$routeParams','$location','hCodeValues','statHelper','itemCategory',
function($routeParams,$location,hCodeValues,statHelper,itemCategory) {
  'use strict';
}])
.directive('dngearsimBuildStats', function() {
  return {
    scope: true,
    bindToController: {
      stats: '=stats',
      build: '=build',
    },
    controller: 'buildStatsCtrl',
    controllerAs: 'statsCtrl',
    templateUrl: 'ui/builds/build-stats.html'
  };
});