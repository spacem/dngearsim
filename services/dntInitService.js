(function () {
'use strict';

angular.module('dnsim').factory('dntInit', ['items','jobs','dntData','initItem',dntInit]);
function dntInit(items,jobs,dntData,initItem) {
  return function(progress) {
    
    progress('starting init');
    
    var allFactories = [jobs].concat(items.all);
    
    var dntFiles = {};
    angular.forEach(items, function(item, key) {
      if(key != 'all') {
        angular.forEach(item, function(value, prop) {
          if(prop.indexOf('Dnt') == prop.length-3) {
            var newFactory = { 
              init: function(progress, complete) {
                dntData.init(value, null, progress, complete);
              },
              isLoaded: function() {
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
    
      if(index < allFactories.length) {
        allFactories[index].init(progress, function() { 
          if(allFactories[index].isLoaded()) {
            if('fileName' in allFactories[index]) {
              progress('dnt loaded: ' + allFactories[index].fileName);
            }
            else {
              
              var loadedItems = allFactories[index].getItems();
              angular.forEach(loadedItems, function(value, key) {
                initItem(value);
              });
              
              progress('initialised ' + loadedItems.length + ' items from: ' + allFactories[index].mainDnt);
            }
            initFactory(index+1);
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
})();