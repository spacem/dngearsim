(function () {
'use strict';
  
angular.module('dnsim').directive('dnsimItemLink', ['exportLinkHelper','region', dnsimItemLink]);

function dnsimItemLink(exportLinkHelper,region) {
  return {
    restrict: 'E',
    scope: {
      item: '=item',
      noClick: '=noClick',
    },
    template: require('!raw-loader!./dnsim-item-link.html').default,
    link: function($scope, element, attrs) {
      $scope.itemLink = 'item/?region=' + region.dntLocation.region + '&i=' + exportLinkHelper.encodeItem($scope.item);
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
