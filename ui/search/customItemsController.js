angular.module('customItemsController', ['translationService', 'dntServices', 'saveService'])
.controller('CustomItemCtrl',

['$window','saveHelper','$location',
function($window,saveHelper,$location) {
  'use strict';
  
  document.body.className = 'search-back';
  $window.document.title = 'DN Gear Sim | CUSTOM ITEMS';
  
  this.defaultItems = [
    {id: 0, typeName:'custom', name: 'wise plate fix', stats: [{id: 52, max:-0.001}]},
    {id: 0, typeName:'custom', name: 'hp unified', stats: [{id: 75, max:0.05}]},
    ];
  
  this.maxDisplay = 10;
  this.currentResults = 0;
  
  this.nameSearch = localStorage.getItem('nameSearch');
  if(this.nameSearch == null) {
    this.nameSearch = '';
  }
  
  this.customItems = saveHelper.getCustomItems();
  if(!this.customItems || this.customItems.length == 0) {
    this.customItems = this.defaultItems;
  }
  
  this.itemLinkClosed = function() {
    saveHelper.saveCustomItems(this.customItems);
    this.customItems = saveHelper.getCustomItems();
  }
  
  this.removeItem = function(item) {
    var i = this.customItems.indexOf(item);
    if(i != -1) {
    	this.customItems.splice(i, 1);
    }
    saveHelper.saveCustomItems(this.customItems);
    this.customItems = saveHelper.getCustomItems();
  }
  
  this.getResults = function() {

    localStorage.setItem('nameSearch', this.nameSearch);
    
    var newResults = [];
    var numEquip = this.customItems.length;
    var curDisplay = 0;
    for(var i=0;i<numEquip && (curDisplay<this.maxDisplay);++i) {
      var e = this.customItems[i];
      
      if(this.nameSearch != '') {
        var nameSearches = this.nameSearch.split(' ');
        if(nameSearches.length == 0) {
          nameSearches = [this.nameSearch];
        }
        var allMatch = true;
        for(var ns=0;ns<nameSearches.length;++ns) {
          if(e.name.toUpperCase().indexOf(nameSearches[ns].toUpperCase()) == -1) {
            allMatch = false;
            break;
          }
        }
        
        if(!allMatch) {
          continue;
        }
      }
      
      newResults.push(e);
      curDisplay++;
    }
    this.currentResults = Math.min(curDisplay, this.maxDisplay);
    return newResults;
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