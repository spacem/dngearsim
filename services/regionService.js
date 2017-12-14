(function () {
'use strict';

angular.module('dnsim').factory('region', ['translations','dntReset','dntData','$route',region]);
function region(translations,dntReset,dntData,$route) {
  
  var alternativeFiles = {region: 'ALT', name: 'Alternative user specified files', url : ''};
  var hostedFiles =[
    {region: 'sea', name: 'south east asia', url : 'https://seadnfiles.netlify.com/public'},
      {region: 'na', name: 'north america', url : 'https://nadnfiles.netlify.com/public'},
      {region: 'eu', name: 'europe', url : 'https://eudnfiles.netlify.com/public'},
      {region: 'th', name: 'thailand', url : 'https://thdnfiles.netlify.com/public'},
      {region: 'vn', name: 'vietnam ', url : 'https://vndnfiles.firebaseapp.com'},
      {region: 'tw', name: 'taiwan 臺灣', url : 'https://twdnfiles.firebaseapp.com'},
      // {region: 'jdn', name: 'japan 日本', url : 'https://jdnfiles-59d57.firebaseapp.com'},
      {region: 'cdn', name: 'china 中國', url : 'https://cdnfiles.netlify.com/public'},
      {region: 'kdn', name: 'korea 대한민국', url : 'https://kdnfiles.netlify.com/public'},
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

      var override = this.getOverride();
      if(this.tlocation == null || !override) {
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
          translations.region = this.tlocation.region;
          translations.init(function() {}, function() {
            $route.reload();
          });
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
        translations.region = this.tlocation.region;
      }
      dntData.setLocation(this.dntLocation);
    }
  }
}

})();