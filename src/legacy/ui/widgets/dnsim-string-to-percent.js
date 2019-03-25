(function () {
'use strict';

angular.module('dnsim').directive('dnsimStringToPercent', dnsimStringToNumber);

function dnsimStringToNumber() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + (value/100.0);
      });
      ngModel.$formatters.push(function(value) {
        return Math.floor(parseFloat(value, 10)*100000)/1000;
      });
    }
  };
}

})();