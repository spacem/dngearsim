angular.module('equipmentController', ['ui.bootstrap','translationService', 'dntServices'])
.controller('EquipmentCtrl',

['$scope','$routeParams','$timeout','$uibModalInstance','item','dntData','hCodeValues','items','itemColumnsToLoad',
function($scope,$routeParams,$timeout,$uibModalInstance,item,dntData,hCodeValues,items,itemColumnsToLoad) {
  
  console.log('got: ' + $scope.name);
  
  $scope.enchantments = null;
  $scope.item = item;
  $scope.enchantment = null;
  $scope.item.enchantmentStats = [];
  $scope.enchantmentCost = '';
  $scope.item.setStats = null;
  $scope.item.setId = null;
  $scope.stat = {id:-1, name:''};
  $scope.newStatVal = 0;
  
  $scope.setEnchantment = function() {
      
    $scope.item.fullStats = $scope.item.stats;
    $scope.item.enchantmentStats = [];
      
    if($scope.enchantments.length > 0) {

      if(typeof $scope.item.enchantmentNum != 'number') {
        $scope.item.enchantmentNum = 6;
      }
      
      for(var i=0;i<$scope.enchantments.length;++i) {
        if($scope.item.enchantmentNum == $scope.enchantments[i].EnchantLevel) {
          $scope.enchantment = $scope.enchantments[i];
          
          $scope.item.enchantmentStats = hCodeValues.getStats($scope.enchantment);
          $scope.item.fullStats = hCodeValues.mergeStats($scope.item.enchantmentStats, $scope.item.stats);
          if($scope.enchantment.NeedCoin < 10000) {
            $scope.enchantmentCost = Math.round($scope.enchantment.NeedCoin / 1000)/10 + 'g';
          }
          else {
            $scope.enchantmentCost = Math.round($scope.enchantment.NeedCoin / 10000) + 'g';
          }
          return;
        }
      }
    }
  }
  
  $scope.isMaxEnchantLevel = function() {

    if($scope.enchantments != null &&
      $scope.enchantments.length > 0 &&
      typeof $scope.item.enchantmentNum == 'number') {

      for(var i=0;i<$scope.enchantments.length;++i) {
        if($scope.item.enchantmentNum + 1 == $scope.enchantments[i].EnchantLevel) {
          return false;
        }
      }
      return true;
    }
    else {
      return false;
    }
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
    }
    else {
      $scope.item.enchantmentNum = 0;
      $scope.enchantment = null;
    }
    $scope.setEnchantment();
  }
  
  $scope.getStats = function() {
    return hCodeValues.stats;
  }
  
  $scope.getNewStatName = function() {
    return $scope.getStatName($scope.newStat());
  }
  
  $scope.getNewStatDisplayValue = function() {
    return $scope.getStatDisplayValue($scope.newStat());
  }
  
  $scope.getStatName = function(stat) {
    if(stat.id in hCodeValues.stats) {
      return hCodeValues.stats[stat.id].name;
    }
  }
  
  $scope.getStatDisplayValue = function(stat) {
    if(stat.id in hCodeValues.stats) {
      return hCodeValues.stats[stat.id].display(stat);
    }
  }
  
  $scope.newStat = function() {
    return {id:$scope.stat.id,max:$scope.newStatVal};
  }
  
  $scope.addStat = function() {
    if($scope.stat.id > -1) {
      $scope.item.stats.push($scope.newStat());
    }
  }
  
  $scope.removeStat = function(stat) {
    var i = $scope.item.stats.indexOf(stat);
    if(i != -1) {
    	$scope.item.stats.splice(i, 1);
    }
  }
    
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
  if(item.itemTypeName) {
    $scope.itemType = items[item.itemTypeName];
    
    if($scope.itemType && 'enchantDnt' in $scope.itemType) {
      dntData.init($scope.itemType.enchantDnt, itemColumnsToLoad.enchantDnt, reportProgress, function() { $timeout(enchantInit); } );
    }
    else {
      $scope.enchantments = [];
    }
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
  
  if($scope.itemType && $scope.usePartDnt in $scope.itemType && 'setDnt' in $scope.itemType) {
    dntData.init($scope.itemType.setDnt, null, reportProgress, function() { $timeout(setInit); } );
    dntData.init($scope.itemType[$scope.usePartDnt], itemColumnsToLoad.partsDnt, reportProgress, function() { $timeout(setInit); } );
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