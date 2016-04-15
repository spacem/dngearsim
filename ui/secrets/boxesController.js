angular.module('dnsim')
.controller('BoxesCtrl', 
  ['$window','$http','$routeParams','hCodeValues','region','translations',
  function($window, $http, $routeParams, hCodeValues, region, translations) {
    
    'use strict';
    
    var vm = this;
    
    this.box = $routeParams.box;
    document.body.className = 'default-back';
    $window.document.title = 'Boxes';
    
    console.log(region.dntLocation.url)
    //$http.get(region.dntLocation.url + '/boxes.json').then(function(res) {
      //vm.boxes = res.data;
    //});
    $http.get('https://discord-bot-spacemh.c9users.io/firebase_na/public/charm-boxes.json').then(function(res) {
      vm.boxes = res.data;
    });
    
    this.getRankName = function(rank) {
      return hCodeValues.rankNames[rank].name;
    }
    
    this.translate = function(nameId, nameParam) {
      if(!nameId) {
        return 'unknown';
      }
      else 
      {
        var translated = translations.translate(nameId);
        if(translated.indexOf('{0}') == 0) {
          translated = translations.translate(nameParam);
        }
        
        return translated;
      }
    }
  }]
);
