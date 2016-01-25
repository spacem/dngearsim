angular.module('viewGroupController', ['saveService','valueServices','itemService','exportLinkServices','groupServices'])
.controller('ViewGroupCtrl', 
  ['$scope','hCodeValues','$location','$routeParams','saveHelper','dntData','$timeout','translations','dntReset','exportLinkHelper','groupHelper',
  function($scope,hCodeValues,$location,$routeParams,saveHelper,dntData,$timeout,translations,dntReset,exportLinkHelper,groupHelper) {
    
    document.body.className = 'saved-back';
    
    $scope.currentGroup = '';
    $scope.isLoading = false;
    
    $scope.init = function() {

      if('g' in $routeParams && 'i' in $routeParams && $location.path() == '/view-group') {
        var importGroupName = $routeParams.g;
          
        var items = [];
        
        var itemString = $routeParams.i;
        
        angular.forEach(itemString.split(','), function(itemStr, index) {
          var item = {};
          
          angular.forEach(itemStr.split(':'), function(itemBit, bitIndex) {
            if(itemBit.charAt(0) == 'I') {
              item.id = parseInt(itemBit.substr(1), 36);
            }
            else if(itemBit.charAt(0) == 'E') {
              item.enchantmentNum = parseInt(itemBit.substr(1), 36);
            }
            else if(itemBit.charAt(0) == 'P') {
              item.pid = parseInt(itemBit.substr(1), 36);
            }
            else if(itemBit.charAt(0) == 'S') {
              item.setId = parseInt(itemBit.substr(1), 36);
            }
            else if(itemBit.charAt(0) == '_') {
              item.itemTypeName = itemBit.substr(1);
            }
          });
          
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
      
      if(allLoaded && $scope.isLoading && translations.isLoaded()) {
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
      $location.path('/saved');
      console.log('should have changed');
    }
    
    $scope.init();
  }]
);
