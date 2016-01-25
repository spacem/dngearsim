angular.module('customItemController', ['ui.bootstrap','translationService', 'dntServices', 'saveService'])
.controller('CustomItemCtrl',

['$uibModal','$timeout','saveHelper',
function($uibModal,$timeout,saveHelper) {
  
  document.body.className = 'search-back';
  
  this.defaultItems = [
    {id: 0, typeName:'custom', name: 'Unified HP Boost', stats: [{id: 75, max:0.05}]},
    {id: 0, typeName:'custom', name: 'Lv4 Health Bolster', stats: [{id: 75, max:0.24}]},
    {id: 0, typeName:'custom', name: 'Wand Mastery', stats: [{id: 3000, max:0.18}]},
    {id: 0, typeName:'custom', name: 'Blessing of Strikes', stats: [{id: 3000, max:0.27}]},
    {id: 0, typeName:'custom', name: 'Blessing of Light', stats: [{id: 18, max:0.2}]},
    {id: 0, typeName:'custom', name: 'Fury of the Owl', stats: [{id: 1012, max:0.2}]},
    {id: 0, typeName:'custom', name: 'Crossbow Mastery', stats: [{id: 3000, max:0.117}]},
    {id: 0, typeName:'custom', name: 'Spiritual Focus', stats: [{id: 51, max:0.27}, {id: 52, max:0.27}]},
    {id: 0, typeName:'custom', name: 'Warden Class Mastery', stats: [{id: 3000, max:0.1}]},
    {id: 0, typeName:'custom', name: 'Saint Class Mastery II', stats: [{id: 3000, max:0.05}]},
    {id: 0, typeName:'custom', name: 'Ward of spirits', stats: [{id: 3000, max:0.32}]},
    {id: 0, typeName:'custom', name: 'LGrade L/F/I Spark', stats: [
      {id: 54, max:0.0431},
      {id: 55, max:0.0431},
      {id: 56, max:0.0431},
      {id: 57, max:0.0431},
      
      {id: 50, max:0.0225},
      {id: 51, max:0.0225},
      {id: 52, max:0.035},
      
      {id: 16, max:0.08},
      {id: 17, max:0.08},
      {id: 18, max:0.08}
      ]},
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
  
  this.saveItem = function(item) {
    console.log('opening item for save ' + item.name);
    var modalInstance = $uibModal.open({
      animation: false,
      backdrop : false,
      keyboard : true,
      templateUrl: 'partials/use-options.html?bust=' + Math.random().toString(36).slice(2),
      controller: 'UseOptionsCtrl',
      size: 'lg',
      resolve: {
        item: function () {
          return item;
        },
        group: function () {

          var group = localStorage.getItem('lastSavedGroup');
          if(group != null) {
            return group;
          }
          return 'unnamed group';
        }
      }
    });
  };
  
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
    
    this.customItems.push({id: 0, typeName:'custom', name: this.nameSearch, stats: []});
  }
}]);