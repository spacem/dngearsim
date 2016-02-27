angular.module('itemEditTalismanController', ['translationService', 'dntServices'])
.controller('itemEditTalismanCtrl',

['$scope','$timeout','dntData','hCodeValues','items','jobs','statHelper','exportLinkHelper','$routeParams','translations','$location','saveHelper',
function($scope,$timeout,dntData,hCodeValues,items,jobs,statHelper,exportLinkHelper,$routeParams,translations,$location,saveHelper) {
  'use strict';
  
  if(this.item.itemSource != 'tman') {
    return;
  }
  
  this.setTalisman = function(amount) {
    if(amount == 0) {
      this.item.enchantmentNum = null;
      this.item.enchantmentStats = [];
    }
    else {
      this.item.enchantmentNum = amount;
      
      var extraStats = [];
      angular.forEach($scope.item.stats, function(stat, index) {
        extraStats.push({id: stat.id, max: stat.max * (amount/100)});
      });
      
      this.item.enchantmentStats = extraStats;
    }
    this.onChange();
  }

}])
.directive('dngearsimItemEditTalisman', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
      onChange: '&onChange',
    },
    controller: 'itemEditTalismanCtrl',
    controllerAs: 'editCtrl',
    templateUrl: 'ui/item/item-edit-talisman.html?bust=' + Math.random().toString(36).slice(2)
  };
});