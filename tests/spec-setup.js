// this file saves every test suite to declare certain things

function dnsimTestSetup() {
  
  beforeEach(function() {
    module('dnsim');
    
    jasmine.addMatchers({
      
      equalsStat: function( util, customEqualityTesters) {
        return {
          compare: function(actual, expected) {
            return {
              pass: actual !== null && expected !== null &&
              expected.id === actual.id && expected.max === actual.max,
              message: 'expected: ' + JSON.stringify(expected) + ' got: ' + JSON.stringify(actual)
            };
          }
    
        }
      }
    });
  });
}