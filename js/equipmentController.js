angular.module('equipmentController', ['ui.bootstrap','translationService', 'dntServices'])
.controller('EquipmentCtrl',

['$scope','$routeParams','$timeout','$uibModalInstance','item','dntData','hCodeValues','items',
function($scope,$routeParams,$timeout,$uibModalInstance,item,dntData,hCodeValues,items) {
  
  console.log('got: ' + $scope.name);
  
  $scope.enchantments = null;
  $scope.item = item;
  $scope.enchantment = null;
  $scope.enchantmentStats = [];
  $scope.enchantmentCost = '';
  $scope.setStats = null;
  
  $scope.setEnchantment = function() {
    if(typeof $scope.item.curEnchantmentNum != 'number') {
      $scope.item.curEnchantmentNum = 10;
    }
    
    for(var i=0;i<$scope.enchantments.length;++i) {
      if($scope.item.curEnchantmentNum == $scope.enchantments[i].EnchantLevel) {
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
    if($scope.item.curEnchantmentNum < $scope.enchantments.length) {
      $scope.item.curEnchantmentNum++;
      $scope.setEnchantment();
    }
  }
  
  $scope.prevEnchantment = function() {
    if($scope.item.curEnchantmentNum > 1) {
      $scope.item.curEnchantmentNum--;
      $scope.setEnchantment();
    }
    else {
      $scope.item.curEnchantmentNum = 0;
      $scope.enchantment = null;
    }
  }
    
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
  $scope.itemType = items[item.itemTypeName];
  
  if('enchantDnt' in $scope.itemType) {
    dntData.init($scope.itemType.enchantDnt, reportProgress, function() { $timeout(enchantInit); } );
  }
  else {
    $scope.enchantments = [];
  }

  function enchantInit() {

    if(dntData.isLoaded($scope.itemType.enchantDnt)) {
      if($scope.enchantments == null) {
        
        var eid = $scope.item.enchantmentId;
        $scope.enchantments = dntData.find($scope.itemType.enchantDnt, 'EnchantID', eid);
        $scope.setEnchantment();
      }
    }
  }
  
  $scope.usePartDnt = '';
  if($scope.item.typeId == 1) {
    $scope.usePartDnt = 'partsDnt';
  }
  else if($scope.item.typeId == 0) {
    $scope.usePartDnt = 'weaponDnt';
  }
  
  if($scope.usePartDnt in $scope.itemType && 'setDnt' in $scope.itemType) {
    dntData.init($scope.itemType.setDnt, reportProgress, function() { $timeout(setInit); } );
    dntData.init($scope.itemType[$scope.usePartDnt], reportProgress, function() { $timeout(setInit); } );
  }
  else {
      $scope.setStats = [];
  }

  function setInit() {

    if(dntData.isLoaded($scope.itemType[$scope.usePartDnt]) && dntData.isLoaded($scope.itemType.setDnt)) {

      if($scope.setStats == null) {
        
        $scope.setStats = [];
        
        var parts = dntData.find($scope.itemType[$scope.usePartDnt], 'id', $scope.item.id);
        if(parts.length > 0) {
          var sets = dntData.find($scope.itemType.setDnt, 'id', parts[0].SetItemID);
          if(sets.length > 0) {
            $scope.setStats = hCodeValues.getStats(sets[0]);
          }
        }
      }
    }
  }
  
  function reportProgress(msg) {
      // $scope.progress += '|' + msg;
      console.log('progress: ' + msg);
  }
}])