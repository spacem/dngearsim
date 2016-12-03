angular.module('dnsim').controller('itemEditSparkCtrl',

['dntData','hCodeValues','items','itemColumnsToLoad',
function(dntData,hCodeValues,items,itemColumnsToLoad) {
  'use strict';
  
  var vm = this;
  
  if(this.item == null) return;
  if('itemSource' in this.item) {
    this.itemType = items[this.item.itemSource];
  }
  
  if(!vm.itemType || !vm.itemType.sparkDnt) {
    return
  }
  
  if(vm.itemType.sparkDnt) {
    dntData.init(vm.itemType.sparkDnt, itemColumnsToLoad.sparkDnt, null, vm.getSparks);
  }
  
  this.sparks = null;

  this.nextSpark = function() {
    var index = getPotentialIndex();
    index++;
    if(index >= vm.sparks.length) {
      index = 0;
    }
    var spark = vm.sparks[index]; 
    vm.item.sparkId = spark.id;
    vm.item.sparkStats = hCodeValues.getStats(spark);
    vm.onChange();
  }
  
  this.isMoreSparks = function() {
    return vm.sparks != null && getPotentialIndex() >= vm.sparks.length-1;
  }
  
  this.isFirstSpark = function() {
    return getPotentialIndex() == 0;
  }
  
  this.prevSpark = function() {
    var index = getPotentialIndex();
    index--;
    if(index < 0) {
      index = vm.sparks.length-1;
    }
    var spark = vm.sparks[index]; 
    vm.item.sparkId = spark.id;
    vm.item.sparkStats = hCodeValues.getStats(spark);
    vm.onChange();
  }
  
  this.removeSpark = function() {
    vm.item.sparkId = null;
    vm.item.sparkStats = null;
    vm.onChange();
  }
  
  this.getSparks = function() {
    if(vm.item == null || vm.itemType == null) return null;
    if(vm.sparks == null) {
      var sid = vm.item.sparkTypeId;
      if(sid) {
        if(dntData.isLoaded(vm.itemType.sparkDnt)) {
          vm.sparks = dntData.find(vm.itemType.sparkDnt, 'PotentialID', sid);
        }
      }
    }
    
    return vm.sparks;
  }

  function getPotentialIndex() {
    var potentialIndex = -1;
    if(vm.item.sparkId > 0) {
      angular.forEach(vm.sparks, function(spark, index) {
        if(spark.id == vm.item.sparkId) {
          potentialIndex = index;
          return;
        }
      });
    }
      
    return potentialIndex;
  }

  function reportProgress(msg) {
    // console.log('progress: ' + msg);
  }
}])
.directive('dngearsimItemEditSpark', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
      onChange: '&onChange',
    },
    controller: 'itemEditSparkCtrl',
    controllerAs: 'editCtrl',
    templateUrl: 'ui/item/item-edit-spark.html'
  };
});