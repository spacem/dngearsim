angular.module('useOptionsController', ['ui.bootstrap','translationService', 'dntServices', 'saveService'])
.controller('UseOptionsCtrl',

['$scope','$routeParams','$timeout','$uibModalInstance','item','group','dntData','hCodeValues','items','getSavedItems','saveItem',
function($scope,$routeParams,$timeout,$uibModalInstance,item,group,dntData,hCodeValues,items,getSavedItems,saveItem) {
  
  $scope.item = item;
  $scope.savedItems = getSavedItems();
  $scope.groupName = group;
  if($scope.groupName == null) {
    $scope.groupName = 'Unamed Group';
  }
    
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
  $scope.ok = function() {
    
    saveItem($scope.groupName, $scope.item);
    $uibModalInstance.dismiss('ok');
  }
  
  $scope.itemType = items[item.itemTypeName];
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
  
  $timeout(function() {
    var input = document.getElementById('groupNameInput');
    input.focus();
    input.setSelectionRange(0, 9999);
  });

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
}]);