angular.module('dnsim').controller('CustomItemCtrl',

['$window','saveHelper','$location','hCodeValues','itemCategory','$timeout',
function($window,saveHelper,$location,hCodeValues,itemCategory,$timeout) {
  'use strict';

  var vm = this;
  
  document.body.className = 'search-back';
  $window.document.title = 'DN Gear Sim | CUSTOM ITEMS';
  
  this.customItems = hCodeValues.customItems;
  this.itemCategory = itemCategory.byName('custom');
  
  this.maxDisplay = 10;
  this.currentResults = 0;
  
  if(this.nameSearch == null) {
    this.nameSearch = '';
  }

  this.navigate = function() {
    $timeout(function() {
      if(vm.itemCategory) {
        $location.path(vm.itemCategory.path);
      }
    });
  }
  
  this.getResults = function() {
    return this.customItems;
  }
  
  this.getNewStatName = function() {
    if(this.nameSearch == '' || this.nameSearch == null) {
      return 'unnamed custom item';
    }
    else {
      return this.nameSearch;
    }
  }
  
  this.createCustomItem = function() {
    if(this.nameSearch == '' || this.nameSearch == null) {
      this.nameSearch = this.getNewStatName();
    }
    $location.path('/item/_custom:.' + this.nameSearch);
  }
}]);