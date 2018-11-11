angular.module('dnsim').controller('itemViewAttainmentCtrl',

['$timeout','dntData','translations',
  function($timeout, dntData, translations) {
  'use strict';
  
  if(this.item == null) return;
  
  var vm = this;
  vm.attainments = [];

  var files = [
    'itemgaintable.json',
    'itemgaintable_dragonjewel.json',
    'itemgaintable_enchant.json',
    'itemgaintable_etc.json',
    'itemgaintable_reboot.json',
    'itemgaintable_talisman.json'];

  for(var i=0;i<files.length;++i) {
    dntData.init(files[i], null, function() {}, function() {
      $timeout(function() {
        vm.init();
      });
    });
  }
  
  this.init = function() {
    for(var i=0;i<files.length;++i) {
      if(!dntData.isLoaded(files[i]) && !dntData.hasFailed(files[i])) {
        return;
      }
    }
    
    vm.attainments = [];
    files.forEach(function(file) {
      var attainments = dntData.find(file, 'id', vm.item.id);
      if(attainments.length) {
        attainments.forEach(function(attainment) {
          var text = attainment.ItemGainText;
          if(text) {
            var texts = text.split('{');
            texts.forEach(function(singleText) {
              var splitVal = singleText.split('}');
              if(splitVal.length) {
                if(splitVal[0].indexOf('#') == -1) {
                  vm.attainments.push(translations.translate(splitVal[0]));
                }
              }
            });
          }
        });
      }
    });
  }

}])
.directive('dngearsimItemViewAttainment', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
    },
    controller: 'itemViewAttainmentCtrl',
    controllerAs: 'ctrl',
    template: require('./item-view-attainment.html')
  };
});