(function () {
'use strict';

angular.module('dnsim').config(['$routeProvider', config]);

function config($routeProvider) {

  $routeProvider.
  
    when('/about', {
      template: require('!raw-loader!./about/about.html').default,
      controller: 'AboutCtrl as about'
    }).

    when('/desktop-setup', {
      template: require('!raw-loader!./desktop/desktop-setup.html').default,
      controller: 'DesktopSetupCtrl as ctrl'
    }).
    
    when('/setup', {
      template: require('!raw-loader!./nav/setup.html').default,
      controller: 'SetupCtrl'
    }).
    // when('/test', {
    //   template: require('!raw-loader!./nav/test.html').default,
    //   controller: 'TestCtrl'
    // }).
    
    when('/items', {
      template: require('!raw-loader!./search/everything-search.html').default,
      controller: 'ItemsCtrl as items',
      reloadOnSearch: false,
    }).
    
    when('/', {
      template: require('!raw-loader!./welcome.html').default,
    }).
    when('/builds', {
      template: require('!raw-loader!./builds/build-list.html').default,
      controller: 'BuildListCtrl as buildList'
    }).
    when('/build', {
      template: require('!raw-loader!./builds/build-list.html').default,
      controller: 'BuildListCtrl as buildList'
    }).
    when('/view-group', {
      template: require('!raw-loader!./builds/view-group.html').default,
      controller: 'ViewGroupCtrl'
    }).
    when('/edit-build', {
      template: require('!raw-loader!./builds/edit-build.html').default,
      controller: 'EditBuildCtrl as editGroup',
      // reloadOnSearch: false,
    }).
    when('/new-build', {
      template: require('!raw-loader!./builds/edit-build.html').default,
      controller: 'EditBuildCtrl as editGroup',
      // reloadOnSearch: false,
    }).
    when('/delete-build', {
      template: require('!raw-loader!./builds/delete-build.html').default,
      controller: 'DeleteBuildCtrl as deleteBuild',
      // reloadOnSearch: false,
    }).
    when('/reload-build', {
      template: require('!raw-loader!./builds/reload-build.html').default,
      controller: 'ReloadBuildCtrl as ctrl',
      // reloadOnSearch: false,
    }).
    
    when('/search', {
      template: require('!raw-loader!./search/search.html').default,
      controller: 'ItemSearchCtrl as ctrl',
      reloadOnSearch: false,
    }).
    
    when('/item', {
      template: require('!raw-loader!./item/item.html').default,
      controller: 'ItemCtrl',
      // reloadOnSearch: false,
    }).
    when('/item', {
      template: require('!raw-loader!./item/item.html').default,
      controller: 'ItemCtrl',
      // reloadOnSearch: false,
    }).
    
    when('/export', {
      template: require('!raw-loader!./nav/export.html').default,
      controller: 'ExportCtrl',
    }).
    
    when('/talismans', {
      template: require('!raw-loader!./builds/build-talismans.html').default,
      controller: 'BuildTalismansCtrl as ctrl',
    }).
    
    when('/publish', {
      template: require('!raw-loader!./online/publish.html').default,
      controller: 'PublishCtrl as ctrl',
    }).
    
    when('/profile', {
      template: require('!raw-loader!./online/profile.html').default,
      controller: 'ProfileCtrl as ctrl',
    }).
    
    when('/published', {
      template: require('!raw-loader!./online/published.html').default,
      controller: 'PublishedCtrl as ctrl',
    }).
    
    when('/import', {
      template: require('!raw-loader!./builds/build-import.html').default,
      controller: 'BuildImportCtrl as ctrl',
    }).
    
    when('/published', {
      template: require('!raw-loader!./online/published.html').default,
      controller: 'PublishedCtrl as ctrl',
    }).
    
    when('/build-search', {
      template: require('!raw-loader!./online/build-search.html').default,
      controller: 'BuildSearchCtrl as ctrl',
    }).
    
    otherwise({
      redirectTo: '/'
    });
}

})();