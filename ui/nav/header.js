angular.module('dnsim').controller('HeaderCtrl', 
[
  function() {
    'use strict';
    var vm = this;
  }
]).directive('dngearsimHeader', function() {
  return {
    template: require('./header.html'),
  };
});