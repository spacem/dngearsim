'use strict';

angular.module('dnsim').directive('dngearsimBuildStats', function() {
  return {
    scope: true,
    bindToController: {
      stats: '=stats',
      build: '=build',
      buildName: '=buildName',
    },
    controller: ['dvStatcardHelper', buildStatsController],
    controllerAs: 'statsCtrl',
    template: require('!raw-loader!./build-stats.html').default
  };
});

function buildStatsController(dvStatcardHelper) {
  var vm = this;

  vm.exportStatCard = function() {
    var dvCardStatHash = dvStatcardHelper.convertStats(vm.build, vm.buildName, vm.stats.calculatedStats);
    var url = dvStatcardHelper.cardImportUrl + '?dngsimport=' + btoa(JSON.stringify(dvCardStatHash));
    window.open(url);
  }
}