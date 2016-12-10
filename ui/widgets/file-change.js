(function () {
'use strict';
angular.module('dnsim').directive('fileChange', ['$parse', fileChangeFunction]);

function fileChangeFunction($parse) {

    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {

        // Get the function provided in the file-change attribute.
        // Note the attribute has become an angular expression,
        // which is what we are parsing. The provided handler is 
        // wrapped up in an outer function (attrHandler) - we'll 
        // call the provided event handler inside the handler()
        // function below.
        var attrHandler = $parse(attrs['fileChange']);

        // This is a wrapper handler which will be attached to the
        // HTML change event.
        var handler = function (e) {

          $scope.$apply(function () {

            // Execute the provided handler in the directive's scope.
            // The files variable will be available for consumption
            // by the event handler.
            attrHandler($scope, { $event: e, files: e.target.files });
          });
        };

        // Attach the handler to the HTML change event 
        element[0].addEventListener('change', handler, false);
      }
    };
}

})();