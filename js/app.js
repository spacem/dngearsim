'use strict';

/* App Module */

var dnGearSimApp = angular.module('dnGearSimApp', [
  'ngRoute',
  
  'navController',
  
  'setupController',
  'translationService',
  'savedItemController',
  
  'equipmentController',
  'useOptionsController',
  
  'dntServices',
  'itemService',
  'saveService',
  'itemSearchController',
  
  'directives',
]);

dnGearSimApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/setup', {
        templateUrl: 'partials/setup.html',
        controller: 'SetupCtrl'
      }).
      when('/saved', {
        templateUrl: 'partials/saved.html',
        controller: 'SavedCtrl'
      }).
      when('/item-search/:itemType', {
        templateUrl: 'partials/item-search.html',
        controller: 'ItemSearchCtrl'
      }).
      when('/equipment/:itemId', {
        templateUrl: 'partials/equipment.html',
        controller: 'EquipmentCtrl'
      }).
      otherwise({
        redirectTo: '/setup'
      });
  }]);