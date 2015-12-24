angular.module('savedItemController', ['saveService'])
.controller('SavedCtrl', 
  ['$scope','getSavedItems','updatedSavedItems','$uibModal',
  function($scope,getSavedItems,updatedSavedItems,$uibModal) {
    $scope.savedItems = getSavedItems();
    $scope.anyItems = Object.keys($scope.savedItems).length > 0;
    
    $scope.removeItem = function(group, index) {
      $scope.savedItems[group].items.splice(index);
      updatedSavedItems(group, $scope.savedItems[group].items);
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
      });
    }
  }]
);
