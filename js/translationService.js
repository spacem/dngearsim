angular.module('translationService', []).
factory('translations', [function() {

  var dnTranslations = new DnTranslations();
  var location = localStorage.getItem('location');
  var tFile = 'uistring.xml';

  var completeCallback = [];
  var progressCallback = [];
    
  return {
    
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
            location + '/' + tFile, 
            function(msg) {
              angular.forEach(progressCallback, function(value, key) { value(msg); });
            }, 
            function() {
              t.loaded = true;
              angular.forEach(completeCallback, function(value, key) { value(); });
            } );
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