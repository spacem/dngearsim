angular.module('equipmentController', ['ui.bootstrap','translationService', 'dntServices'])
.controller('EquipmentCtrl',

['$scope','$routeParams','$timeout','$uibModalInstance','item','dntData','hCodeValues',
function($scope,$routeParams,$timeout,$uibModalInstance,item,dntData,hCodeValues) {
  
  console.log('got: ' + $scope.name);
  
  $scope.enchantments = null;
  $scope.item = item;
  $scope.curEnchantmentNum = 10;
  $scope.enchantment = null;
  $scope.potentialRatio = item.getPotentialRatio();
  $scope.enchantmentStats = [];
  $scope.enchantmentCost = '';
  
  $scope.setEnchantment = function() {
    for(var i=0;i<$scope.enchantments.length;++i) {
      if($scope.curEnchantmentNum == $scope.enchantments[i].EnchantLevel) {
        $scope.enchantment = $scope.enchantments[i];
        
        $scope.enchantmentStats = hCodeValues.getStats($scope.enchantment);
        if($scope.enchantment.NeedCoin < 10000) {
          $scope.enchantmentCost = Math.round($scope.enchantment.NeedCoin / 1000)/10 + 'g';
        }
        else {
          $scope.enchantmentCost = Math.round($scope.enchantment.NeedCoin / 10000) + 'g';
        }
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
  
  if('enchantDnt' in item.itemType) {
    dntData.init(item.itemType.enchantDnt, reportProgress, function() { $timeout(itemInit); } );
  }
  else {
    $scope.enchantments = [];
  }

  function itemInit() {

    if(dntData.isLoaded(item.itemType.enchantDnt)) {
      if($scope.enchantments == null) {
        
        var eid = $scope.item.getEnchantmentId();
        $scope.enchantments = dntData.find(item.itemType.enchantDnt, 'EnchantID', eid);
        $scope.setEnchantment();
      }
    }
  }
  
  function reportProgress(msg) {
      // $scope.progress += '|' + msg;
      console.log('progress: ' + msg);
  }
}])