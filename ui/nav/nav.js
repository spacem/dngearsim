angular.module('dnsim').controller('NavCtrl', 
  ['$scope','$location','translations','region','itemCategory',
  function($scope,$location,translations,region,itemCategory) {
    'use strict';

    var aboutAction = { path: 'about', name: '', icon: 'question-sign' }
    
    var noMenu = [];
    var noLocationMenu = [aboutAction];
    var normalMenu = [
      {path: 'builds', name:'builds', icon: 'wrench'},
      {path: 'search', name:'gear', icon: 'search'},
      {path: 'items', name:'items', icon: 'search'},
      aboutAction,
      ];
      
    region.init();
  
    $scope.isSearch = function() {
      return $location.path().indexOf('/search') == 0;
    }

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
    
    $scope.fireAction = function(action) {
      if(action.name == 'search') {
        var cat = localStorage.getItem('selectedItemCategory', action.name);
        if(cat) {
          $location.path('/' + action.path + '/' + cat);
        }
        else {
          $location.path('/' + action.path);
        }
      }
      else {
          $location.path('/' + action.path);
      }
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
        menu = normalMenu;
      }
      else {
        menu = normalMenu;
      }
      
      angular.forEach(menu, function(value, key) {
        delete value.extraCss;
        if($location.path().length == 1) {
          if(value.path.length == 1) {
            value.extraCss = 'active';
          }
        }
        else if(value.path.length > 1 && $location.path().indexOf('/' + value.path) == 0) {
          value.extraCss = 'active';
        }
      });
      
      return menu;
    };
  }
])
.directive('dngearsimNav', function() {
  return {
    templateUrl: 'ui/nav/nav.html'
  };
});