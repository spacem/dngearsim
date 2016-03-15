angular.module('dnsim').controller('BuildListCtrl', 
  [ '$window','$location','$anchorScroll','$routeParams','$timeout','saveHelper',
  function($window,$location,$anchorScroll,$routeParams,$timeout,saveHelper) {
    'use strict';
    
    var vm = this;
    document.body.className = 'saved-back';
    this.savedItems = saveHelper.getSavedItems();
    this.currentGroup = localStorage.getItem('currentGroup');
    if('groupName' in $routeParams) {
      this.currentGroup = $routeParams.groupName;
    }
    else if(this.currentGroup && this.currentGroup in this.savedItems) {
      $location.path('/builds/' + this.currentGroup);
    }
    else {
      this.currentGroup = null;
    }
    
    if(this.currentGroup) {
      $window.document.title = 'DN Gear Sim | ' + this.currentGroup;
    }
    else {
      $window.document.title = 'DN Gear Sim | BUILDS';
    }

    this.anyItems = function() {
      return Object.keys(this.savedItems).length > 0;
    }

    this.createGroup = function() {
      $location.path('/new-build');
    }
    
    $timeout(function() {
      $anchorScroll('/builds/' + vm.currentGroup);
    });
  }]
);
