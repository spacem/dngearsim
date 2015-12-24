angular.module('savedItemController', ['saveService'])
.controller('SavedCtrl', 
  ['$scope','getSavedItems','removeSavedItem','$uibModal',
  function($scope,getSavedItems,removeSavedItem,$uibModal) {
    $scope.savedItems = getSavedItems();
    $scope.anyItems = Object.keys($scope.savedItems).length > 0;
    
    $scope.removeItem = function(group, index) {
      removeSavedItem(group, index);
      $scope.savedItems = getSavedItems();
    }

    $scope.open = function (item) {
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
    }
  }]
);
