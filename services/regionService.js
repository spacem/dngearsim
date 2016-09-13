(function () {
'use strict';

angular.module('dnsim').factory('region', ['translations','dntReset','dntData','$route',region]);
function region(translations,dntReset,dntData,$route) {
  
  var alternativeFiles = {region: 'ALT', name: 'Alternative user specified files', url : ''};
  var hostedFiles =[
      {region: 'na', name: 'english files from nexon north america', url : 'https://dnna.firebaseapp.com'},
      {region: 'kdn', name: 'korean files from pupu', url : 'https://kdnfiles.firebaseapp.com'},
      {region: 'cdn', name: 'chinese files from shanda', url : 'https://cdnfiles.firebaseapp.com'},
      {region: 'sea', name: 'south east asia - english files from cherry credits', url : 'https://seadnfiles.firebaseapp.com'},
      {region: 'eu', name: 'europe - english files from cherry credits', url : 'https://eufiles.firebaseapp.com'},
      {region: 'ina', name: 'indonesian files from gemscool', url : 'https://inafiles-da491.firebaseapp.com'},
    ];
  
  var dntLocationRegion = localStorage.getItem('lastDNTRegion');
  var dntLocation = hostedFiles[0];
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
        
        angular.forEach(this.translationResettingEvents, function(event, index) {
          event();
        });
        
        this.tlocation = location;
        sessionStorage.removeItem('UIStrings');
        localStorage.removeItem('UIStrings_file');
        dntReset();
        translations.reset();
        translations.location = this.tlocation.url;
        translations.init(function() {}, function() { $route.reload(); });
        // $route.reload();
      }
    },
    
    init: function() {
      if(this.tlocation) {
        translations.location = this.tlocation.url;
      }
      dntData.setLocation(this.dntLocation);
    }
  }
}

})();