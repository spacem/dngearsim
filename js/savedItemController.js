angular.module('savedItemController', ['saveService','valueServices','itemService','exportLinkServices'])
.controller('SavedCtrl', 
  ['$scope','$routeParams','$location','$uibModal','hCodeValues','saveHelper','items','itemColumnsToLoad','dntData','createItem','initItem','$timeout','translations','dntReset','exportLinkHelper','statHelper',
  function($scope,$routeParams,$location,$uibModal,hCodeValues,saveHelper,items,itemColumnsToLoad,dntData,createItem,initItem,$timeout,translations,dntReset,exportLinkHelper,statHelper) {
    $scope.combinedStats = {};
    $scope.calculatedStats = {};
    $scope.nakedStats = {};
    
    if('groupName' in $routeParams) {
      $scope.currentGroup = $routeParams.groupName;
    }
    else {
      $scope.currentGroup = '';
    }
    $scope.isLoading = false;
    
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
    
    $scope.getGroupSummary = function(group) {
      var summary = '';
      if(group == $scope.currentGroup) {
        if($scope.savedItems[group].lastUpdate > 0) {
          var lastUpdate = new Date($scope.savedItems[group].lastUpdate);
          summary += lastUpdate.toLocaleDateString();
        }
      }
      else {
        if($scope.savedItems[group].lastUpdate > 0) {
          var lastUpdate = new Date($scope.savedItems[group].lastUpdate);
          summary += lastUpdate.toLocaleDateString() + ' ' + lastUpdate.toLocaleTimeString();
        }
        
        var typeCounts = {};
        var cashItems = 0;
        var titles = 0;
        angular.forEach($scope.savedItems[group].items, function(value, key) {
          if(value.itemTypeName in items && items[value.itemTypeName].type == 'cash') {
            cashItems++;
          }
          else if(value.itemTypeName in items && items[value.itemTypeName].type == 'titles') {
            titles++;
          }
          else if(value.typeId in typeCounts) {
            typeCounts[value.typeId]++;
          }
          else {
            typeCounts[value.typeId] = 1;
          }
        });
        
        summary += ' | contains ';
        if($scope.savedItems[group].items.length == 0) {
          summary += 'no items'
        }
        else {
          var first = true;
          angular.forEach(typeCounts, function(value, key) {
            if(!first) {
              summary += ', ';
            }
            first = false;
            summary += value + ' ' + hCodeValues.typeNames[key];
          });
          
          if(cashItems > 0) {
            if(!first) {
              summary += ', ';
            }
            first = false;
            summary += cashItems + ' cash';
          }
          
          if(titles > 0) {
            if(!first) {
              summary += ', ';
            }
            first = false;
            summary += titles + ' title';
          }
        }
      }
      
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
        var allStats = hCodeValues.mergeStats($scope.nakedStats[groupName], $scope.combinedStats[groupName]);
        $scope.calculatedStats[groupName] = statHelper.getCalculatedStats(group, allStats);
      });
    }
    
    $scope.copyGroup = function(group) {
      saveHelper.importGroup(group, $scope.savedItems[group].items);
      $scope.init();
    }
    
    $scope.reloadGroup = function(group) {
      $scope.isLoading = true;
      
      angular.forEach(getDntFiles($scope.savedItems[group]), function(columns, fileName) {
        dntData.init(fileName, columns, progress, function() { tryInit(group, $scope.savedItems[group]) });
      });
      
      translations.init(progress,function() { tryInit(group, $scope.savedItems[group]) });
    }
    
    $scope.createShortUrl = function(groupName) {
      exportLinkHelper.createShortUrl(groupName, $scope.savedItems[groupName]);
    }
    
    function getDntFiles(group) {

      var dntFiles = {};
      angular.forEach(group.items, function(item, key) {
        if(item.itemTypeName in items) {
          var itemType = items[item.itemTypeName];
  
          dntFiles[itemType.mainDnt] = itemColumnsToLoad.mainDnt;
          if(item.pid > 0) {
            dntFiles[itemType.potentialDnt] = itemColumnsToLoad.potentialDnt;
          }
          
          if(item.enchantmentNum > 0) {
            dntFiles[itemType.enchantDnt] = itemColumnsToLoad.enchantDnt;
          }
          
          if(item.setId > 0) {
            dntFiles[itemType.setDnt] = itemColumnsToLoad.setDnt;
          }
        }
      });
      
      return dntFiles;
    }
    
    function tryInit(groupName, group) {
      var allLoaded = true;
      angular.forEach(getDntFiles(group), function(columns, fileName) {
        if(!dntData.isLoaded(fileName)) {
          allLoaded = false;
          return;
        }
      });
      
      if(allLoaded && $scope.isLoading && translations.isLoaded()) {
        var newItems = [];
        angular.forEach(group.items, function(item, key) {
          
          if(item.itemTypeName in items) {
            var itemType = items[item.itemTypeName];
            var ds = dntData.find(itemType.mainDnt, 'id', item.id);
            if(ds.length > 0) {
              var d = ds[0];
            
              var totalRatio = 0;
              var p = null;
              if(item.pid > 0) {
                var ps = dntData.find(itemType.potentialDnt, 'id', item.pid);
                if(ps.length > 0) {
                  p = ps[0];
                  
                  if(p.PotentialID != d.TypeParam1) {
                    // this happened one time
                    // not sure how but it corrupted the stats
                    p = null;
                  }
                  else {
                    var potentials = dntData.find(itemType.potentialDnt, 'PotentialID', p.PotentialID);
                    angular.forEach(potentials, function(value, key) {
                      totalRatio += value.PotentialRatio;
                    });
                  }
                }
              }
              
              var newItem = createItem(item.itemTypeName, d, p, totalRatio);
              initItem(newItem);
              
              var sets = dntData.find(itemType.setDnt, 'id', item.setId);
              if(sets.length > 0) {
                newItem.setId = item.setId;
                newItem.setStats = hCodeValues.getStats(sets[0]);
              }
              
              if(item.enchantmentNum > 0) {
                newItem.enchantmentNum = item.enchantmentNum;
    
                var enchantments = dntData.find(itemType.enchantDnt, 'EnchantID', item.enchantmentId);
                angular.forEach(enchantments, function(enchantment, index) {
                  if(enchantment.EnchantLevel == newItem.enchantmentNum) {
                    newItem.enchantmentStats = hCodeValues.getStats(enchantment);
                    newItem.fullStats = hCodeValues.mergeStats(newItem.enchantmentStats, newItem.stats);
                  }
                });
              }
              else {
                item.enchantmentNum = 0;
                newItem.fullStats = newItem.stats;
              }
              
              newItems.push(newItem);
            }
          }
        });
        
        saveHelper.updatedSavedItems(groupName, newItems);
        // dntReset();
        
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
