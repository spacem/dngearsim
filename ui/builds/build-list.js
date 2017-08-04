angular.module('dnsim').controller('BuildListCtrl', 
  [ '$window','$location','$routeParams','$timeout','saveHelper',
  function($window,$location,$routeParams,$timeout,saveHelper) {
    'use strict';
    
    var vm = this;
    document.body.className = 'saved-back';
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
    
    if('buildName' in $routeParams) {
      if($routeParams.buildName in vm.savedItems) {
        if($routeParams.buildName != this.currentGroup) {
          this.currentGroup = $routeParams.buildName;
          saveHelper.saveBuildSelection(this.currentGroup, this.savedItems);
        }
      }
      else {
        this.currentGroup = null;
      }
    }
    else if(this.currentGroup && this.currentGroup in this.savedItems) {
      $location.path('/build');
      $location.search('buildName', this.currentGroup);
    }
    else {
      this.currentGroup = null;
    }
    
    if(this.currentGroup) {
      $window.document.title = 'dngearsim | ' + this.currentGroup;
    }
    else {
      $window.document.title = 'dngearsim | BUILDS';
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
      // console.log('change');
    }
  
    this.toggleGroup = function(buildName) {
      saveHelper.saveBuildSelection(buildName, this.savedItems);
      $location.url('/build?buildName=' + buildName);
    }
    
    this.publish = function() {
      $location.url('/publish');
    }
    
    this.search = function() {
      $location.url('/build-search');
    }
  }]
);
