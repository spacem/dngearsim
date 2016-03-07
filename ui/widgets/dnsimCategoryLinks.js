(function () {
'use strict';
  
angular.module('dnsim').directive('dnsimCategoryLinks', ['itemCategory','$location', dnsimCategoryLinks]);

function dnsimCategoryLinks(itemCategory,$location) {
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: 'ui/widgets/dnsim-category-links.html?bust=' + Math.random().toString(36).slice(2),
    link: function($scope, element, attrs) {
      
      $scope.categories = itemCategory.categories;
      
      $scope.setCategory = function(action) {
        localStorage.setItem('selectedItemCategory', action.name);
        $location.path('/' + action.path);
      }

      angular.forEach($scope.categories, function(value, key) {
        if($location.path() == '/' + value.path) {
          value.extraCss = 'active';
        }
        else {
          value.extraCss = 'search-default';
        }
      });
    },
  };
}

})();
