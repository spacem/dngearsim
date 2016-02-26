angular.module('dnsimItemLink', []).directive('dnsimItemLink', ['exportLinkHelper', function(exportLinkHelper) {
  'use strict';
  return {
    restrict: 'E',
    scope: {
      item: '=item',
      onClose: '&onClose'
    },
    templateUrl: 'ui/widgets/dnsim-item-link.html?bust=' + Math.random().toString(36).slice(2),
    link: function($scope, element, attrs) {
      $scope.itemLink = '#/item/' + exportLinkHelper.encodeItem($scope.item);
      
      $scope.$watch('item', function(newValue, oldValue) {
        if (newValue) {
          $scope.itemLink = '#/item/' + exportLinkHelper.encodeItem($scope.item);
        }
      });
    },
  };
}]);