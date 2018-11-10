(function () {
'use strict';

angular.module('dnsim').config(['$routeProvider', config]);

function config($routeProvider) {

  $routeProvider.
  
    when('/about', {
      templateUrl: 'ui/about/about.html',
      controller: 'AboutCtrl as about'
    }).
    
    when('/setup', {
      templateUrl: 'ui/nav/setup.html',
      controller: 'SetupCtrl'
    }).
    when('/test', {
      templateUrl: 'ui/nav/test.html',
      controller: 'TestCtrl'
    }).
    
    when('/items', {
      templateUrl: 'ui/search/everything-search.html',
      controller: 'ItemsCtrl as items',
      reloadOnSearch: false,
    }).
    
    when('/', {
      templateUrl: 'ui/welcome.html',
    }).
    when('/builds', {
      templateUrl: 'ui/builds/build-list.html',
      controller: 'BuildListCtrl as buildList'
    }).
    when('/build', {
      templateUrl: 'ui/builds/build-list.html',
      controller: 'BuildListCtrl as buildList'
    }).
    when('/view-group', {
      templateUrl: 'ui/builds/view-group.html',
      controller: 'ViewGroupCtrl'
    }).
    when('/edit-build', {
      templateUrl: 'ui/builds/edit-build.html',
      controller: 'EditBuildCtrl as editGroup',
      // reloadOnSearch: false,
    }).
    when('/new-build', {
      templateUrl: 'ui/builds/edit-build.html',
      controller: 'EditBuildCtrl as editGroup',
      // reloadOnSearch: false,
    }).
    when('/delete-build', {
      templateUrl: 'ui/builds/delete-build.html',
      controller: 'DeleteBuildCtrl as deleteBuild',
      // reloadOnSearch: false,
    }).
    when('/reload-build', {
      templateUrl: 'ui/builds/reload-build.html',
      controller: 'ReloadBuildCtrl as ctrl',
      // reloadOnSearch: false,
    }).
    
    when('/search', {
      templateUrl: 'ui/search/search.html',
      controller: 'ItemSearchCtrl as ctrl',
      reloadOnSearch: false,
    }).
    
    when('/item', {
      templateUrl: 'ui/item/item.html',
      controller: 'ItemCtrl',
      // reloadOnSearch: false,
    }).
    when('/item', {
      templateUrl: 'ui/item/item.html',
      controller: 'ItemCtrl',
      // reloadOnSearch: false,
    }).
    
    when('/export', {
      templateUrl: 'ui/nav/export.html',
      controller: 'ExportCtrl',
    }).
    
    when('/talismans', {
      templateUrl: 'ui/builds/build-talismans.html',
      controller: 'BuildTalismansCtrl as ctrl',
    }).
    
    when('/publish', {
      templateUrl: 'ui/online/publish.html',
      controller: 'PublishCtrl as ctrl',
    }).
    
    when('/profile', {
      templateUrl: 'ui/online/profile.html',
      controller: 'ProfileCtrl as ctrl',
    }).
    
    when('/published', {
      templateUrl: 'ui/online/published.html',
      controller: 'PublishedCtrl as ctrl',
    }).
    
    when('/import', {
      templateUrl: 'ui/builds/build-import.html',
      controller: 'BuildImportCtrl as ctrl',
    }).
    
    when('/published', {
      templateUrl: 'ui/online/published.html',
      controller: 'PublishedCtrl as ctrl',
    }).
    
    when('/build-search', {
      templateUrl: 'ui/online/build-search.html',
      controller: 'BuildSearchCtrl as ctrl',
    }).
    
    otherwise({
      redirectTo: '/'
    });
}

})();