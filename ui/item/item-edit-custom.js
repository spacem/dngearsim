angular.module('dnsim').controller('itemEditCustomCtrl',

['hCodeValues','$scope',
function(hCodeValues,$scope) {
  'use strict';
  
  if(this.item == null) return;
  if(this.item.itemSource != 'custom' && this.item.typeName != 'custom') {
    return;
  }
  
  var vm = this;

  this.statMap = {};
  
  // console.log(vm.item.stats);
  _.forEach(vm.item.stats, function(stat) {
    // console.log('got stat', stat.id);
    vm.statMap[stat.id] = stat.max;
  });
  
  for(var statId in hCodeValues.stats) {
    $scope.$watch('editCtrl.statMap[' + statId + ']', function(newValue, oldValue) { 

      if(newValue != oldValue) {
        // console.log(statId);
        // console.log('watch got stat value', newValue);

        var anyChange = false;
        var newStats = [];
        for(var statId in vm.statMap) {

          if(!vm.statMap[statId] || !Number(vm.statMap[statId])) {
            _.each(vm.item.stats, function(stat) { 
              if(stat.id == statId) {
                anyChange = true;
              }
            });
          }
          else {
            newStats.push({
              id: Number(statId),
              max: Number(vm.statMap[statId])
            });

            var found = false;
            _.each(vm.item.stats, function(stat) {
              if(stat.id == statId) {
                found = true;
                // console.log('comparing', stat.max, vm.statMap[statId]);
                if(!(statId in vm.statMap) || stat.max != vm.statMap[statId]) {
                  anyChange = true;
                }
              } 
            });

            if(!found) {
              anyChange = true;
            }
          }
        }

        if(anyChange) {
          // console.log('GOT CHANGES!', newStats);
          vm.item.stats = newStats;
          vm.onChange();
        }
      }
    });
  }
  
}])
.directive('dngearsimItemEditCustom', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
      onChange: '&onChange',
    },
    controller: 'itemEditCustomCtrl',
    controllerAs: 'editCtrl',
    template: require('./item-edit-custom.html')
  };
});