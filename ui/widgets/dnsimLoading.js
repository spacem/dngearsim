angular.module('dnsimLoading', []).directive('dnsimLoading', ['dntData','translations','$timeout', function(dntData, translations, $timeout) {
  'use strict';
  return {
    restrict: 'E',
    transclude: true,
    scope: {
    },
    templateUrl: 'ui/widgets/dnsim-loading.html?bust=' + Math.random().toString(36).slice(2),
    link: function($scope, element, attrs) {
      $scope.$on('TRANSLATION_LOAD_EVENT', function() {
        $scope.showLoadingScreen = !translations.isLoaded();
      });
      
      $scope.$on('DNTDATA_LOAD_EVENT', function() {
        $timeout(function() {
          $scope.showLoadingScreen = dntData.anyLoading();
        });
      });

      $scope.showLoadingScreen = dntData.anyLoading() || !translations.isLoaded();
    },
  };
}]);