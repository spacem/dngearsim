angular.module('dnsim').controller('buildItemCtrl',

['$timeout','statHelper','saveHelper',
function($timeout,statHelper,saveHelper) {
  'use strict';
  
  var vm = this;
  
}])
.directive('dngearsimBuildItem', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
      buildName: '=buildName',
      build: '=build',
      onChange: '&onChange'
    },
    controller: 'buildItemCtrl',
    controllerAs: 'ctrl',
    templateUrl: 'ui/builds/build-item.html'
  };
});