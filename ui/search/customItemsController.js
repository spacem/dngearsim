angular.module('dnsim').controller('CustomItemCtrl',

['$window','saveHelper','$location','hCodeValues',
function($window,saveHelper,$location,hCodeValues) {
  'use strict';
  
  document.body.className = 'search-back';
  $window.document.title = 'DN Gear Sim | CUSTOM ITEMS';
  
  this.customItems = hCodeValues.customItems;
  
  this.maxDisplay = 10;
  this.currentResults = 0;
  
  if(this.nameSearch == null) {
    this.nameSearch = '';
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