(function () {
'use strict';
  
angular.module('dnsim').directive('dnsimCategoryLinks', dnsimCategoryLinks);

function dnsimCategoryLinks() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      collapse: '=collapse',
      cat: '=cat',
      buildScreen: '=buildScreen',
      onChange: '&onChange'
    },
    template: require('!raw-loader!./dnsim-category-links.html').default,
    controller: ['itemCategory', '$window', 'translations', '$translate', dnsimCategoryLinksController],
    controllerAs: 'ctrl',
  };
};

function dnsimCategoryLinksController(itemCategory, $window, translations, $translate) {

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

  vm.isLoading = function() {
    return !translations.loaded;
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

  vm.getName = function(action) {
    if(action.tId) {
      return translations.translate(action.tId).toLowerCase();
    }
    else {
      return $translate.instant(action.name);
    }
  }
}

})();
