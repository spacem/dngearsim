(function () {
'use strict';

angular.module('dnsim').directive('dngearsimCustomItems', function() {
  return {
    scope: {},
    bindToController: {
    },
    controller: ['$window','saveHelper','$location','hCodeValues','itemCategory','$timeout', customItemCtrl],
    controllerAs: 'customItems',
    templateUrl: 'ui/search/custom-items.html'
  };
});

function customItemCtrl($window,saveHelper,$location,hCodeValues,itemCategory,$timeout) {
  'use strict';

  var vm = this;
  
  this.customItems = hCodeValues.customItems;
  
  this.maxDisplay = 10;
  this.currentResults = 0;
  
  if(this.nameSearch == null) {
    this.nameSearch = '';
  }
  
  this.getResults = function() {
    return this.customItems;
  }
  
  this.getNewStatName = function() {
    if(this.nameSearch == '' || this.nameSearch == null) {
      return 'unnamed custom item';
    }
    else {
      return this.nameSearch;
    }
  }
  
  this.createCustomItem = function() {
    if(this.nameSearch == '' || this.nameSearch == null) {
      this.nameSearch = this.getNewStatName();
    }
    $location.path('/item/_custom:.' + this.nameSearch);
  }
}

})();