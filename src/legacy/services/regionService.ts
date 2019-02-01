import { Region } from 'src/models/region';

angular.module('dnsim').factory('region', ['translations', 'dntReset', 'dntData', '$route', region]);
function region(translations, dntReset, dntData, $route) {

  const alternativeFiles: Region = { region: 'ALT', name: 'Alternative user specified files', url: '' };
  let hostedFiles: Region[] = [
    { region: 'sea', name: 'south east asia', url: 'https://seadnfiles.netlify.com/public' },
    { region: 'na', name: 'north america', url: 'https://nadnfiles.netlify.com/public' },
    { region: 'eu', name: 'europe', url: 'https://eudnfiles.netlify.com/public' },
    { region: 'th', name: 'thailand', url: 'https://thdnfiles.netlify.com/public' },
    // {region: 'vn', name: 'vietnam ', url : 'https://vndnfiles.firebaseapp.com'},
    { region: 'tw', name: 'taiwan 臺灣', url: 'https://tdnfiles.netlify.com/public' },
    // {region: 'jdn', name: 'japan 日本', url : 'https://jdnfiles-59d57.firebaseapp.com'},
    { region: 'cdn', name: 'china 中國', url: 'https://cdnfiles.netlify.com/public' },
    { region: 'kdn', name: 'korea 대한민국', url: 'https://kdnfiles.netlify.com/public' },
    { region: 'br', name: 'Brazil', url: 'https://dnbr.netlify.com/public' },
  ];

  const dntLocationRegion: string = localStorage.getItem('lastDNTRegion');
  let dntLocation: Region = null;
  if (dntLocationRegion) {
    for (const hostedFile of hostedFiles) {
      if (hostedFile.region === dntLocationRegion) {
        dntLocation = hostedFile;
      }
    }
  }

  const lastTFile = localStorage.getItem('UIStrings_file');
  let tlocation: Region = null;
  if (lastTFile) {
    for (const hostedFile of hostedFiles) {
      if (hostedFile.region !== alternativeFiles.region && lastTFile.indexOf(hostedFile.url) > -1) {
        tlocation = hostedFile;
      }
    }
  }

  if (tlocation == null) {
    tlocation = dntLocation;
  }

  return {
    hostedFiles: hostedFiles,
    alternativeFiles: alternativeFiles,
    dntLocation: dntLocation,
    tlocation: tlocation,

    setCustomUrl: function (url) {
      // console.log('setting custom location');
      this.alternativeFiles.url = url;

      const newFiles = [];
      for (const hostedFile of hostedFiles) {
        if (hostedFile.region !== alternativeFiles.region) {
          newFiles.push(hostedFile);
        }
      }

      newFiles.push(alternativeFiles);
      hostedFiles = newFiles;
      this.hostedFiles = newFiles;
    },

    setLocationByName: function (locationName: string) {
      let newLocation = null;

      for (const hostedFile of hostedFiles) {
        if (hostedFile.region === locationName) {
          newLocation = hostedFile;
        }
      }

      this.setLocation(newLocation);
    },

    setLocation: function (location: Region) {
      if (location && location !== this.dntLocation) {
        this.dntLocation = location;
        dntReset();
        localStorage.setItem('lastDNTRegion', location.region);
        dntReset();
        $route.reload();
      }

      const override = this.getOverride();
      if (this.tlocation == null || !override) {
        this.setTLocation(location);
      }

      this.init();

      // $route.reload();
    },

    setTLocation: function (location: Region) {

      if (location !== this.tlocation) {

        this.tlocation = location;
        sessionStorage.removeItem('UIStrings');
        localStorage.removeItem('UIStrings_file');
        dntReset();
        translations.reset();
        if (location) {
          const override = this.getOverride();
          translations.small = !override;
          translations.location = this.tlocation.url;
          translations.region = this.tlocation.region;
          translations.init(function () { }, function () {
            $route.reload();
          });
        }
      }
    },

    getOverride: function () {
      if (localStorage.getItem('tOverride')) {
        return true;
      } else {
        return false;
      }
    },

    setOverride: function (value: boolean) {
      if (!value) {
        localStorage.removeItem('tOverride');
      } else {
        localStorage.setItem('tOverride', '1');
      }
      this.setTLocation(this.dntLocation);
    },

    init: function () {
      if (this.getOverride()) {
        translations.small = false;
      } else {
        this.tLocation = this.dntLocation;
        translations.small = true;
      }

      if (this.tlocation) {
        translations.location = this.tlocation.url;
        translations.region = this.tlocation.region;
      }
      dntData.setLocation(this.dntLocation);
    }
  };
}