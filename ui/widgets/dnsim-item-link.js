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
      $scope.itemLink = '/dngearsim/item/?region=' + region.dntLocation.region + '&i=' + exportLinkHelper.encodeItem($scope.item);
      // var basePath = angular.element(document.querySelector('base')).attr('href');
      
      $scope.$watch('item', function(newValue, oldValue) {
        if (newValue) {
          $scope.itemLink = 'item/?region=' + region.dntLocation.region + '&i=' + exportLinkHelper.encodeItem($scope.item);
        }
      });
    },
  };
}

})();
