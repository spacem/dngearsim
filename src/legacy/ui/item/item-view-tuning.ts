angular.module('dnsim').controller('itemViewTuningCtrl',

['$timeout','dntData','itemFactory',
  function($timeout, dntData, itemFactory) {
  'use strict';
  
  if(this.item == null) return;
  
  var vm = this;
  vm.rewardItems = [];
  
  var allItemFileName = 'all-items.json';
  var changeFileName = 'itemchangetable.json';
  
  var files = [allItemFileName,changeFileName];
  for(var i=0;i<files.length;++i) {
    dntData.init(files[i], null, function() {}, function() {
      $timeout(function() {
        vm.initTransfers();
      });
    });
  }
  
  this.initTransfers = function() {
    for(var i=0;i<files.length;++i) {
      if(!dntData.isLoaded(files[i])) {
        return;
      }
    }
    vm.rewardItems = [];

    var changes = dntData.find(changeFileName, 'OriginalItemID', vm.item.id);
    if(changes && changes.length > 0) {
      for(var i=0;i<changes.length;++i) {
        var c = changes[i];
        if(c.OriginalLevel == vm.item.enchantmentNum || !c.OriginalLevel) {
          var rItem = dntData.find(allItemFileName, 'id', c.RewardItemID);

          vm.rewardItems.push({
            rewardItem: itemFactory.createBasicItem(rItem[0]),
          });
        }
      }
    }
  }

}])
.directive('dngearsimItemViewTuning', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
    },
    controller: 'itemViewTuningCtrl',
    controllerAs: 'ctrl',
    template: require('!raw-loader!./item-view-tuning.html').default
  };
});