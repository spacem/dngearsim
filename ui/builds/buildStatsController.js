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
    },
    controller: 'buildStatsCtrl',
    controllerAs: 'statsCtrl',
    templateUrl: 'ui/builds/build-stats.html?bust=' + Math.random().toString(36).slice(2)
  };
});