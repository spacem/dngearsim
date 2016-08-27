(function () {
'use strict';
  
angular.module('dnsim').directive('dnsimCategoryLinks', ['itemCategory','$location', dnsimCategoryLinks]);

function dnsimCategoryLinks(itemCategory,$location) {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      collapse: '=collapse',
      cat: '=cat',
      onChange: '&onChange'
    },
    templateUrl: 'ui/widgets/dnsim-category-links.html',
    controller: ['itemCategory', dnsimCategoryLinksController],
    controllerAs: 'ctrl',
  };
};

function dnsimCategoryLinksController(itemCategory) {

  var vm = this;

  vm.categories = itemCategory.categories;
  vm.collapsed = true;

  vm.setCategory = function(action) {
    console.log('setting cat', action);
    vm.cat = action;
    localStorage.setItem('selectedItemCategory', action.name);
    
    if(vm.collapse) {
      vm.collapsed = !vm.collapsed;
    }

    if(vm.onChange) {
      vm.onChange();
    }
  }
}

})();
