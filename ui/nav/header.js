angular.module('dnsim').controller('HeaderCtrl', 
[
  function() {
    'use strict';

    var noticeId = 'notice1';
    var vm = this;

    vm.doClose = function() {
      localStorage.setItem(noticeId, true)
      vm.isClosed = true;
    }
    
    vm.isClosed = true; // localStorage.getItem(noticeId) != null;
  }
]).directive('dngearsimHeader', function() {
  return {
    templateUrl: 'ui/nav/header.html',
    controller: 'HeaderCtrl',
    controllerAs: 'ctrl',
  };
});