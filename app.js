(function () {
'use strict';

angular
.module('dnsim', ['ngRoute'])
.config(['$routeProvider',config]);

function config($routeProvider) {

  $routeProvider.
  
    when('/about', {
      templateUrl: 'ui/about/about.html?bust=' + Math.random().toString(36).slice(2),
      controller: 'AboutCtrl as about'
    }).
    
    when('/setup', {
      templateUrl: 'ui/nav/setup.html?bust=' + Math.random().toString(36).slice(2),
      controller: 'SetupCtrl'
    }).
    when('/test', {
      templateUrl: 'ui/nav/test.html?bust=' + Math.random().toString(36).slice(2),
      controller: 'TestCtrl'
    }).
    
    when('/', {
      redirectTo: '/builds'
    }).
    when('/saved', {
      redirectTo: '/builds'
    }).
    when('/saved/:groupName', {
      redirectTo: '/builds/:groupName'
    }).
    when('/builds', {
      templateUrl: 'ui/builds/saved-items.html?bust=' + Math.random().toString(36).slice(2),
      controller: 'SavedCtrl'
    }).
    when('/builds/:groupName', {
      templateUrl: 'ui/builds/saved-items.html?bust=' + Math.random().toString(36).slice(2),
      controller: 'SavedCtrl'
    }).
    when('/view-group', {
      templateUrl: 'ui/builds/view-group.html?bust=' + Math.random().toString(36).slice(2),
      controller: 'ViewGroupCtrl'
    }).
    when('/edit-build/:groupName', {
      templateUrl: 'ui/builds/edit-build.html?bust=' + Math.random().toString(36).slice(2),
      controller: 'EditBuildCtrl as editGroup',
      reloadOnSearch: false,
    }).
    when('/new-build', {
      templateUrl: 'ui/builds/edit-build.html?bust=' + Math.random().toString(36).slice(2),
      controller: 'EditBuildCtrl as editGroup',
      reloadOnSearch: false,
    }).
    when('/delete-build/:name', {
      templateUrl: 'ui/builds/delete-build.html?bust=' + Math.random().toString(36).slice(2),
      controller: 'DeleteBuildCtrl as deleteBuild',
      reloadOnSearch: false,
    }).
    
    when('/item-search', {
      redirectTo: '/item-search/titles'
    }).
    when('/item-search/custom', {
      templateUrl: 'ui/search/custom-items.html?bust=' + Math.random().toString(36).slice(2),
      controller: 'CustomItemCtrl as customItems'
    }).
    when('/item-search/skills', {
      templateUrl: 'ui/search/skill-search.html?bust=' + Math.random().toString(36).slice(2),
      controller: 'SkillSearchCtrl as skillSearch'
    }).
    when('/item-search/:itemType', {
      templateUrl: 'ui/search/item-search.html?bust=' + Math.random().toString(36).slice(2),
      controller: 'ItemSearchCtrl'
    }).
    
    when('/item/:itemString', {
      templateUrl: 'ui/item/equipment.html?bust=' + Math.random().toString(36).slice(2),
      controller: 'EquipmentCtrl',
      reloadOnSearch: false,
    }).
    otherwise({
      redirectTo: '/builds'
    });
}

})();