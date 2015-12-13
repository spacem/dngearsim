angular.module('translationService', ['ngRoute']).
factory('translations', ['$routeParams', function($routeParams) {

  var dnTranslations = new DnTranslations();
  var tFile = 'uistring.xml';

  var completeCallback = [];
  var progressCallback = [];

  return {
    
    reset : function() {
      dnTranslations = new DnTranslations();
      this.loaded = false;
      this.startedLoading = false;
    },
    
    loaded : false,
    startedLoading : false,
  
    init : function(progress, complete) {

      if(this.loaded) {
        complete();
      }
      else {
        progressCallback.push(progress);
        completeCallback.push(complete);
  
        if(!this.startedLoading) {
          this.startedLoading = true;
          var t = this;
          
          dnTranslations.loadDefaultFile(
            $routeParams['location'] + '/' + tFile, 
            function(msg) {
              angular.forEach(progressCallback, function(value, key) { value(msg); });
            }, 
            function() {
              t.loaded = true;
              angular.forEach(completeCallback, function(value, key) { value(); });
            },
            function(msg) {
              angular.forEach(progressCallback, function(value, key) { value(msg); });
            }
            );
        }
      }
    },
    
    translate : function(value) {
      if(this.loaded) {
        return dnTranslations.translate(value);
      }
      else {
        return value;
      }
    }
  }
}]);