angular.module('dnsim').filter('percentage', [function() {
  'use strict';

  function filter(input) {
    if(typeof input == 'number') {
      return (Math.round(input * 100 * 100) / 100) + '%';
    }
    else {
      return input;
    }
  }
  filter.$stateful = false;

  return filter;
}])