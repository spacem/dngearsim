angular.module('navController', ['ngRoute','translationService'])
.controller('NavCtrl', 
  ['$scope','$route','$location','translations','region','$rootScope','$timeout','$window',
  function($scope,$route,$location,translations,region,$rootScope,$timeout,$window) {

    var setupAction = { path: 'setup', name: 'setup' }
    
    var noMenu = [];
    var noLocationMenu = [setupAction];
    var normalMenu = [
      {path: 'saved', name:'saved'},
      {path: 'item-search/equipment', name:'equipment'},
      {path: 'item-search/talisman', name:'talisman'},
      {path: 'item-search/plates', name:'plates'},
      {path: 'item-search/techs', name:'techs'},
      {path: 'item-search/cash', name:'cash'},
      {path: 'item-search/titles', name:'titles'},
      {path: 'item-search/gems', name:'gems'},
      setupAction, 
      ];
      
    region.init();

    $scope.isLoading = function() {
      return translations.startedLoading && 
            !translations.isLoaded() &&
            region.tlocation != null &&
            region.tlocation.url != '' &&
            !$scope.noRegion();
    }
    
    $scope.noRegion = function() {
      return region.dntLocation == null;
    }
      
    $scope.getActions = function() {
      var menu = null;
      if(region.dntLocation != null && region.dntLocation.url == '') {
        menu = noLocationMenu; 
      }
      else if(region.tlocation != null && region.tlocation.url == '') {
        menu = noLocationMenu; 
      }
      else if($location.path() == '/view-group' || region.dntLocation == null) {
        menu = noMenu;
      }
      else {
        menu = normalMenu;
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
  }
])
.directive('dngearsimNav', function() {
  return {
    templateUrl: 'partials/nav.html'
  };
});