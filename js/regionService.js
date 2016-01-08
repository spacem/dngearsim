var m = angular.module('regionService', []);
m.factory('region', ['translations','dntReset','dntData','$route',function(translations,dntReset,dntData,$route) {
  
  var alternativeFiles = {region: 'ALT', name: 'Alternative user specified files', url : ''};
  
  var hostedFiles =[
      {region: 'NA', name: 'English files from Nexon North America', url : 'https://dnna.firebaseapp.com'},
      {region: 'CDN', name: 'Chinese files from Shanda', url : 'https://dnfiles.firebaseapp.com/cdn'},
      {region: 'SEA', name: 'South East Asia - English files from Cherry Credits', url : 'https://dnfiles.firebaseapp.com/sea'},
      alternativeFiles,
    ];
  
  var dntLocationRegion = localStorage.getItem('lastDNTRegion');
  var dntLocation = hostedFiles[0];
  if(dntLocationRegion != null) {
    angular.forEach(hostedFiles, function(hostedFile, index) {
      if(hostedFile.region == dntLocationRegion) {
        dntLocation = hostedFile;
        return;
      }
    });
  }

  var lastTFile = localStorage.getItem('UIStrings_file');
  var tlocation = null;
  if(lastTFile != null) {
    angular.forEach(hostedFiles, function(hostedFile, index) {
      if(hostedFile.region != alternativeFiles.region && lastTFile.indexOf(hostedFile.url) > -1) {
        tlocation = hostedFile;
        return;
      }
    });
  }
  
  if(tlocation == null) {
    tlocation = dntLocation;
  }

  return {
    hostedFiles : hostedFiles,
    alternativeFiles : alternativeFiles,
    dntLocation : dntLocation,
    tlocation : tlocation,
    
    setCustomUrl: function(url) {
      this.alternativeFiles.url = url;
    },
    
    setLocation: function(location) {
      if(location != this.dntLocation) {
        this.dntLocation = location;
        dntReset();
        localStorage.setItem('lastDNTRegion', location.region);
      }

      if(this.tlocation == null) {
        this.setTLocation(location);
      }
      
      this.init();
      
      // $route.reload();
    },
    
    setTLocation: function(location) {
      
      if(location != this.tlocation) {
        
        angular.forEach(this.translationResettingEvents, function(event, index) {
          event();
        });
        
        this.tlocation = location;
        localStorage.removeItem('UIStrings');
        localStorage.removeItem('UIStrings_file');
        dntReset();
        translations.reset();
        translations.location = this.tlocation.url;
        translations.init(function() {}, function() { $route.reload(); });
        // $route.reload();
      }
    },
    
    init: function() {
      if(this.tlocation != null) {
        translations.location = this.tlocation.url;
      }
      dntData.setLocation(this.dntLocation);
    }
  }
}]);