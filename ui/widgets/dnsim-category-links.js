(function () {
'use strict';
  
angular.module('dnsim').directive('dnsimCategoryLinks', ['itemCategory','$location', dnsimCategoryLinks]);

function dnsimCategoryLinks(itemCategory,$location) {
  return {
    restrict: 'E',
    scope: {
      collapse: '=collapse',
      cat: '=cat',
      onChange: '&onChange'
    },
    templateUrl: 'ui/widgets/dnsim-category-links.html',
    link: function($scope, element, attrs) {
      
      $scope.categories = itemCategory.categories;
      $scope.collapsed = true;
      
      $scope.setCategory = function(action) {
        $scope.cat = action;
        localStorage.setItem('selectedItemCategory', action.name);
        
        if($scope.collapse) {
          $scope.collapsed = !$scope.collapsed;
        }

        if($scope.onChange) {
          $scope.onChange();
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
