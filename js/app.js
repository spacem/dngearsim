'use strict';

/* App Module */

var dnGearSimApp = angular.module('dnGearSimApp', [
  'ngRoute',
  'setupController',
  'equipmentController',
  'itemSearchController',
  'translationService',
  'navController',
  'savedItemController',
  'dntServices',
  'itemService',
  'saveService',
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