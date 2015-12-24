angular.module('savedItemController', ['saveService','valueServices'])
.controller('SavedCtrl', 
  ['$scope','getSavedItems','updatedSavedItems','$uibModal','hCodeValues',
  function($scope,getSavedItems,updatedSavedItems,$uibModal,hCodeValues) {
    $scope.savedItems = getSavedItems();
    $scope.anyItems = Object.keys($scope.savedItems).length > 0;
    $scope.combinedStats = {};
    
    $scope.removeItem = function(group, index) {
      $scope.savedItems[group].items.splice(index);
      updatedSavedItems(group, $scope.savedItems[group].items);
      $scope.combinedStats[group] = $scope.getCombinedStats(group);
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
    
    angular.forEach($scope.savedItems, function(value, key) {
      $scope.combinedStats[key] = $scope.getCombinedStats(key);
    });

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
  }]
);
