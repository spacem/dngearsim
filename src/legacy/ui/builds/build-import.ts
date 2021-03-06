angular.module('dnsim').controller('BuildImportCtrl',

['$timeout','$location','saveHelper',
function($timeout,$location,saveHelper) {
  'use strict';
  
  var vm = this;
  
  vm.onFileChange = onFileChange;
  vm.copyLocally = copyLocally;
  
  function onFileChange(event) {
    var files = event.target.files;
    console.log('importing files', files);
    if(files && files.length) {
      
      var fileName = files[0].name;
      var reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = function() {
        vm.build = JSON.parse(reader.result as string);
        if(fileName && fileName.length > 5) {
          vm.buildName = fileName.substr(0, fileName.length-5);
          vm.buildName = vm.buildName.replace('dngearsim-', '')
        }
        else {
          vm.buildName = 'imported build';
        }
        $timeout();
      }
    }
  }
  
  function copyLocally() {
    var newGroupName = saveHelper.importGroup(vm.buildName, vm.build.items);
    
    saveHelper.saveBuild(
      newGroupName, 
      newGroupName,
      vm.build);
      
    $location.path('/build');
    $location.search('buildName', newGroupName);
  }
}]);