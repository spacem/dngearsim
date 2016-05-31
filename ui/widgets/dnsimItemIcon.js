(function () {
'use strict';
  
angular.module('dnsim').directive('dnsimItemIcon', ['exportLinkHelper','$location','region', dnsimItemIcon]);

function dnsimItemIcon(exportLinkHelper,$location,region) {
  return {
    restrict: 'E',
    scope: {
      item: '=item',
    },
    templateUrl: 'ui/widgets/dnsim-item-icon.html',
    link: function($scope, element, attrs) {
      
      $scope.$watch('item', function(newValue, oldValue) {
        if (newValue) {
          $scope.iconImage = $scope.getIcon();
        }
      });
      
      $scope.getIcon = function() {
        if($scope.item && $scope.item.icon > 0) {
          var fileIndex = Math.floor($scope.item.icon/200 + 1);
          if(fileIndex > 9) {
            return 'itemicon' + fileIndex + '.png';
          }
          else {
            return 'itemicon0' + fileIndex + '.png';
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
