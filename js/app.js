'use strict';

/* App Module */

var dnGearSimApp = angular.module('dnGearSimApp', [
  'ngRoute',
  
  'navController',
  'regionController',
  
  'setupController',
  'savedItemController',
  'viewGroupController',
  
  'equipmentController',
  'useOptionsController',
  'editGroupController',
  
  'translationService',
  'dntServices',
  'itemService',
  'saveService',
  'exportLinkServices',
  'regionService',
  
  'itemSearchController',
  'customItemController',
  'aboutController',
  
  'directives',
  'filters',
]);

dnGearSimApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/about.html',
        controller: 'AboutCtrl as about'
      }).
      when('/setup', {
        templateUrl: 'partials/setup.html',
        controller: 'SetupCtrl'
      }).
      when('/saved', {
        templateUrl: 'partials/saved.html',
        controller: 'SavedCtrl'
      }).
      when('/saved/:groupName', {
        templateUrl: 'partials/saved.html',
        controller: 'SavedCtrl'
      }).
      when('/item-search', {
        redirectTo: '/item-search/titles'
      }).
      when('/item-search/custom', {
        templateUrl: 'partials/custom-items.html',
        controller: 'CustomItemCtrl as customItems'
      }).
      when('/item-search/:itemType', {
        templateUrl: 'partials/item-search.html',
        controller: 'ItemSearchCtrl'
      }).
      when('/equipment/:itemId', {
        templateUrl: 'partials/equipment.html',
        controller: 'EquipmentCtrl'
      }).
      when('/view-group', {
        templateUrl: 'partials/view-group.html',
        controller: 'ViewGroupCtrl'
      }).
      otherwise({
        redirectTo: '/saved'
      });
  }]);