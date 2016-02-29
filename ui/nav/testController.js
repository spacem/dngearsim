angular.module('dnsim').controller('TestCtrl', 
  [
  function() {
    'use strict';
    var jasmineEnv = jasmine.getEnv();
    
    // Tell it to add an Html Reporter
    // this will add detailed HTML-formatted results
    // for each spec ran.
    jasmineEnv.addReporter(new jasmine.HtmlReporter());
    
    // Execute the tests!
    jasmineEnv.execute();
  }]
);
