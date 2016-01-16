angular.module('viewGroupController', ['saveService','valueServices','itemService','exportLinkServices'])
.controller('ViewGroupCtrl', 
  ['$scope','hCodeValues','$location','$routeParams','saveHelper','items','itemColumnsToLoad','dntData','createItem','initItem','$timeout','translations','dntReset','exportLinkHelper','statHelper',
  function($scope,hCodeValues,$location,$routeParams,saveHelper,items,itemColumnsToLoad,dntData,createItem,initItem,$timeout,translations,dntReset,exportLinkHelper,statHelper) {
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
              
                  var potentials = dntData.find(itemType.potentialDnt, 'PotentialID', p.PotentialID);
                  angular.forEach(potentials, function(value, key) {
                    totalRatio += value.PotentialRatio;
                  });
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
