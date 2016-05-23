angular.module('dnsim').controller('ExportCtrl', 
  ['$scope','$window','saveHelper',
   function($scope, $window, saveHelper) {
  'use strict';
     
  document.body.className = 'default-back';
  $window.document.title = 'DN Gear Sim | EXPORT';
  
  var rawSavedData = saveHelper.getSavedItems();
  $scope.exportData = JSON.stringify(rawSavedData, null, 2);
  
}]);
