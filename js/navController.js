angular.module('navController', ['ngRoute'])
.controller('NavCtrl', 
  ['$scope','$route','$routeParams',
  function($scope,$route,$routeParams) {
      
    var setupAction = { path: 'setup', name: 'setup' }
    var noLocationMenu = [setupAction];
    var normalMenu = [
      setupAction, 
      {path: 'item-search', name:'item search'}
      ];
    
    $scope.getActions = function() {
      if($routeParams.location != null) {
        return normalMenu;
      }
      else {
        return noLocationMenu;
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