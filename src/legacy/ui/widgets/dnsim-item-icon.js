(function () {
'use strict';
  
angular.module('dnsim').directive('dnsimItemIcon', [dnsimItemIcon]);

function dnsimItemIcon() {
  return {
    restrict: 'E',
    scope: {
      item: '=item',
    },
    template: require('./dnsim-item-icon.html'),
    link: function($scope, element, attrs) {
      
      $scope.$watch('item', function(newValue, oldValue) {
        if (newValue) {
          $scope.iconImage = $scope.getIcon();
        }
      });
      
      $scope.getIcon = function() {
        if($scope.item && $scope.item.icon > 0) {
          var fileIndex = Math.floor($scope.item.icon/200 + 1);
          
          var prefix;
          if($scope.item.typeName == 'skills') {
            prefix = 'skillicon';
          }
          else {
            prefix = 'itemicon';
          }
          
          if(fileIndex > 9) {
            return prefix + fileIndex + '.png';
          }
          else {
            return prefix + '0' + fileIndex + '.png';
          }
        }
        return null;
      }
      
      $scope.iconImage = $scope.getIcon();
      
      $scope.getIconXPostion = function() {
        if($scope.item && $scope.item.icon > 0) {
          return (($scope.item.icon % 10) * 40) + 5;
        }
        return 0;
      }
      
      $scope.getIconYPostion = function() {
        if($scope.item && $scope.item.icon > 0) {
          return (Math.floor(($scope.item.icon % 200) / 10) * 40) + 4;
        }
        return 0;
      }
    },
  };
}

})();
