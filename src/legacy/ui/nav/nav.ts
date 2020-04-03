angular.module('dnsim').controller('NavCtrl', 
  ['$scope','$location','translations','region','saveHelper',
  function($scope,$location,translations,region,saveHelper) {
    'use strict';
    
    try {
      var noLocationMenu = [];
      var normalMenu = [
        {path: 'builds', name:'builds', icon: 'menu-hamburger'},
        {path: 'search', name:'search', icon: 'search'},
        ];
      
      var buildAction = {path: 'build', name: 'build', build: undefined};
      
      var withBuildMenu = [
        {path: 'builds', name:'builds', icon: 'menu-hamburger'},
        {path: 'search', name:'search', icon: 'search'},
        buildAction,
        ];
        
      region.init();

      $scope.isSelected = function(actionPath) {
        var path =$location.path();
        if ('/' + actionPath == path) {
          return true;
        } else if(path == '/build' && actionPath == buildAction.path) {
          return true;
        }
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
      
      $scope.altRegion = function() {
        return region.dntLocation && region.dntLocation.region == 'ALT';
      }
      
      $scope.isHttpOnly = function() {
        return location.protocol != 'https:' && location.hostname != 'localhost';
      }
      
      $scope.isDotCom = function() {
        return location.hostname.indexOf('.netlify.com') !== -1;
      }

      $scope.isDotApp = function() {
        return location.hostname.indexOf('.netlify.app') !== -1;
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
            buildAction.path = 'build?buildName=' + encodeURIComponent(currentBuild);
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
    template: require('!raw-loader!./nav.html').default
  };
});