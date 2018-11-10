(function () {
'use strict';

angular.module('dnsim').directive('dnsimStats', ['hCodeValues','$translate',dnsimStats]);

function dnsimStats(hCodeValues, $translate) {
  return {
    restrict: 'A',
    scope: {
      stats: '=stats',
      build: '=build',
      altStats: '=altStats',
      separator: '=separator',
      filter: '=filter',
      numInSet: '=numInSet'
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

        // get stats that are used to summarise
        var summaryForStats = {};
        angular.forEach(stats, function(stat, key) {
          var def = hCodeValues.stats[stat.id];
          if(def && def.summaryFor) {
            summaryForStats[def.summaryFor] = stat;
          }
        });
        
        angular.forEach(stats, function(stat, key) {
          var output = '';

          // console.log('processing stat', stat);
          
          if(stat.id in hCodeValues.stats) {
            
            var def = hCodeValues.stats[stat.id];
            if(!$scope.filter && 'hide' in def && def.hide) {
              return;
            }
            
            if($scope.filter && !def[$scope.filter]) {
              return;
            }

            if(def.summaryFor) {
              return;
            }
            // console.log('no summaryFor');

            // hide when the hideIf stat exists
            if('hideIf' in def && def.hideIf > 0) {
              var hideStat = _.find(stats, function(s) {
                return s.id == def.hideIf;
              });
              if(hideStat) {
                return;
              }
            }

            // hide when stat is added
            var statAddTo = _.find(stats, function(s) {
              var addToDef = hCodeValues.stats[s.id];
              if (!addToDef) {
                console.log('cannot find stat id', s.id)
              } else {
                return addToDef.addTo == def.id;
              }
            });

            if(statAddTo) {
              return;
            }

            // alter stat when addTo is set
            if('addTo' in def && def.addTo > 0) {
              var addStat = _.find(stats, function(s) {
                return s.id == def.addTo;
              });
              if(addStat) {
                stat = _.clone(stat);
                stat.max += addStat.max;
              }
            }
            
            if(!first) {
              output += sep;
            }
            first = false;
          
            if('needSetNum' in stat) {
              if(stat.needSetNum <= $scope.numInSet) {
                output += '*';
              }
              output += stat.needSetNum + '&nbsp;';
            }

            output += '<strong>';
            
            if($scope.build) {
              if(def.element == 'primary') {
                var eleId = 0;
                if($scope.build.element) {
                  eleId = $scope.build.element.id;
                }
                output += $translate.instant(hCodeValues.elements[eleId].name) + '&nbsp;';
              }
              else if(def.element == 'secondary') {
                var eleId = 0;
                if($scope.build.secondaryElement) {
                  eleId = $scope.build.secondaryElement.id;
                }
                output += $translate.instant(hCodeValues.elements[eleId].name) + '&nbsp;';
              }
            }
            
            output += $translate.instant(def.name)+':</strong>&nbsp;'+def.display(stat);
            if(def.combineWith > 0) {
              angular.forEach(stats, function(stat2, key2) {
                if(stat2.id == def.combineWith) {

                  // alter stat when addTo is set
                  if('addTo' in def && def.addTo > 0) {
                    var addStat2 = _.find(stats, function(s) {
                      return s.id == def.addTo;
                    });
                    if(addStat2) {
                      stat2 = _.clone(stat2);
                      stat2.max += addStat2.max;
                    }
                  }

                  if(stat2.max != stat.max) {
                    output += '-' + def.display(stat2);
                  }
                }
              });
            }

            if(stat.id in summaryForStats) {
              var sStat = summaryForStats[stat.id];
              var sDef = hCodeValues.stats[sStat.id];
              output += '&nbsp;|&nbsp;<em>' + sDef.display(sStat);
              output += '</em>';
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
      
      $scope.$watch('numInSet', function(newValue, oldValue) {
        if (newValue >= 0) {
          showStats();
        }
      });
    }
  }
}

})();