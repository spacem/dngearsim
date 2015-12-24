angular.module('equipmentController', ['ui.bootstrap','translationService', 'dntServices'])
.controller('EquipmentCtrl',

['$scope','$routeParams','$timeout','$uibModalInstance','item','dntData','hCodeValues','items',
function($scope,$routeParams,$timeout,$uibModalInstance,item,dntData,hCodeValues,items) {
  
  console.log('got: ' + $scope.name);
  
  $scope.enchantments = null;
  $scope.item = item;
  $scope.enchantment = null;
  $scope.item.enchantmentStats = [];
  $scope.enchantmentCost = '';
  $scope.item.setStats = null;
  $scope.item.setId = null;
  
  $scope.setEnchantment = function() {
    if(typeof $scope.item.enchantmentNum != 'number') {
      $scope.item.enchantmentNum = 10;
    }
    
    for(var i=0;i<$scope.enchantments.length;++i) {
      if($scope.item.enchantmentNum == $scope.enchantments[i].EnchantLevel) {
        $scope.enchantment = $scope.enchantments[i];
        
        $scope.item.enchantmentStats = hCodeValues.getStats($scope.enchantment);
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
    if($scope.item.enchantmentNum < $scope.enchantments.length) {
      $scope.item.enchantmentNum++;
      $scope.setEnchantment();
    }
  }
  
  $scope.prevEnchantment = function() {
    if($scope.item.enchantmentNum > 1) {
      $scope.item.enchantmentNum--;
      $scope.setEnchantment();
    }
    else {
      $scope.item.enchantmentNum = 0;
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
      $scope.item.setStats = [];
  }

  function setInit() {

    if(dntData.isLoaded($scope.itemType[$scope.usePartDnt]) && dntData.isLoaded($scope.itemType.setDnt)) {

      if($scope.item.setStats == null) {
        
        $scope.item.setStats = [];
        
        var parts = dntData.find($scope.itemType[$scope.usePartDnt], 'id', $scope.item.id);
        if(parts.length > 0) {
          $scope.item.setId = parts[0].SetItemID;
          var sets = dntData.find($scope.itemType.setDnt, 'id', parts[0].SetItemID);
          if(sets.length > 0) {
            $scope.item.setStats = hCodeValues.getStats(sets[0]);
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