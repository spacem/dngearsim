(function () {
'use strict';

angular.module('dnsim').directive('dnsimJobIcon', [dnsimJobIcon]);

function dnsimJobIcon() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      item: '=item',
      small: '=small'
    },
    templateUrl: 'ui/widgets/dnsim-job-icon.html',
    controller: dnsimJobIconController,
    controllerAs: 'ctrl'
  }
}

function dnsimJobIconController() {
  
  if(this.small) {
    this.sizeValue = '205px 205px';
    this.iconSize = 22;
    this.iconOffset = 0;
  }
  else {
    this.sizeValue = '410px 410px';
    this.iconSize = 44;
    this.iconOffset = 5;
  }

  this.getIconXPostion = function() {
    if(this.item && this.item.d && this.item.d.JobIcon > 0) {
      return ((this.item.d.JobIcon % 9) * this.iconSize) + this.iconOffset;
    }
    return 0;
  }
  
  this.getIconYPostion = function() {
    if(this.item && this.item.d && this.item.d.JobIcon > 0) {
      return (Math.floor(this.item.d.JobIcon / 9) * this.iconSize) + this.iconOffset;
    }
    return 0;
  }
}

})();
