'use strict';

/* App Module */

var dnGearSimApp = angular.module('dnGearSimApp', [
  'ngRoute',
  'equipControllers',
  'translationService',
  'dntServices',
]);

dnGearSimApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/euip', {
        templateUrl: 'partials/equip.html',
        controller: 'EquipCtrl'
      }).
      when('/euip/:phoneId', {
        templateUrl: 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).
      otherwise({
        redirectTo: '/euip'
      });
  }]);