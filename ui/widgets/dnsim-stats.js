(function () {
'use strict';

angular.module('dnsim').directive('dnsimStats', ['hCodeValues',dnsimStats]);

function dnsimStats(hCodeValues) {
  return {
    restrict: 'A',
    scope: {
      stats: '=stats',
      build: '=build',
      altStats: '=altStats',
      separator: '=separator',
      filter: '=filter',
    },
    link: function($scope, element, attrs) {
      
      var sep;
      if(!$scope.separator) {
        sep = '';
      }
      else {
        sep = '&nbsp;' + $scope.separator + ' ';
      }
      
      var addedElements = [];
      var originalDisplay = element.css('display');
      
      function showStats() {
        element.css('display', 'none' );
        var stats = $scope.stats;
        if(!stats) {
          stats = $scope.altStats;
        }
        
        angular.forEach(addedElements, function(value, key) {
          value.remove();
        });
        
        var first = true;
        var lastElement = element;
        
        function append(text) {
          var newElement = element.clone();
          newElement.css('display', originalDisplay);
          newElement.html(text);
          
          lastElement.after(newElement);
          lastElement = newElement;
          addedElements.push(newElement);
        }
        
        angular.forEach(stats, function(stat, key) {
          var output = '';
          
          if(stat.id in hCodeValues.stats) {
            
            var def = hCodeValues.stats[stat.id];
            if('hide' in def && def.hide) {
              return;
            }
            
            if($scope.filter && !def[$scope.filter]) {
              return;
            }
            
            if(!first) {
              output += sep;
            }
            first = false;
          
            if('needSetNum' in stat) {
              output += stat.needSetNum + '&nbsp;';
            }
            
            if($scope.build) {
              if(def.element == 'primary') {
                var eleId = 0;
                if($scope.build.element) {
                  eleId = $scope.build.element.id;
                }
                output += hCodeValues.elements[eleId].name + '&nbsp;';
              }
              else if(def.element == 'secondary') {
                var eleId = 0;
                if($scope.build.secondaryElement) {
                  eleId = $scope.build.secondaryElement.id;
                }
                output += hCodeValues.elements[eleId].name + '&nbsp;';
              }
            }
            
            output += def.name+':&nbsp;'+def.display(stat);
            if(def.combineWith > 0) {
              angular.forEach(stats, function(stat2, key2) {
                if(stat2.id == def.combineWith) {
                  if(stat2.max != stat.max) {
                    output += '-' + def.display(stat2);
                  }
                  return;
                }
              });
            }
          }
          else {
            if(!first) {
              output += sep;
            }
            first = false;
          
            if('needSetNum' in stat) {
              output += stat.needSetNum + '-Increases&nbsp;';
            }
            
            output += stat.id+':&nbsp;'+stat.max;
          }
          
          append(output);
        });
      }
        
      $scope.$watch('stats', function(newValue, oldValue) {
        if (newValue) {
          showStats();
        }
      });
      
      $scope.$watch('altStats', function(newValue, oldValue) {
        if (newValue) {
          showStats();
        }
      });
    }
  }
}

})();