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
      if($routeParams.buildName != this.currentGroup) {
        this.currentGroup = $routeParams.buildName;
        saveHelper.saveBuildSelection(this.currentGroup, this.savedItems);
      }
    }
    else if(this.currentGroup && this.currentGroup in this.savedItems) {
      $location.path('/build/' + this.currentGroup);
    }
    else {
      this.currentGroup = null;
    }
    
    if(this.currentGroup) {
      $window.document.title = 'dngearsim | ' + this.currentGroup;
      $(document).ready(function($) { 
          $('meta[name=description]').attr('content', this.currentGroup);
      });
    }
    else {
      $window.document.title = 'dngearsim | BUILDS';
      $(document).ready(function($) { 
          $('meta[name=description]').attr('content', 'Build your character to see how you can make it stronger');
      });
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
      $location.url('/build/' + buildName);
    }
    
    this.publish = function() {
      $location.url('/publish');
    }
    
    this.search = function() {
      $location.url('/build-search');
    }
  }]
);
