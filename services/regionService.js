(function () {
'use strict';

angular.module('dnsim').factory('region', ['translations','dntReset','dntData','$route',region]);
function region(translations,dntReset,dntData,$route) {
  
  var alternativeFiles = {region: 'ALT', name: 'Alternative user specified files', url : ''};
  var hostedFiles =[
      {region: 'sea', name: 'south east asia', url : 'https://seadnfiles.firebaseapp.com'},
      {region: 'na', name: 'north america', url : 'https://dnna.firebaseapp.com'},
      {region: 'eu', name: 'europe', url : 'https://eufiles.firebaseapp.com'},
      {region: 'ina', name: 'indonesia ', url : 'https://inafiles-da491.firebaseapp.com'},
      {region: 'th', name: 'thailand', url : 'https://thdnfiles.firebaseapp.com'},
      {region: 'tw', name: 'taiwan 臺灣', url : 'https://twdnfiles.firebaseapp.com'},
      {region: 'cdn', name: 'china 中國', url : 'https://cdnfiles.firebaseapp.com'},
      {region: 'kdn', name: 'korea 대한민국', url : 'https://kdnfiles.firebaseapp.com'},
    ];
  
  var dntLocationRegion = localStorage.getItem('lastDNTRegion');
  var dntLocation = null;
  if(dntLocationRegion) {
    angular.forEach(hostedFiles, function(hostedFile, index) {
      if(hostedFile.region == dntLocationRegion) {
        dntLocation = hostedFile;
      }
    });
  }

  var lastTFile = localStorage.getItem('UIStrings_file');
  var tlocation = null;
  if(lastTFile) {
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
      // console.log('setting custom location');
      this.alternativeFiles.url = url;

      var newFiles = [];
      angular.forEach(hostedFiles, function(hostedFile, index) {
        if(hostedFile.region != alternativeFiles.region) {
          newFiles.push(hostedFile);
        }
      });
  
      newFiles.push(alternativeFiles);
      hostedFiles = newFiles;
      this.hostedFiles = newFiles;
    },
    
    setLocationByName: function(locationName) {
      var newLocation = null;
      
      angular.forEach(hostedFiles, function(hostedFile, index) {
        if(hostedFile.region == locationName) {
          newLocation = hostedFile;
        }
      });
        
      this.setLocation(newLocation);
    },
    
    setLocation: function(location) {
      if(location && location != this.dntLocation) {
        this.dntLocation = location;
        dntReset();
        localStorage.setItem('lastDNTRegion', location.region);
        dntReset();
        $route.reload();
      }

      if(this.tlocation == null) {
        this.setTLocation(location);
      }
      
      this.init();
      
      // $route.reload();
    },
    
    setTLocation: function(location) {
      
      if(location != this.tlocation) {
        
        this.tlocation = location;
        sessionStorage.removeItem('UIStrings');
        localStorage.removeItem('UIStrings_file');
        dntReset();
        translations.reset();
        if(location) {
          var override = this.getOverride();
          translations.small = !override;
          translations.location = this.tlocation.url;
          translations.init(function() {}, function() { $route.reload(); });
        }
      }
    },
    
    getOverride: function() {
      if(localStorage.getItem('tOverride')) {
        return true;
      }
      else {
        return false;
      }
    },
    
    setOverride: function(value) {
      if(!value) {
        localStorage.removeItem('tOverride');
      }
      else {
        localStorage.setItem('tOverride', '1');
      }
      this.setTLocation(this.dntLocation);
    },
    
    init: function() {
      if(this.getOverride()) {
        translations.small = false;
      }
      else {
        this.tLocation = this.dntLocation;
        translations.small = true;
      }
      
      if(this.tlocation) {
        translations.location = this.tlocation.url;
      }
      dntData.setLocation(this.dntLocation);
    }
  }
}

})();