angular.module('dnsim').controller('buildExportActionCtrl',

['$timeout','$location','hCodeValues','statHelper','itemCategory','saveHelper','exportLinkHelper','groupHelper','translations','dntData','dntReset',
function($timeout,$location,hCodeValues,statHelper,itemCategory,saveHelper,exportLinkHelper,groupHelper,translations,dntData,dntReset) {
  'use strict';
  
  var vm = this;
  
  vm.export = exportBuild;
  
  function exportBuild() {
    var blob = new Blob([JSON.stringify(vm.build, null, 1)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, 'dngearsim-' + vm.buildName + '.json');
  }
}])
.directive('dngearsimBuildExportAction', function() {
  return {
    scope: true,
    bindToController: {
      buildName: '=buildName',
      build: '=build'
    },
    controller: 'buildExportActionCtrl',
    controllerAs: 'ctrl',
    template: require('./build-export-action.html')
  };
});