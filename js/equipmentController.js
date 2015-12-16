angular.module('equipmentController', ['ui.bootstrap','translationService', 'dntServices'])
.controller('EquipmentCtrl',

['$scope','$routeParams','$timeout','enchantment','item',
function($scope,$routeParams,$timeout,enchantment,item) {
  
  console.log('got: ' + $scope.name);
  
  item.initStats();
  $scope.enchantments = null;
  $scope.item = item;
  
  var itemFactories = [];
  if($scope.item.getEnchantmentId() > 0) {
    itemFactories.push(enchantment);
  }
  else {
    $scope.enchantments = [];
  }
  
  angular.forEach(itemFactories, function(value, key) {
    value.init(reportProgress, function() { $timeout(itemInit); } );
  });

  function itemInit() {

    if(enchantment.isLoaded()) {
      if($scope.enchantments == null) {
        var eid = $scope.item.getEnchantmentId();
        $scope.enchantments = enchantment.values[eid];
        if($scope.enchantments == null) {
          $scope.enchantments = enchantment.rValues[eid];
        }
        if($scope.enchantments == null) {
          $scope.enchantments = [];
        }
        else {
          angular.forEach($scope.enchantments, function(value,key) {
            value.initStats();
          });
        }
      }
    }
  }
  
  function reportProgress(msg) {
      // $scope.progress += '|' + msg;
      console.log('progress: ' + msg);
  }
}])