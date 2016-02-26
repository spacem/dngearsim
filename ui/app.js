'use strict';

/* App Module */

var dnGearSimApp = angular.module('dnGearSimApp', [
  'ngRoute',
  
  'aboutController',
  
  'savedItemsController',
  'viewGroupController',
  'useOptionsController',
  'editGroupController',
  
  'equipmentController',
  'itemEditPotentialController',
  'itemEditCustomController',
  'itemEditSkillController',
  'itemEditTalismanController',
  'itemEditSparkController',
  'itemEditTalismanController',
  'itemEditEnchantmentController',
  'groupAssignmentController',
  
  'navController',
  'setupController',
  'testController',
  
  'regionController',
  
  'customItemsController',
  'itemSearchController',
  'skillSearchController',
  
  'translationService',
  'dntServices',
  'jobService',
  'itemService',
  'saveService',
  'exportLinkServices',
  'groupServices',
  'regionService',
  
  'dnsimItemLink',
  'dnsimLoading',
  'dnsimSelectAllOnClick',
  'dnsimStats',
  'dnsimStringToNumber',

  'filters',
]);

dnGearSimApp.config(['$routeProvider',
  function($routeProvider) {
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
        templateUrl: 'ui/grouping/saved-items.html?bust=' + Math.random().toString(36).slice(2),
        controller: 'SavedCtrl'
      }).
      when('/builds/:groupName', {
        templateUrl: 'ui/grouping/saved-items.html?bust=' + Math.random().toString(36).slice(2),
        controller: 'SavedCtrl'
      }).
      when('/view-group', {
        templateUrl: 'ui/grouping/view-group.html?bust=' + Math.random().toString(36).slice(2),
        controller: 'ViewGroupCtrl'
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
        controller: 'EquipmentCtrl'
      }).
      otherwise({
        redirectTo: '/builds'
      });
  }]);