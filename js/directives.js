var m = angular.module('directives', []);

m.directive('selectAllOnClick', [function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var hasSelectedAll = false;
      element.on('click', function($event) {
        if (!hasSelectedAll) {
          try {
            //IOs, Safari, thows exception on Chrome etc
            this.selectionStart = 0;
            this.selectionEnd = this.value.length + 1;
            hasSelectedAll = true;
          } catch (err) {
            //Non IOs option if not supported, e.g. Chrome
            this.select();
            hasSelectedAll = true;
          }
        }
      });
      //On blur reset hasSelectedAll to allow full select
      element.on('blur', function($event) {
        hasSelectedAll = false;
      });
    }
  };
}]);