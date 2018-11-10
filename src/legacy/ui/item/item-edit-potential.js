angular.module('dnsim').controller('itemEditPotentialCtrl',

['dntData','items','hCodeValues','itemColumnsToLoad',
function(dntData,items,hCodeValues,itemColumnsToLoad) {
  'use strict';
  
  var vm = this;
  
  this.potentials = null;
  this.potential = null;
  this.changingPotentials = false;
  this.potentialStats = {};
  
  if(this.item == null) return;
  
  if('itemSource' in this.item) {
    this.itemType = items[this.item.itemSource];
  }
  
  if(!this.itemType || !this.item.pid || !('potentialDnt' in this.itemType)) {
    return;
  }
  
  if(vm.itemType.potentialDnt) {
    dntData.init(vm.itemType.potentialDnt, itemColumnsToLoad.potentialDnt, null, vm.getPotentials);
  }
  
  this.getPotentials = function() {
    if(!vm.potentials) {
      if(vm.item && vm.item.pid && 'potentialDnt' in vm.itemType) {
        var potentials = dntData.find(vm.itemType.potentialDnt, 'id', vm.item.pid);
        
        if(potentials.length == 1) {
          vm.potential = potentials[0];
          vm.potentials = dntData.find(vm.itemType.potentialDnt, 'PotentialID', vm.potential.PotentialID);
          vm.potentialStats = getPotentialStats(vm.potentials);
        }
        else if('potentialDntEx' in vm.itemType) {
          potentials = dntData.find(vm.itemType.potentialDntEx, 'id', vm.item.pid);
        
          if(potentials.length == 1) {
            vm.potential = potentials[0];
            vm.potentials = dntData.find(vm.itemType.potentialDntEx, 'PotentialID', vm.potential.PotentialID);
            vm.potentialStats = getPotentialStats(vm.potentials);
          }
        }
      }
    }
    
    return vm.potentials;
  }
  
  this.nextPotential = function() {
    for(var i=0;i<vm.potentials.length;++i) {
      if(vm.potential.id == vm.potentials[i].id) {
        vm.potential = vm.potentials[i+1];
        vm.item.pid = vm.potential.id;
        vm.onChange();
        this.changingPotentials = true;
        return;
      }
    }
  }
  
  this.prevPotential = function() {
    for(var i=0;i<vm.potentials.length;++i) {
      if(vm.potential.id == vm.potentials[i].id) {
        vm.potential = vm.potentials[i-1];
        vm.item.pid = vm.potential.id;
        vm.onChange();
        this.changingPotentials = true;
        return;
      }
    }
  }
    
  this.changePotential = function(pid) {
    for(var i=0;i<vm.potentials.length;++i) {
      if(pid == vm.potentials[i].id) {
        vm.potential = vm.potentials[i];
        vm.item.pid = vm.potential.id;
        vm.changingPotentials = false;
        vm.onChange();
        return;
      }
    }
  }
  
  this.isFirstPotential = function() {
    this.getPotentials();
    return !vm.potentials || vm.potentials.length <= 1 || !vm.potential || vm.potential.id == vm.potentials[0].id;
  }
  
  this.isLastPotential = function() {
    this.getPotentials();
    return !vm.potentials || vm.potentials.length <= 1 || !vm.potential || vm.potential.id == vm.potentials[vm.potentials.length-1].id;
  }
  
  function getPotentialStats() {
    var pStats = {};
    var emptyStatId = null;
    
    if(vm.potentials != null) {
      angular.forEach(vm.potentials, function(p, index) {
        var stats = [];
        angular.forEach(hCodeValues.getStats(p), function(stat, sIndex) {
          if(!hCodeValues.stats[stat.id].hide) {
            stats.push(stat);
          }
        });
        
        if(stats.length > 0) {
          pStats[p.id] = stats;
        }
        else if(!emptyStatId) {
          pStats[p.id] = [];
          emptyStatId = p.id;
        }
      });
    }
    
    return pStats;
  }
  
  function reportProgress(msg) {
    // console.log('progress: ' + msg);
  }

}])
.directive('dngearsimItemEditPotential', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
      onChange: '&onChange',
    },
    controller: 'itemEditPotentialCtrl',
    controllerAs: 'editCtrl',
    templateUrl: 'ui/item/item-edit-potential.html'
  };
});