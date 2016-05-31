angular.module('dnsim').controller('quickAddCtrl',

['$timeout','statHelper','saveHelper','quickAdd','itemCategory','jobs','dntData','exportLinkHelper',
function($timeout,statHelper,saveHelper,quickAdd,itemCategory,jobs,dntData,exportLinkHelper) {
  'use strict';
  
  var vm = this;
  vm.startedForCat = '';
  vm.stepNumber = 0;
  vm.datas = [];
  vm.options = [];
  
  dntData.init('exchange.lzjson', null, function() {}, $timeout);
  
  this.setOptions = function() {
    if(vm.hasStarted()) {
      vm.options = quickAdd.getOptions(vm.category, vm.build, vm.datas);
      if(vm.options.length == 1) {
        vm.selectOption(vm.options[0]);
      }
    }
  }
  
  this.selectOption = function(value) {
    var data = quickAdd.createData(value, vm.category, vm.stepNumber)
    vm.datas.push(data);
    vm.stepNumber++;
    if(!quickAdd.isValidStepNumber(vm.category, vm.stepNumber)) {
      
      var newItem = quickAdd.getItem(vm.datas);
      var dntFiles = exportLinkHelper.getDntFiles(newItem);
      angular.forEach(dntFiles, function(columns, fileName) {
        dntData.init(fileName, columns, function() {}, function() { vm.tryToAddItem(dntFiles, newItem) });
      });
      vm.tryToAddItem(dntFiles, newItem);
    }
    else {
      vm.setOptions();
      console.log('setup next step');
    }
  }
  
  this.tryToAddItem = function(dntFiles, item) {
    if(!dntData.anyLoading()) {
      
      var allLoaded = true;
      angular.forEach(dntFiles, function(columns, fileName) {
        if(!dntData.isLoaded(fileName)) {
          allLoaded = false;
        }
      });
      
      if(allLoaded) {
        if(vm.datas.length > 0) {
          vm.cancel();
          var newItem = exportLinkHelper.reloadItem(item);
          saveHelper.saveItem(vm.buildName, newItem);
          vm.onChange();
        }
      }
    }
  }
  
  this.reset = function() {
    vm.stepNumber = 0;
    vm.datas = [];
    $timeout(function() {
      vm.setOptions();
    });
  }
  
  this.hasStarted = function() {
    return vm.startedForCat == vm.category.name;
  }
  
  this.start = function() {
    vm.startedForCat = vm.category.name;
    
    jobs.init(function() {}, vm.reset);
    itemCategory.init(vm.category.name, vm.reset);
  }
  
  this.hasOptions = function() {
    return quickAdd.hasOptions(vm.category, vm.build, []);
  }
  
  this.cancel = function() {
    vm.startedForCat = '';
    vm.reset();
  }
  
  this.back = function() {
    if(vm.stepNumber == 0) {
      vm.cancel();
    }
    else {
      do {
        vm.stepNumber--;
        vm.datas.pop();
        
        var testOptions = quickAdd.getOptions(vm.category, vm.build, vm.datas);
      } while(testOptions.length <= 1 && vm.stepNumber > 0);
      
      vm.setOptions();
    }
  }
  
}])
.directive('dngearsimQuickAdd', function() {
  return {
    scope: true,
    bindToController: {
      category: '=category',
      build: '=build',
      buildName: '=buildName',
      onChange: '&onChange',
    },
    controller: 'quickAddCtrl',
    controllerAs: 'quickAdd',
    templateUrl: 'ui/builds/quick-add.html'
  };
});