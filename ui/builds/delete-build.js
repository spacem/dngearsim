angular.module('dnsim').controller('DeleteBuildCtrl',

['$location','$routeParams','$timeout','saveHelper','dntData','jobs','hCodeValues','itemColumnsToLoad',
function($location,$routeParams,$timeout,saveHelper,dntData,jobs,hCodeValues,itemColumnsToLoad) {
  'use strict';
  
  var vm = this;
  this.newGroup = true;
  if('name' in $routeParams) {
      this.name = $routeParams.name;
  }
  
  this.delete = function() {
    saveHelper.deleteBuild(this.name);
    $location.path('/builds/');
  }
    
}]); 