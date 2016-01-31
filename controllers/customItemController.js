angular.module('customItemController', ['ui.bootstrap','translationService', 'dntServices', 'saveService'])
.controller('CustomItemCtrl',

['$uibModal','$timeout','saveHelper',
function($uibModal,$timeout,saveHelper) {
  
  document.body.className = 'search-back';
  
  this.defaultItems = [
    {id: 0, typeName:'custom', name: 'wise plate fix', stats: [{id: 52, max:-0.001}]},
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