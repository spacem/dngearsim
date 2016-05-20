(function () {
'use strict';
  
angular.module('dnsim').directive('dnsimItemLink', ['exportLinkHelper','$location','region', dnsimItemLink]);

function dnsimItemLink(exportLinkHelper,$location,region) {
  return {
    restrict: 'E',
    scope: {
      item: '=item',
      onClose: '&onClose'
    },
    templateUrl: 'ui/widgets/dnsim-item-link.html?bust=' + Math.random().toString(36).slice(2),
    link: function($scope, element, attrs) {
      $scope.itemLink = '/item/' + region.dntLocation.region + '/' + exportLinkHelper.encodeItem($scope.item);
      
      $scope.$watch('item', function(newValue, oldValue) {
        if (newValue) {
          $scope.itemLink = '/item/' + region.dntLocation.region + '/' + exportLinkHelper.encodeItem($scope.item);
        }
      });
      
      $scope.openItem = function() {
        $location.path($scope.itemLink);
      }
      
      $scope.getIcon = function() {
        if($scope.item.icon > 0) {
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
      
      $scope.getIconXPostion = function() {
        if($scope.item.icon > 0) {
          return (($scope.item.icon % 10) * 40) + 5;
        }
        return 0;
      }
      
      $scope.getIconYPostion = function() {
        if($scope.item.icon > 0) {
          return (Math.floor(($scope.item.icon % 200) / 10) * 40) + 4;
        }
        return 0;
      }
    },
  };
}

})();
