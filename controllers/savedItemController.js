angular.module('savedItemController', ['saveService','valueServices','itemService','exportLinkServices','groupServices'])
.controller('SavedCtrl', 
  ['$scope','$routeParams','$location','$uibModal','hCodeValues','saveHelper','dntData','$timeout','translations','dntReset','exportLinkHelper','statHelper','groupHelper',
  function($scope,$routeParams,$location,$uibModal,hCodeValues,saveHelper,dntData,$timeout,translations,dntReset,exportLinkHelper,statHelper,groupHelper) {
    
    document.body.className = 'saved-back';
  
    $scope.combinedStats = {};
    $scope.setStats = {};
    $scope.calculatedStats = {};
    $scope.nakedStats = {};
    $scope.hiddenTypes = saveHelper.getHiddenTypes($scope.hiddenTypes);
    $scope.currentGroup = '';
    $scope.isLoading = false;
    $scope.savedItems = null;
    $scope.savedItemsByType = null;
    
    if('groupName' in $routeParams) {
      $scope.currentGroup = $routeParams.groupName;
    }
    
    $scope.setCurrentGroup = function(group) {
      $scope.currentGroup = '';
      var delay = 200;
      if(group == '') {
        delay = 0;
      }
      if(group in $scope.savedItems || group == '') {
        $timeout(function() {
          $scope.currentGroup = group;
          $location.url('/saved/' + group);
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
    
    $scope.getSummaryStats = function(group) {
      var summary = '';
        
      angular.forEach($scope.calculatedStats[group], function(stat, index) {
        var def = hCodeValues.stats[stat.id];
        if(def.summaryDisplay) {
          if(summary.length > 0) {
            summary += ' | '
          }
          summary += def.name + ': ' + def.display(stat);
        }
      });
      
      return summary;
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
        $scope.combinedStats[groupName] = statHelper.getCombinedStats(group);
        $scope.setStats[groupName] = statHelper.getSetStats(group);
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
    
    $scope.reloadGroup = function(group) {
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
        saveHelper.updatedSavedItems(groupName, newItems);
        dntReset();
        
        $timeout(function() {
          $scope.init();
          $scope.isLoading = false;
        });
      }
    }
    
    function progress() {
    }
    
    $scope.addItem = function(groupName, item) {
      if($scope.modalOpened) {
        return;
      }

      $scope.modalOpened = true;
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
            return groupName;
          }
        }
      });

      modalInstance.result.then(
        function (group, newGroupName, groupSummary) {
          console.log('new group name: ' + newGroupName)
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
        templateUrl: 'partials/edit-group.html?bust=' + Math.random().toString(36).slice(2),
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
        console.log('new group name: ' + newGroupName)
        if(newGroupName != groupName) {
          $timeout(function() {
            $scope.init();
          });
          $scope.modalOpened = false;
        }
      }, function () {
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
      console.log('closed link for ' + group)
      saveHelper.updatedSavedItems(group, $scope.savedItems[group].items);
      $timeout(function() {
          $scope.init();
        });
    }
    
    $scope.init();
  }]
);
