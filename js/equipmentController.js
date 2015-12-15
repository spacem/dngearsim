angular.module('equipmentController', ['translationService', 'dntServices'])
.controller('EquipmentCtrl',

['$scope','$routeParams','translations','equipment','plates','talisman','techs','rebootEquipment','getAllItems','$timeout','enchantment',
function($scope,$routeParams,translations,equipment,plates,talisman,techs,rebootEquipment,getAllItems,$timeout,enchantment) {
  translations.init(reportProgress, function() { $timeout(translationsInit); } );
  
  var itemFactories = [
    equipment,plates,talisman,techs,rebootEquipment,enchantment
    ];
  
  angular.forEach(itemFactories, function(value, key) {
    value.init(reportProgress, function() { $timeout(itemInit); } );
  });
  
  $scope.item = null;
  $scope.enchantments = null;
  
  $scope.isLoadComplete = function() {
    for(var i=0;i<itemFactories.length;++i) {
      if(!itemFactories[i].isLoaded()) {
        return false;
      }
    }
    
    return true;
  };
  
  function translationsInit() {
      console.log('translations loaded');
      itemInit();
  }
  
  function itemInit() {
    if(translations.loaded) {
      if($scope.item == null) {
        console.log('trying to find item');
        var allItems = getAllItems();
        angular.forEach(allItems, function(value, key) {
          if(value.id == $routeParams.itemId) {
            value.initStats();
            $scope.item = value;
          }
        });
      }
      
      if($scope.item != null && enchantment.isLoaded()) {
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
  }
  
  function reportProgress(msg) {
      // $scope.progress += '|' + msg;
      console.log('progress: ' + msg);
  }
}])