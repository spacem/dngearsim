(function () {
'use strict';

angular.module('dnsim').directive('dnsimJobIcon', ['exportLinkHelper','$location','region', dnsimJobIcon]);

function dnsimJobIcon(exportLinkHelper,$location,region) {
  return {
    restrict: 'E',
    scope: {
      item: '=item',
    },
    templateUrl: 'ui/widgets/dnsim-job-icon.html',
    link: function($scope, element, attrs) {

      $scope.getIconXPostion = function() {
        if($scope.item && $scope.item.d && $scope.item.d.JobIcon > 0) {
          return (($scope.item.d.JobIcon % 9) * 44) + 5;
        }
        return 0;
      }
      
      $scope.getIconYPostion = function() {
        if($scope.item && $scope.item.d && $scope.item.d.JobIcon > 0) {
          return (Math.floor($scope.item.d.JobIcon / 9) * 44) + 5;
        }
        return 0;
      }
    },
  };
}

})();
