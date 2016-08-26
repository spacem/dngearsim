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
    
    when('/items/', {
      templateUrl: 'ui/secrets/items.html',
      controller: 'ItemsCtrl as items'
    }).
    
    when('/', {
      redirectTo: '/builds'
    }).
    when('/builds', {
      templateUrl: 'ui/builds/build-list.html',
      controller: 'BuildListCtrl as buildList'
    }).
    when('/build/:groupName*', {
      templateUrl: 'ui/builds/build-list.html',
      controller: 'BuildListCtrl as buildList'
    }).
    when('/view-group/:region?', {
      templateUrl: 'ui/builds/view-group.html',
      controller: 'ViewGroupCtrl'
    }).
    when('/edit-build/:groupName*', {
      templateUrl: 'ui/builds/edit-build.html',
      controller: 'EditBuildCtrl as editGroup',
      reloadOnSearch: false,
    }).
    when('/new-build', {
      templateUrl: 'ui/builds/edit-build.html',
      controller: 'EditBuildCtrl as editGroup',
      reloadOnSearch: false,
    }).
    when('/delete-build/:name*', {
      templateUrl: 'ui/builds/delete-build.html',
      controller: 'DeleteBuildCtrl as deleteBuild',
      reloadOnSearch: false,
    }).
    
    when('/item-search', {
      redirectTo: '/search'
    }).
    when('/item-search/:itemType', {
      redirectTo: '/search/:itemType'
    }).
    
    when('/search', {
      templateUrl: 'ui/search/item-search.html',
      controller: 'ItemSearchCtrl'
    }).
    when('/search/custom', {
      templateUrl: 'ui/search/custom-items.html',
      controller: 'CustomItemCtrl as customItems'
    }).
    when('/search/skills', {
      templateUrl: 'ui/search/skill-search.html',
      controller: 'SkillSearchCtrl as skillSearch'
    }).
    when('/search/:itemType*', {
      templateUrl: 'ui/search/item-search.html',
      controller: 'ItemSearchCtrl'
    }).
    
    when('/item/:region?/:itemString*', {
      templateUrl: 'ui/item/item.html',
      controller: 'ItemCtrl',
      reloadOnSearch: false,
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
    
    when('/publish', {
      templateUrl: 'ui/online/publish.html',
      controller: 'PublishCtrl as ctrl',
    }).
    
    when('/profile/:uid', {
      templateUrl: 'ui/online/profile.html',
      controller: 'ProfileCtrl as ctrl',
    }).
    
    when('/published/:uid/:buildName*', {
      templateUrl: 'ui/online/published.html',
      controller: 'PublishedCtrl as ctrl',
    }).
    
    when('/build-search/:jobId?', {
      templateUrl: 'ui/online/build-search.html',
      controller: 'BuildSearchCtrl as ctrl',
    }).
    
    otherwise({
      redirectTo: '/builds'
    });
}

})();