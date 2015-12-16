angular.module('equipmentController', ['ui.bootstrap','translationService', 'dntServices'])
.controller('EquipmentCtrl',

['$scope','$routeParams','$timeout','$uibModalInstance','enchantment','item',
function($scope,$routeParams,$timeout,$uibModalInstance,enchantment,item) {
  
  console.log('got: ' + $scope.name);
  
  item.initStats();
  $scope.enchantments = null;
  $scope.item = item;
  $scope.curEnchantmentNum = 10;
  $scope.enchantment = null;
  $scope.setEnchantment = function() {
    for(var i=0;i<$scope.enchantments.length;++i) {
      if($scope.curEnchantmentNum == $scope.enchantments[i].data.EnchantLevel) {
        $scope.enchantment = $scope.enchantments[i];
        $scope.enchantment.initStats();
        return;
      }
    }
    
    return {};
  }
  
  $scope.nextEnchantment = function() {
    if($scope.curEnchantmentNum < $scope.enchantments.length) {
      $scope.curEnchantmentNum++;
      $scope.setEnchantment();
    }
  }
  
  $scope.prevEnchantment = function() {
    if($scope.curEnchantmentNum > 1) {
      $scope.curEnchantmentNum--;
      $scope.setEnchantment();
    }
    else {
      $scope.curEnchantmentNum = 0;
      $scope.enchantment = null;
    }
  }
    
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
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
          $scope.setEnchantment();
        }
      }
    }
  }
  
  function reportProgress(msg) {
      // $scope.progress += '|' + msg;
      console.log('progress: ' + msg);
  }
}])