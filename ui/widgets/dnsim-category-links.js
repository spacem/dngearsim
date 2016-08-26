(function () {
'use strict';
  
angular.module('dnsim').directive('dnsimCategoryLinks', ['itemCategory','$location', dnsimCategoryLinks]);

function dnsimCategoryLinks(itemCategory,$location) {
  return {
    restrict: 'E',
    scope: {
      collapse: '=collapse'
    },
    templateUrl: 'ui/widgets/dnsim-category-links.html',
    link: function($scope, element, attrs) {
      
      $scope.categories = itemCategory.categories;
      $scope.collapsed = true;
      
      $scope.setCategory = function(action) {
        if(action.extraCss == 'active') {
        }
        else {
          localStorage.setItem('selectedItemCategory', action.name);
          $location.path('/' + action.path);
        }
        
        if($scope.collapse) {
          $scope.collapsed = !$scope.collapsed;
        }
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
