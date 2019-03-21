import * as angular from 'angular';

angular.module('dnsim').factory('dntInit', ['items', 'jobs', 'dntData', dntInit]);
function dntInit(items, jobs, dntData) {
  return function (progress) {

    progress('starting init');

    var allFactories = [jobs];

    var dntFiles = {};
    angular.forEach(items, function (item, key) {
      if (key != 'all') {
        angular.forEach(item, function (value, prop) {
          if (prop.indexOf('Dnt') == prop.length - 3) {
            var newFactory = {
              init: function (progress, complete) {
                dntData.init(value, null, progress, complete);
              },
              isLoaded: function () {
                return dntData.isLoaded(value);
              },
              fileName: value,
            };

            allFactories.push(newFactory);
          }
        });
      }
    });

    function initFactory(index) {

      if (index < allFactories.length) {
        allFactories[index].init(progress, function () {
          if (allFactories[index].isLoaded()) {
            if ('fileName' in allFactories[index]) {
              progress('dnt loaded: ' + allFactories[index].fileName);
            }
            initFactory(index + 1);
          }
        });
      }
      else {
        progress('Full initialise complete');
      }
    }

    initFactory(0);
  }
}
