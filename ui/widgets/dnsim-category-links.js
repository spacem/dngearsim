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
      buildScreen: '=buildScreen',
      onChange: '&onChange'
    },
    templateUrl: 'ui/widgets/dnsim-category-links.html',
    controller: ['itemCategory','$window', dnsimCategoryLinksController],
    controllerAs: 'ctrl',
  };
};

function dnsimCategoryLinksController(itemCategory, $window) {

  var vm = this;

  vm.categories = itemCategory.categories;
  vm.collapsed = true;

  vm.shouldShow = function(action) {
    if(vm.buildScreen) {
      return !action.hideInBuild;
    }
    else {
      return !action.hideInSearch;
    }
  }

  vm.setCategory = function(action) {
    
    if(vm.collapse) {
      // console.log('collapsing cat', action);
      vm.collapsed = !vm.collapsed;
      $window.scrollTo(0, 0);
    }
    
    // console.log('setting cat', action);
    if(vm.cat != action) {
      vm.cat = action;
      localStorage.setItem('selectedItemCategory', action.name);

      if(vm.onChange) {
        vm.onChange();
      }
    }
  }
}

})();
