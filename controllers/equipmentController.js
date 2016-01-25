angular.module('equipmentController', ['ui.bootstrap','translationService', 'dntServices'])
.controller('EquipmentCtrl',

['$scope','$routeParams','$timeout','$uibModalInstance','item','dntData','hCodeValues','items','itemColumnsToLoad',
function($scope,$routeParams,$timeout,$uibModalInstance,item,dntData,hCodeValues,items,itemColumnsToLoad) {
  
  console.log('got: ' + $scope.name);
  
  $scope.enchantments = null;
  $scope.item = item;
  $scope.enchantment = null;
  if($scope.item.enchantmentStats == null) {
    $scope.item.enchantmentStats = [];
  }
  $scope.enchantmentCost = '';
  $scope.item.setStats = null;
  $scope.item.setId = null;
  $scope.stat = {id:-1, name:''};
  $scope.newStatVal = 0;
  
  $scope.setEnchantment = function() {
      
    $scope.item.enchantmentStats = [];
    setFullStats();
      
    if($scope.enchantments.length > 0) {

      if(typeof $scope.item.enchantmentNum != 'number') {
        $scope.item.enchantmentNum = 6;
      }
      
      for(var i=0;i<$scope.enchantments.length;++i) {
        if($scope.item.enchantmentNum == $scope.enchantments[i].EnchantLevel) {
          $scope.enchantment = $scope.enchantments[i];
          
          $scope.item.enchantmentStats = hCodeValues.getStats($scope.enchantment);
          setFullStats();
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
    
    if($scope.itemType && 'enchantDnt' in $scope.itemType && $scope.item.enchantmentId > 0) {
      dntData.init($scope.itemType.enchantDnt, itemColumnsToLoad.enchantDnt, reportProgress, function() { $timeout(enchantInit); } );
    }
    else {
      $scope.enchantments = [];
    }
    
    if($scope.itemType && 'sparkDnt' in $scope.itemType && $scope.item.sparkTypeId > 0) {
      dntData.init($scope.itemType.sparkDnt, itemColumnsToLoad.sparkDnt, reportProgress, function() { $timeout(sparkInit); } );
    }
    else {
      $scope.enchantments = [];
    }
  }
  else {
    $scope.enchantments = [];
  }
  
  $scope.setTalisman = function(amount) {
    if(amount == 0) {
      $scope.item.enchantmentNum = null;
      $scope.item.enchantmentStats = [];
      setFullStats();
    }
    else {
      $scope.item.enchantmentNum = amount;
      
      var extraStats = [];
      angular.forEach(item.stats, function(stat, index) {
        extraStats.push({id: stat.id, max: stat.max * (amount/100)});
      });
      
      $scope.item.enchantmentStats = extraStats;
      setFullStats();
    }
  }
  
  $scope.nextSpark = function() {
    var index = getPotentialIndex();
    index++;
    if(index >= $scope.sparks.length) {
      index = 0;
    }
    var spark = $scope.sparks[index]; 
    $scope.item.sparkId = spark.id;
    $scope.item.sparkStats = hCodeValues.getStats(spark);
    setFullStats();
  }
  
  $scope.isMoreSparks = function() {
    return $scope.sparks != null && getPotentialIndex() >= $scope.sparks.length-1;
  }
  
  $scope.isFirstSpark = function() {
    return getPotentialIndex() == 0;
  }
  
  function getPotentialIndex() {
    var potentialIndex = -1;
    if($scope.item.sparkId > 0) {
      angular.forEach($scope.sparks, function(spark, index) {
        if(spark.id == $scope.item.sparkId) {
          potentialIndex = index;
          return;
        }
      });
    }
      
    return potentialIndex;
  }
  
  $scope.prevSpark = function() {
    var index = getPotentialIndex();
    index--;
    if(index < 0) {
      index = $scope.sparks.length-1;
    }
    var spark = $scope.sparks[index]; 
    $scope.item.sparkId = spark.id;
    $scope.item.sparkStats = hCodeValues.getStats(spark);
    setFullStats();
  }
  
  $scope.removeSpark = function() {
    $scope.item.sparkId = null;
    $scope.item.sparkStats = null;
    setFullStats();
  }
  
  function sparkInit() {
    if(dntData.isLoaded($scope.itemType.sparkDnt)) {
      if($scope.sparks == null) {
        
        var sid = $scope.item.sparkTypeId;
        $scope.sparks = dntData.find($scope.itemType.sparkDnt, 'PotentialID', sid);
        // $scope.setEnchantment();
      }
    }
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
  
  function setFullStats() {
    $scope.item.fullStats = $scope.item.stats;
    
    if($scope.item.enchantmentStats != null && $scope.item.enchantmentStats.length > 0) {
      $scope.item.fullStats = hCodeValues.mergeStats($scope.item.enchantmentStats, $scope.item.fullStats);
    }
    
    if($scope.item.sparkStats != null && $scope.item.sparkStats.length > 0) {
      $scope.item.fullStats = hCodeValues.mergeStats($scope.item.sparkStats, $scope.item.fullStats);
    }
  }
  
  function reportProgress(msg) {
      // $scope.progress += '|' + msg;
      console.log('progress: ' + msg);
  }
}])