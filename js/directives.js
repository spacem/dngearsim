var m = angular.module('directives', ['ui.bootstrap']);

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

m.directive('dnsimItemLink', ['$uibModal', function($uibModal) {
  return {
    restrict: 'E',
    scope: {
      item: '=item',
      onClose: '&onClose'
    },
    templateUrl: 'components/item-link.html',
    link: function($scope, element, attrs) {
      $scope.open = function () {
        var modalInstance = $uibModal.open({
          animation: false,
          backdrop : false,
          keyboard : true,
          templateUrl: 'partials/equipment.html?bust=' + Math.random().toString(36).slice(2),
          controller: 'EquipmentCtrl',
          size: 'lg',
          resolve: {
            item: function () {
              return $scope.item;
            }
          }
        });
        
        modalInstance.result.then(function (selectedItem) {}, function () {
          $scope.onClose();
        });
      }
    },
  };
}]);

m.directive('dnsimStats', ['hCodeValues',function(hCodeValues) {
  return {
    restrict: 'A',
    scope: {
      stats: '=stats',
      altStats: '=altStats',
      separator: '=separator',
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
            
            if(!first) {
              output += sep;
            }
            first = false;
          
            if('needSetNum' in stat) {
              output += stat.needSetNum + '-Increases&nbsp;';
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
}]);