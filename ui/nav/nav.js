angular.module('dnsim').controller('NavCtrl', 
  ['$scope','$location','translations','region','itemCategory','saveHelper',
  function($scope,$location,translations,region,itemCategory,saveHelper) {
    'use strict';
    
    try {
      var noLocationMenu = [];
      var normalMenu = [
        {path: 'builds', name:'builds', icon: 'menu-hamburger'},
        {path: 'search', name:'search', icon: 'search'},
        ];
      
      var buildAction = {path: 'build', name:'build'};
      
      var withBuildMenu = [
        {path: 'builds', name:'builds', icon: 'menu-hamburger'},
        {path: 'search', name:'search', icon: 'search'},
        buildAction,
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
      
      $scope.isHttpOnly = function() {
        return location.protocol != 'https:' && location.hostname != 'localhost';
      }
        
      $scope.getActions = function() {
        try {
          var menu = null;
          
          var currentBuild = saveHelper.getCurrentBuild();
          if(currentBuild) {
            if(!$scope.savedItems || !(currentBuild in $scope.savedItems)) {
              // console.log('loading saved items');
              $scope.savedItems = saveHelper.getSavedItems();
            }
            
            if(!(currentBuild in $scope.savedItems)) {
              currentBuild = null;
            }
          }
    
          if(region.dntLocation != null && region.dntLocation.url == '') {
            menu = noLocationMenu; 
          }
          else if(region.tlocation != null && region.tlocation.url == '') {
            menu = noLocationMenu; 
          }
          else if(currentBuild && currentBuild != 'null') {
            menu = withBuildMenu;
            buildAction.path = 'build?buildName=' + currentBuild;
            buildAction.name = currentBuild;
            if(currentBuild in $scope.savedItems) {
              buildAction.build = $scope.savedItems[currentBuild];
            }
          }
          else if($location.path() == '/view-group' || region.dntLocation == null) {
            menu = normalMenu;
          }
          else {
            menu = normalMenu;
          }
          
          var path = $location.path;
          angular.forEach(menu, function(value, key) {
            delete value.extraCss;
            if(path && path.length == 1) {
              if(value.path.length == 1) {
                value.extraCss = 'active';
              }
            }
            else if(value.path && value.path.length > 1 && path.indexOf('/' + value.path) == 0) {
              if(value.path != 'builds' || path == '/builds') {
                value.extraCss = 'active';
              }
            }
          });
          
          return menu;
        }
        catch(ex) {
          $scope.simError = ex.message;
          console.error(ex);
        }
      };
    }
    catch(ex) {
      $scope.simError = ex.message;
      console.error(ex);
    }
  }
])
.directive('dngearsimNav', function() {
  return {
    template: require('./nav.html')
  };
});