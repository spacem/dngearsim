angular.module('dnsim').controller('ViewGroupCtrl', 
  ['$scope','$window','hCodeValues','$location','$routeParams','saveHelper','dntData','$timeout','translations','dntReset','exportLinkHelper','groupHelper','jobs',
  function($scope,$window,hCodeValues,$location,$routeParams,saveHelper,dntData,$timeout,translations,dntReset,exportLinkHelper,groupHelper,jobs) {
    'use strict';
    
    document.body.className = 'saved-back';
    $window.document.title = 'DN Gear Sim';
    
    $scope.currentGroup = '';
    $scope.isLoading = false;
    
    $scope.init = function() {

      if('g' in $routeParams && 'i' in $routeParams && $location.path() == '/view-group') {
        var importGroupName = $routeParams.g;
          
        var items = [];
        
        var itemString = $routeParams.i;
        
        angular.forEach(itemString.split(','), function(itemStr, index) {
          var item = exportLinkHelper.decodeItem(itemStr);
          
          if(item.id > 0) {
            items.push(item);
          }
        });

        $scope.savedItems = {};
        $scope.savedItems[importGroupName] = {};
        $scope.savedItems[importGroupName].items = items;
        $scope.currentGroup = importGroupName;
        $scope.doInitItems(importGroupName);
      }
      
      $scope.anyItems = Object.keys($scope.savedItems).length > 0;
    }
    
    $scope.setShortUrls = function() {
      angular.forEach($scope.savedItems, function(group, groupName) {
        var longUrl = exportLinkHelper.createGroupLink(groupName, group);
        group.shortUrl = sessionStorage.getItem(longUrl);
      });
    }
    
    $scope.doInitItems = function(group) {
      $scope.isLoading = true;
      
      angular.forEach(groupHelper.getDntFiles($scope.savedItems[group]), function(columns, fileName) {
        dntData.init(fileName, columns, progress, function() { tryInit(group, $scope.savedItems[group]) });
      });
      
      translations.init(progress,function() { tryInit(group, $scope.savedItems[group]) });
      jobs.init(progress,function() { tryInit(group, $scope.savedItems[group]) });
    }
    
    $scope.createShortUrl = function(groupName) {
      exportLinkHelper.createShortUrl(groupName, $scope.savedItems[groupName]);
    }
    
    function tryInit(groupName, group) {
      var allLoaded = true;
      angular.forEach(groupHelper.getDntFiles(group), function(columns, fileName) {
        if(!dntData.isLoaded(fileName)) {
          allLoaded = false;
          return;
        }
      });
      
      if(allLoaded && $scope.isLoading && translations.isLoaded() && jobs.isLoaded()) {
        var newItems = groupHelper.reloadGroup(groupName, group);
        dntReset();
        
        $timeout(function() {
          $scope.savedItems = {};
          $scope.savedItems[groupName] = {items: newItems, lastUpdate: group.lastUpdate };
          $scope.setShortUrls();
          $scope.isLoading = false;
        });
      }
    }
    
    function progress() {
    }
    
    $scope.copyGroup = function(group) {
      saveHelper.importGroup(group, $scope.savedItems[group].items);
      $location.path('/builds');
      // console.log('should have changed');
    }
    
    $scope.init();
  }]
);
