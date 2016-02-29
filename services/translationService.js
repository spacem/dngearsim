(function () {
'use strict';

angular.module('dnsim').factory('translations', ['$routeParams', '$rootScope', translations]);
function translations($routeParams, $rootScope) {

  var dnTranslations = new DnTranslations();
  var tFile = 'uistring.lzjson';

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
              sessionStorage.removeItem('UIStrings');
              localStorage.removeItem('UIStrings_file');
            }
          }
          
          $rootScope.$broadcast('TRANSLATION_LOAD_EVENT');
          dnTranslations.loadDefaultFile(
            fileName, 
            function(msg) {
              angular.forEach(progressCallback, function(value, key) { value(msg); });
            }, 
            function() {
              t.loaded = true;
              angular.forEach(completeCallback, function(value, key) { value(); });
              completeCallback = [];
              $rootScope.$broadcast('TRANSLATION_LOAD_EVENT');
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
          sessionStorage.removeItem('UIStrings');
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
}

})();