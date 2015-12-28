angular.module('navController', ['ngRoute','translationService'])
.controller('NavCtrl', 
  ['$scope','$route','$routeParams','$location','translations',
  function($scope,$route,$routeParams,$location,translations) {
      
    var setupAction = { path: 'setup', name: 'setup' }
    var noLocationMenu = [setupAction];
    var normalMenu = [
      setupAction, 
      {path: 'item-search/equipment', name:'equipment'},
      {path: 'item-search/talisman', name:'talisman'},
      {path: 'item-search/plates', name:'plates'},
      {path: 'item-search/techs', name:'techs'},
      {path: 'item-search/cash', name:'cash'},
      {path: 'item-search/titles', name:'titles'},
      {path: 'item-search/gems', name:'gems'},
      {path: 'saved', name:'saved'},
      ];
    $scope.getActions = function() {
      var menu = null;
      if($routeParams.location != null && translations.isLoaded()) {
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