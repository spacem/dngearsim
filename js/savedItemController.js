angular.module('savedItemController', ['saveService','valueServices'])
.controller('SavedCtrl', 
  ['$scope','getSavedItems','updatedSavedItems','$uibModal','hCodeValues','saveItem',
  function($scope,getSavedItems,updatedSavedItems,$uibModal,hCodeValues,saveItem) {
    $scope.combinedStats = {};
    
    $scope.init = function() {
      $scope.savedItems = getSavedItems();
      $scope.anyItems = Object.keys($scope.savedItems).length > 0;

      angular.forEach($scope.savedItems, function(value, key) {
        $scope.combinedStats[key] = $scope.getCombinedStats(key);
      });
    }
    
    $scope.addItem = function(group, item) {
      console.log('opening item for save ' + item.name);
      var modalInstance = $uibModal.open({
        animation: false,
        backdrop : true,
        keyboard : true,
        templateUrl: 'partials/use-options.html?bust=' + Math.random().toString(36).slice(2),
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
        $scope.init();
      });
    }
    
    $scope.removeItem = function(group, index) {
      $scope.savedItems[group].items.splice(index, 1);
      updatedSavedItems(group, $scope.savedItems[group].items);
      
      $scope.init();
    }
    
    $scope.getFullStats = function(item) {
      if('fullStats' in item && item.fullStats != null) {
        return item.fullStats;
      }
      else {
        return item.stats;
      }
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

    $scope.open = function (group, item, index) {
      console.log('opening item ' + item.name);
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop : true,
        keyboard : true,
        templateUrl: 'partials/equipment.html?bust=' + Math.random().toString(36).slice(2),
        controller: 'EquipmentCtrl',
        size: 'lg',
        resolve: {
          item: function () {
            return item;
          }
        }
      });
      
      modalInstance.result.then(function (selectedItem) {}, function () {
        $scope.savedItems[group].items[index] = item;
        updatedSavedItems(group, $scope.savedItems[group].items);
        $scope.combinedStats[group] = $scope.getCombinedStats(group);
      });
    }
    
    $scope.init();
  }]
);
