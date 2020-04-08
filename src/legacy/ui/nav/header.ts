angular.module('dnsim').controller('HeaderCtrl', 
[
  function() {
    'use strict';

    var noticeId = 'notice1';
    var vm = this;

    vm.doClose = function() {
      localStorage.setItem(noticeId, true.toString());
      vm.isClosed = true;
    }
    
    vm.isClosed = true; // localStorage.getItem(noticeId) != null;
  }
]).directive('dngearsimHeader', function() {
  return {
    template: require('!raw-loader!./header.html').default,
    controller: 'HeaderCtrl',
    controllerAs: 'ctrl',
  };
});