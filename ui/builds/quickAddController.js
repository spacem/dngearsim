angular.module('dnsim').controller('quickAddCtrl',

['$timeout','statHelper','saveHelper','quickAdd','itemCategory','jobs','dntData','exportLinkHelper',
function($timeout,statHelper,saveHelper,quickAdd,itemCategory,jobs,dntData,exportLinkHelper) {
  'use strict';
  
  var vm = this;
  this.startedForCat = '';
  this.stepNumber = 0;
  this.datas = [];
  this.options = [];
  
  dntData.init('exchange.lzjson', null, function() {}, $timeout);
  
  this.setOptions = function() {
    if(this.hasStarted()) {
      this.options = quickAdd.getOptions(this.category, this.build, this.datas);
      if(this.options.length == 1) {
        this.selectOption(this.options[0]);
      }
    }
  }
  
  this.selectOption = function(value) {
    var data = quickAdd.createData(value, this.category, this.stepNumber)
    this.datas.push(data);
    this.stepNumber++;
    if(!quickAdd.isValidStepNumber(this.category, this.stepNumber)) {
      
      var newItem = quickAdd.getItem(this.datas);
      var dntFiles = exportLinkHelper.getDntFiles(newItem);
      angular.forEach(dntFiles, function(columns, fileName) {
        dntData.init(fileName, columns, function() {}, function() { vm.tryToAddItem(dntFiles, newItem) });
      });
      vm.tryToAddItem(dntFiles, newItem);
    }
    else {
      this.setOptions();
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
    this.stepNumber = 0;
    this.datas = [];
    this.setOptions();
  }
  
  this.hasStarted = function() {
    return this.startedForCat == this.category.name;
  }
  
  this.start = function() {
    this.startedForCat = this.category.name;
    this.reset();
    
    jobs.init(function() {},function() {});
    itemCategory.init(this.category.name, function() {});
  }
  
  this.hasOptions = function() {
    return quickAdd.getOptions(this.category, this.build, []).length > 0;
  }
  
  this.cancel = function() {
    this.startedForCat = '';
    this.reset();
  }
  
  this.back = function() {
    if(this.stepNumber == 0) {
      this.cancel();
    }
    else {
      this.stepNumber--;
      this.datas.pop();
      this.setOptions();
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
    templateUrl: 'ui/builds/quick-add.html?bust=' + Math.random().toString(36).slice(2)
  };
});