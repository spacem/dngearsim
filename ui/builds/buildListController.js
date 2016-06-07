angular.module('dnsim').controller('BuildListCtrl', 
  [ '$window','$location','$anchorScroll','$routeParams','$timeout','saveHelper',
  function($window,$location,$anchorScroll,$routeParams,$timeout,saveHelper) {
    'use strict';
    
    var vm = this;
    document.body.className = 'saved-back';
    this.currentGroup = localStorage.getItem('currentGroup');
    this.setupBuilds = function() {
      vm.savedItems = saveHelper.getSavedItems();
      vm.buildNames = Object.keys(vm.savedItems).sort();
      vm.builds = [];
      for(var i=0;i<vm.buildNames.length;++i) {
        vm.builds.push({
          name: vm.buildNames[i],
          build: vm.savedItems[vm.buildNames[i]],
        });
      }
    }
    this.setupBuilds();
    
    if('groupName' in $routeParams) {
      if($routeParams.groupName != this.currentGroup) {
        this.currentGroup = $routeParams.groupName;
        localStorage.setItem('currentGroup', this.currentGroup);
      }
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
    
    this.handleChange = function() {
      vm.setupBuilds();
      $timeout();
      console.log('change');
    }
  
    this.toggleGroup = function(buildName) {
      localStorage.setItem('currentGroup', buildName);
      $location.url('/builds/' + buildName);
    }
    
    $timeout(function() {
      $anchorScroll('/builds/' + vm.currentGroup);
    });
  }]
);
