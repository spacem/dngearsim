angular.module('navController', ['ngRoute'])
.controller('NavCtrl', 
  ['$scope','$route','$routeParams',
  function($scope,$route,$routeParams) {
    
    $scope.getActions = function() {
      if($routeParams.location != null) {
        return ['setup', 'equip'];
      }
      else {
        return ['setup'];
      }
    };
    $scope.getUrl = function(action) {
      var retVal = "#/" + action;
      if($routeParams.location != null) {
        retVal += '?location=' + $routeParams.location;
      }
      return retVal;
    }
  }
])
.directive('dngearsimNav', function() {
  return {
    templateUrl: 'partials/nav.html'
  };
});