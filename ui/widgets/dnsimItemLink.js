(function () {
'use strict';
  
angular.module('dnsim').directive('dnsimItemLink', ['exportLinkHelper','$location','region', dnsimItemLink]);

function dnsimItemLink(exportLinkHelper,$location,region) {
  return {
    restrict: 'E',
    scope: {
      item: '=item',
      noClick: '=noClick',
    },
    templateUrl: 'ui/widgets/dnsim-item-link.html',
    link: function($scope, element, attrs) {
      $scope.itemLink = '/item/' + region.dntLocation.region + '/' + exportLinkHelper.encodeItem($scope.item);
      
      $scope.$watch('item', function(newValue, oldValue) {
        if (newValue) {
          $scope.itemLink = '/item/' + region.dntLocation.region + '/' + exportLinkHelper.encodeItem($scope.item);
        }
      });
      
      $scope.openItem = function() {
        if(!$scope.noClick) {
          $location.path($scope.itemLink);
        }
      }
    },
  };
}

})();
