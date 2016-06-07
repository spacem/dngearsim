(function () {
'use strict';

// templates are imported via gulp job
angular.module('templates', []);

angular
.module('dnsim', ['ngRoute','ngAnimate','angulartics','angulartics.google.analytics','templates'])
.config(['$routeProvider','$analyticsProvider',config]);

function config($routeProvider, $analyticsProvider) {

  // $analyticsProvider.virtualPageviews(false);
  
  var cacheFix = '';
  if(false) {
    cacheFix = '?bust=' + Math.random().toString(36).slice(2);
  }

  $routeProvider.
  
    when('/about', {
      templateUrl: 'ui/about/about.html' + cacheFix,
      controller: 'AboutCtrl as about'
    }).
    
    when('/setup', {
      templateUrl: 'ui/nav/setup.html' + cacheFix,
      controller: 'SetupCtrl'
    }).
    when('/test', {
      templateUrl: 'ui/nav/test.html' + cacheFix,
      controller: 'TestCtrl'
    }).
    
    when('/items/', {
      templateUrl: 'ui/secrets/items.html' + cacheFix,
      controller: 'ItemsCtrl as items'
    }).
    
    when('/', {
      redirectTo: '/builds'
    }).
    when('/saved', {
      redirectTo: '/builds'
    }).
    when('/saved/:groupName*', {
      redirectTo: '/builds/:groupName'
    }).
    when('/builds', {
      templateUrl: 'ui/builds/build-list.html' + cacheFix,
      controller: 'BuildListCtrl as buildList'
    }).
    when('/builds/:groupName*', {
      templateUrl: 'ui/builds/build-list.html' + cacheFix,
      controller: 'BuildListCtrl as buildList'
    }).
    when('/view-group/:region?', {
      templateUrl: 'ui/builds/view-group.html' + cacheFix,
      controller: 'ViewGroupCtrl'
    }).
    when('/edit-build/:groupName*', {
      templateUrl: 'ui/builds/edit-build.html' + cacheFix,
      controller: 'EditBuildCtrl as editGroup',
      reloadOnSearch: false,
    }).
    when('/new-build', {
      templateUrl: 'ui/builds/edit-build.html' + cacheFix,
      controller: 'EditBuildCtrl as editGroup',
      reloadOnSearch: false,
    }).
    when('/delete-build/:name*', {
      templateUrl: 'ui/builds/delete-build.html' + cacheFix,
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
      templateUrl: 'ui/search/item-search.html' + cacheFix,
      controller: 'ItemSearchCtrl'
    }).
    when('/search/custom', {
      templateUrl: 'ui/search/custom-items.html' + cacheFix,
      controller: 'CustomItemCtrl as customItems'
    }).
    when('/search/skills', {
      templateUrl: 'ui/search/skill-search.html' + cacheFix,
      controller: 'SkillSearchCtrl as skillSearch'
    }).
    when('/search/:itemType*', {
      templateUrl: 'ui/search/item-search.html' + cacheFix,
      controller: 'ItemSearchCtrl'
    }).
    
    when('/item/:region?/:itemString*', {
      templateUrl: 'ui/item/equipment.html' + cacheFix,
      controller: 'EquipmentCtrl',
      reloadOnSearch: false,
    }).
    
    when('/export', {
      templateUrl: 'ui/nav/export.html' + cacheFix,
      controller: 'ExportCtrl',
    }).
    
    when('/talismans', {
      templateUrl: 'ui/builds/build-talismans.html' + cacheFix,
      controller: 'BuildTalismansCtrl as ctrl',
    }).
    
    otherwise({
      redirectTo: '/builds'
    });
}

})();