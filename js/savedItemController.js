angular.module('savedItemController', ['saveService','valueServices','itemService','exportLinkServices'])
.controller('SavedCtrl', 
  ['$scope','getSavedItems','updatedSavedItems','$uibModal','hCodeValues','$routeParams','importGroup','items','itemColumnsToLoad','dntData','createItem','initItem','$timeout','$http','translations','dntReset','createGroupLink',
  function($scope,getSavedItems,updatedSavedItems,$uibModal,hCodeValues,$routeParams,importGroup,items,itemColumnsToLoad,dntData,createItem,initItem,$timeout,$http,translations,dntReset,createGroupLink) {
    $scope.combinedStats = {};
    
    $scope.currentGroup = '';
    $scope.showCombinedStats = false;
    $scope.isLoading = false;
    
    $scope.setCurrentGroup = function(group) {
      $scope.currentGroup = '';
      if(group in $scope.savedItems) {
        $timeout(function() {
          $scope.currentGroup = group;
        }, 200);
      }
    }
    
    $scope.buildExportLink = function(groupName) {
      if(groupName in $scope.savedItems) {
        return createGroupLink(groupName, $scope.savedItems[groupName].items);
      }
    }
    
    $scope.getGroupSummary = function(group) {
      var summary = '';
      if($scope.savedItems[group].lastUpdate > 0) {
        var lastUpdate = new Date($scope.savedItems[group].lastUpdate);
        summary += lastUpdate.toLocaleDateString() + ' ' + lastUpdate.toLocaleTimeString();
      }
      if(group != $scope.currentGroup) {
        
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

      $scope.savedItems = getSavedItems();
      $scope.setShortUrls();
      $scope.setCombinedStats();
      
      $scope.anyItems = Object.keys($scope.savedItems).length > 0;
    }
    
    $scope.setShortUrls = function() {
      angular.forEach($scope.savedItems, function(value, key) {
        var longUrl = $scope.buildExportLink(key);
        $scope.savedItems[key].shortUrl = sessionStorage.getItem(longUrl);
      });
    }
    
    $scope.setCombinedStats = function() {
      angular.forEach($scope.savedItems, function(value, key) {
        $scope.combinedStats[key] = $scope.getCombinedStats(key);
      });
    }
    
    $scope.copyGroup = function(group) {
      importGroup(group, $scope.savedItems[group].items);
      $scope.init();
    }
    
    $scope.doInitItems = function(group) {
      $scope.isLoading = true;
      
      angular.forEach(getDntFiles($scope.savedItems[group]), function(columns, fileName) {
        dntData.init(fileName, columns, progress, function() { tryInit(group, $scope.savedItems[group]) });
      });
      
      translations.init(progress,function() { tryInit(group, $scope.savedItems[group]) });
    }
    
    $scope.createShortUrl = function(group) {
      
      var path = $scope.buildExportLink(group);
      var longUrl = window.location.href.split("#")[0] + path;
      var data = { longUrl: longUrl };
      
    	$http.post(
    	  'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyD5t5o7ZcSAvM-xMwc14ft2BA-MKQA7LMo', data).success(
    	    function(data,status,headers,config){
        		$scope.savedItems[$scope.currentGroup].shortUrl = data.id;
    	      sessionStorage.setItem(path, data.id);
        	}).
        	error(function(data,status,headers,config){
        		console.log(data);
        		console.log(status);
        		console.log(headers);
        		console.log(config);
        	});
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
          updatedSavedItems(groupName, newItems);
          $scope.savedItems = getSavedItems();
          $scope.setCombinedStats();
          $scope.setShortUrls();
          $scope.isLoading = false;
        });
      }
    }
    
    function progress() {
    }
    
    $scope.addItem = function(group, item) {
      console.log('opening item for save ' + item.name);
      var modalInstance = $uibModal.open({
        animation: false,
        backdrop : false,
        keyboard : true,
        templateUrl: 'partials/use-options.html', //?bust=' + Math.random().toString(36).slice(2),
        controller: 'UseOptionsCtrl',
        size: 'lg',
        resolve: {
          item: function () {
            return item;
          },
          group: function () {
            return group;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {}, function () {
        $timeout(function() {
          $scope.init();
        });
      });
    }
    
    $scope.removeItem = function(group, index) {
      $scope.savedItems[group].items.splice(index, 1);
      updatedSavedItems(group, $scope.savedItems[group].items);
      
      $scope.init();
    }
    
    $scope.getCombinedStats = function(group) {
      var stats = [];
      var sets = {};
      
      angular.forEach($scope.savedItems[group].items, function(value, key) {
        stats = hCodeValues.mergeStats(stats, value.stats);
        
        if(value.enchantmentStats != null) {
          stats = hCodeValues.mergeStats(stats, value.enchantmentStats);
        }
        if(value.setStats != null) {
          if(value.setId in sets) {
            sets[value.setId].numItems++;
          }
          else {
            sets[value.setId] = { numItems : 1, stats : value.setStats };
          }
        }
      });
      
      angular.forEach(sets, function(value, key) {
        var setStats = [];
        angular.forEach(value.stats, function(stat, index) {
          if(stat.needSetNum <= value.numItems) {
            stats = hCodeValues.mergeStats(stats, [stat]);
          }
        });
      });
      
      return stats;
    }

    $scope.closeItemLink = function (group) {
      $timeout(function() {
          updatedSavedItems(group, $scope.savedItems[group].items);
          $scope.init();
        });
    }
    
    $scope.init();
  }]
);
