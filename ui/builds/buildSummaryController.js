angular.module('dnsim').controller('buildSummaryCtrl',

['$routeParams','$location','hCodeValues','statHelper','itemCategory',
function($routeParams,$location,hCodeValues,statHelper,itemCategory) {
  'use strict';
  
  var vm = this;
  
  this.stats = statHelper.getBuildStats(this.build);
  this.itemsByCategory = itemCategory.getItemsByCategory(this.build.items);
  
  this.toggleGroup = function() {
    localStorage.setItem('currentGroup', vm.buildName);
    $location.url('/builds/' + vm.buildName);
  }
  
  this.getSaveDate = function(group) {
    if(vm.build.lastUpdate > 0) {
      var lastUpdate = new Date(vm.build.lastUpdate);
      return lastUpdate.toLocaleDateString();
    }
  }
  
  this.getSaveTime = function(group) {
    if(vm.build.lastUpdate > 0) {
      var lastUpdate = new Date(vm.build.lastUpdate);
      return lastUpdate.toLocaleTimeString();
    }
  }
  
  this.getBuildSummary = function(group) {
    var summary = '';
    
    var typeCounts = {};
    var cashItems = 0;
    var titles = 0;
    angular.forEach(vm.itemsByCategory, function(itemsByType, type) {
      if(itemsByType.length > 0) {
        if(summary.length > 0) {
          summary += ', ';
        }
        summary += itemsByType.length + ' ' + type;
      }
    });
    
    return summary;
  }
}])
.directive('dngearsimBuildSummary', function() {
  return {
    scope: true,
    bindToController: {
      buildName: '=buildName',
      build: '=build'
    },
    controller: 'buildSummaryCtrl',
    controllerAs: 'buildCtrl',
    templateUrl: 'ui/builds/build-summary.html?bust=' + Math.random().toString(36).slice(2)
  };
});