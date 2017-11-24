'use strict'

const LZString = require('lz-string');

angular.module('dnsim').controller('ExportCtrl', 
  ['$scope','$window','saveHelper',
   function($scope, $window, saveHelper) {
  'use strict';
     
  document.body.className = 'default-back';
  $window.document.title = 'dngearsim | EXPORT';
  
  var rawSavedData = saveHelper.getSavedItems();
  $scope.exportData = JSON.stringify(rawSavedData, null, 1);
  
  $scope.save = function() {
    localStorage.setItem('savedItems', LZString.compressToUTF16($scope.exportData));
  }
}]);
