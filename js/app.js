'use strict';

/* App Module */

var dnGearSimApp = angular.module('dnGearSimApp', [
  'ngRoute',
  'setupController',
  'equipControllers',
  'translationService',
  'dntServices',
  'navController',
]);

dnGearSimApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/setup', {
        templateUrl: 'partials/setup.html',
        controller: 'SetupCtrl'
      }).
      when('/equip', {
        templateUrl: 'partials/equip.html',
        controller: 'EquipCtrl'
      }).
      when('/euip/:phoneId', {
        templateUrl: 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).
      otherwise({
        redirectTo: '/setup'
      });
  }]);