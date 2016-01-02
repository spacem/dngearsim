angular.module('translationService', ['ngRoute']).
factory('translations', ['$routeParams',function($routeParams) {

  var dnTranslations = new DnTranslations();
  var tFile = 'uistring.zip';

  var completeCallback = [];
  var progressCallback = [];

  return {
    
    reset : function() {
      dnTranslations = new DnTranslations();
      dnTranslations.sizeLimit = 100;
      this.loaded = false;
      this.startedLoading = false;
      completeCallback = [];
      progressCallback = [];
    },
    
    loaded : false,
    startedLoading : false,
    
    location : null,
  
    init : function(progress, complete) {

      if(this.isLoaded()) {
        complete();
      }
      else {
        progressCallback = [];
        progressCallback.push(progress);
        completeCallback.push(complete);
  
        if(!this.startedLoading) {
          this.startedLoading = true;
          var t = this;
          
          var fileName = null;
          if(this.location != null && this.location != '') {
            fileName = this.location + '/' + tFile;
            
            if(fileName != localStorage.getItem("UIStrings_file")) {
              localStorage.removeItem('UIStrings');
              localStorage.removeItem('UIStrings_file');
            }
          }
          
          dnTranslations.loadDefaultFile(
            fileName, 
            function(msg) {
              angular.forEach(progressCallback, function(value, key) { value(msg); });
            }, 
            function() {
              t.loaded = true;
              angular.forEach(completeCallback, function(value, key) { value(); });
              completeCallback = [];
            },
            function(msg) {
              angular.forEach(progressCallback, function(value, key) { value(msg); });
            }
          );
        }
      }
    },
    
    isLoaded : function() {
      if(!this.loaded) {
        var fileName = this.location + '/' + tFile;
        
        if(fileName != localStorage.getItem("UIStrings_file")) {
          localStorage.removeItem('UIStrings');
          localStorage.removeItem('UIStrings_file');
        }

        this.loaded = dnTranslations.loadFromSession();
        if(this.loaded) {
          this.startedLoading = true;
        }
      }
      return this.loaded;
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