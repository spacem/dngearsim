angular.module('dnsim')
.controller('BoxesCtrl', 
  ['$window','$http','$routeParams','hCodeValues','region',
  function($window, $http, $routeParams, hCodeValues, region) {
    
    'use strict';
    
    var vm = this;
    
    this.box = $routeParams.box;
    document.body.className = 'default-back';
    $window.document.title = 'Boxes';
    
    console.log(region.dntLocation.url)
    $http.get(region.dntLocation.url + '/boxes.json').then(function(res) {
      vm.boxes = res.data;
    });
    
    this.getRankName = function(rank) {
      return hCodeValues.rankNames[rank].name;
    }
  }]
);
