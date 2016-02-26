angular.module('savedItemsController', ['saveService','valueServices','itemService','exportLinkServices','groupServices'])
.controller('SavedCtrl', 
  ['$scope','$window','$routeParams','$location','$uibModal','hCodeValues','saveHelper','dntData','$timeout','translations','dntReset','exportLinkHelper','statHelper','groupHelper',
  function($scope,$window,$routeParams,$location,$uibModal,hCodeValues,saveHelper,dntData,$timeout,translations,dntReset,exportLinkHelper,statHelper,groupHelper) {
    'use strict';
    
    document.body.className = 'saved-back';
  
    $scope.combinedStats = {};
    $scope.setStats = {};
    $scope.calculatedStats = {};
    $scope.nakedStats = {};
    $scope.hiddenTypes = saveHelper.getHiddenTypes($scope.hiddenTypes);
    $scope.currentGroup = localStorage.getItem('currentGroup');
    
    $scope.isLoading = false;
    $scope.savedItems = null;
    $scope.savedItemsByType = null;
    
    if('groupName' in $routeParams) {
      $scope.currentGroup = $routeParams.groupName;
    }
    
    if($scope.currentGroup) {
      $window.document.title = 'DN Gear Sim | ' + $scope.currentGroup;
    }
    else {
      $window.document.title = 'DN Gear Sim | BUILDS';
    }
    
    $scope.setCurrentGroup = function(groupName) {
      localStorage.setItem('currentGroup', groupName);
      $scope.currentGroup = '';
      var delay = 200;
      if(groupName == '') {
        delay = 0;
      }
      if(groupName in $scope.savedItems || groupName == '') {
        $timeout(function() {
          $scope.currentGroup = groupName;
          $location.url('/saved/' + groupName);
        }, 200);
      }
    }
    
    $scope.changeTypeVisiblity = function(type) {
      $scope.hiddenTypes[type] = !$scope.hiddenTypes[type];
      saveHelper.saveHiddenTypes($scope.hiddenTypes);
    }
    
    $scope.isTypeHidden = function(type) {
      return $scope.hiddenTypes[type];
    }
    
    $scope.getSaveDate = function(group) {
      if($scope.savedItems[group].lastUpdate > 0) {
        var lastUpdate = new Date($scope.savedItems[group].lastUpdate);
        return lastUpdate.toLocaleDateString();
      }
    }
    
    $scope.getSaveTime = function(group) {
      if($scope.savedItems[group].lastUpdate > 0) {
        var lastUpdate = new Date($scope.savedItems[group].lastUpdate);
        return lastUpdate.toLocaleTimeString();
      }
    }
    
    $scope.getGroupSummary = function(group) {
      
      var groupItems = $scope.savedItemsByType[group];
      var summary = '';
      
      var typeCounts = {};
      var cashItems = 0;
      var titles = 0;
      angular.forEach($scope.savedItemsByType[group], function(itemsByType, type) {
        if(itemsByType.length > 0) {
          if(summary.length > 0) {
            summary += ', ';
          }
          summary += itemsByType.length + ' ' + type;
        }
      });
      
      return summary;
    }
    
    $scope.init = function() {

      $scope.savedItems = saveHelper.getSavedItems();
      $scope.savedItemsByType = saveHelper.getSavedItemsByType($scope.savedItems, $scope.groupName);
      
      if(!$scope.isLoading) {
        if($scope.currentGroup in $scope.savedItemsByType) {
          if($scope.savedItemsByType[$scope.currentGroup].typeError) {
            $scope.reloadGroup($scope.currentGroup);
          }
        }
      }
      
      $scope.setShortUrls();
      $scope.setupStats();
      
      $scope.anyItems = Object.keys($scope.savedItems).length > 0;
    }
    
    $scope.setShortUrls = function() {
      angular.forEach($scope.savedItems, function(group, groupName) {

        var longUrl = exportLinkHelper.createGroupLink(groupName, group);
        group.shortUrl = sessionStorage.getItem(longUrl);
      });
    }
    
    $scope.setupStats = function() {
      angular.forEach($scope.savedItems, function(group, groupName) {
        
        $scope.nakedStats[groupName] = statHelper.getNakedStats(group);
        $scope.combinedStats[groupName] = statHelper.getCombinedStats(group.items);
        $scope.setStats[groupName] = statHelper.getSetStats(group.items);
        var allStats = hCodeValues.mergeStats($scope.nakedStats[groupName], $scope.combinedStats[groupName]);
        allStats = hCodeValues.mergeStats(allStats, $scope.setStats[groupName]);
        if(group.heroStats != null && group.heroStats.length > 0) {
          allStats = hCodeValues.mergeStats(allStats, group.heroStats);
        }
        
        $scope.calculatedStats[groupName] = statHelper.getCalculatedStats(group, allStats);
      });
    }
    
    $scope.copyGroup = function(group) {
      saveHelper.importGroup(group, $scope.savedItems[group].items);
      $scope.init();
    }
    
    $scope.reloadGroup = function(groupName) {
      $scope.isLoading = true;
      var group = $scope.savedItems[groupName];

      var files = groupHelper.getDntFiles(group);
      angular.forEach(files, function(columns, fileName) {
        dntData.init(fileName, columns, progress, function() { tryInit(groupName, group) });
      });
      
      translations.init(progress,function() { tryInit(groupName, group) });
    }
    
    $scope.createShortUrl = function(groupName) {
      exportLinkHelper.createShortUrl(groupName, $scope.savedItems[groupName]);
    }
    
    function tryInit(groupName, group) {
      $timeout(function() {
        var allLoaded = true;
        var files = groupHelper.getDntFiles(group);
        angular.forEach(files, function(columns, fileName) {
          if(!dntData.isLoaded(fileName)) {
            allLoaded = false;
            return;
          }
        });
        
        if(allLoaded && $scope.isLoading && translations.isLoaded()) {
          var newItems = groupHelper.reloadGroup(groupName, group);
          saveHelper.updatedSavedItems(groupName, newItems);
          dntReset();
          
          $timeout(function() {
            $scope.init();
            $scope.isLoading = false;
          });
        }
      });
    }
    
    function progress() {
    }
    
    $scope.addItem = function(groupName, item) {
      if($scope.modalOpened) {
        return;
      }

      $scope.modalOpened = true;
      // console.log('opening item for save ' + item.name);
      var modalInstance = $uibModal.open({
        animation: false,
        backdrop : false,
        keyboard : true,
        templateUrl: 'ui/grouping/use-options.html?bust=' + Math.random().toString(36).slice(2),
        controller: 'UseOptionsCtrl',
        size: 'lg',
        resolve: {
          item: function () {
            return item;
          },
          group: function () {
            return groupName;
          }
        }
      });

      modalInstance.result.then(
        function (group, newGroupName, groupSummary) {
          // console.log('new group name: ' + newGroupName)
            $timeout(function() {
              $scope.init();
            });
            $scope.modalOpened = false;
        },
        function () {
          $scope.modalOpened = false;
        }
      );
    }
    
    $scope.editGroup = function(group, groupName) {
      if($scope.modalOpened) {
        return;
      }

      $scope.modalOpened = true;
      var modalInstance = $uibModal.open({
        animation: false,
        backdrop : false,
        keyboard : true,
        templateUrl: 'ui/grouping/edit-group.html?bust=' + Math.random().toString(36).slice(2),
        controller: 'EditGroupCtrl as editGroup',
        size: 'lg',
        resolve: {
          group: function () {
            return group;
          },
          groupName: function () {
            return groupName;
          },
          groupSummary: function () {
            return $scope.getGroupSummary(groupName);
          }
        }
      });

      modalInstance.result.then(function (group, newGroupName, groupSummary) {
        $scope.init();
        $timeout(function() {
          
          var lastGroupName = '';
          angular.forEach($scope.savedItems, function(value, key) {
            lastGroupName = key;
          });
          $scope.setCurrentGroup(lastGroupName);
        });
        $scope.modalOpened = false;
      }, function () {
        // console.log('cancel?')
        $timeout(function() {
          $scope.init();
        });
          $scope.modalOpened = false;
      });
    }
    
    $scope.removeItem = function(group, item) {
      item.removeItem = true;
      var newItemList = [];
      angular.forEach($scope.savedItems[group].items, function(gItem, index) {
        if(!gItem.removeItem) {
          newItemList.push(gItem);
        }
      });
      
      saveHelper.updatedSavedItems(group, newItemList);
      
      $scope.init();
    }

    $scope.closeItemLink = function (group) {
      // console.log('closed link for ' + group)
      saveHelper.updatedSavedItems(group, $scope.savedItems[group].items);
      $timeout(function() {
          $scope.init();
        });
    }
    
    $scope.createGroup = function() {
      var groupName = saveHelper.importGroup('Character Name', []);
      $scope.editGroup({}, groupName);
    }
    
    $scope.init();
  }]
);
