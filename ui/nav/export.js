angular.module('dnsim').controller('ExportCtrl', 
  ['$scope','$window','saveHelper',
   function($scope, $window, saveHelper) {
  'use strict';
     
  document.body.className = 'default-back';
  $window.document.title = 'dngearsim | EXPORT';
    $(document).ready(function($) { 
        $('meta[name=description]').attr('content', 'Export your build');
    });
  
  var rawSavedData = saveHelper.getSavedItems();
  $scope.exportData = JSON.stringify(rawSavedData, null, 1);
  
  $scope.save = function() {
    localStorage.setItem('savedItems', LZString.compressToUTF16($scope.exportData));
  }
}]);
