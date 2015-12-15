angular.module('navController', ['ngRoute'])
.controller('NavCtrl', 
  ['$scope','$route','$routeParams','$location',
  function($scope,$route,$routeParams,$location) {
      
    var setupAction = { path: 'setup', name: 'setup' }
    var noLocationMenu = [setupAction];
    var normalMenu = [
      setupAction, 
      {path: 'item-search', name:'item search'}
      ];
    
    $scope.getActions = function() {
      var menu = null;
      if($routeParams.location != null) {
        menu = normalMenu;
      }
      else {
        menu = noLocationMenu;
      }
      
      angular.forEach(menu, function(value, key) {
        if($location.path() == '/' + value.path) {
          value.extraCss = 'active';
        }
        else {
          value.extraCss = 'test';
        }
      });
      
      return menu;
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