angular.module('dnsim').controller('itemEditCustomCtrl',

['hCodeValues',
function(hCodeValues) {
  'use strict';
  
  if(this.item == null) return;
  if(this.item.itemSource != 'custom') {
    return;
  }
  
  var vm = this;
  
  this.stat = {id:-1, name:''};
  this.newStatVal = 0;

  this.dropdownStats = [];
  for(var id in hCodeValues.stats) {
    if(!hCodeValues.stats[id].noCustom) {
      this.dropdownStats.push(hCodeValues.stats[id]);
    }
  }
  this.dropdownStats.sort()

  this.getStats = function() {
    return this.dropdownStats;
  }
  
  this.newStat = function() {
    return {id:this.stat.id,max:this.newStatVal};
  }
  
  this.addStat = function() {
    if(this.stat.id > -1) {
      if(!this.item.stats) {
        this.item.stats = [];
      }
       
      this.item.stats.push(this.newStat());
      this.onChange();
    }
  }
  
  this.removeStat = function(stat) {
    var i = this.item.stats.indexOf(stat);
    if(i != -1) {
    	this.item.stats.splice(i, 1);
      this.onChange();
    }
  }
  
  this.getNewStatName = function() {
    return this.getStatName(this.newStat());
  }
  
  this.getNewStatDisplayValue = function() {
    return this.getStatDisplayValue(this.newStat());
  }
  
  this.getStatName = function(stat) {
    if(stat.id in hCodeValues.stats) {
      return hCodeValues.stats[stat.id].name;
    }
  }
  
  this.getStatDisplayValue = function(stat) {
    if(stat.id in hCodeValues.stats) {
      return hCodeValues.stats[stat.id].display(stat);
    }
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
    templateUrl: 'ui/item/item-edit-custom.html'
  };
});