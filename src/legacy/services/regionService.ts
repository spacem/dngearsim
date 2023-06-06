import { Region } from 'src/models/region';
import * as angular from 'angular';

angular.module('dnsim').factory('region', ['translations', 'dntReset', 'dntData', '$route', '$location', region]);
function region(translations, dntReset, dntData, $route, $location) {

  const alternativeFiles: Region = { region: 'ALT', name: 'Alternative user specified files', url: '' };
  let hostedFiles: Region[] = [
    { region: 'sea', name: 'south east asia', url: 'https://seadnfiles.netlify.app/public' },
    { region: 'na', name: 'north america', url: 'https://newnafiles.netlify.app/public', ownImages: true },
    // { region: 'eu', name: 'europe', url: 'https://eudnfiles.netlify.com/public' },
    { region: 'th', name: 'thailand', url: 'https://thdnfiles.netlify.app/public' },
    // {region: 'vn', name: 'vietnam ', url : 'https://vndnfiles.firebaseapp.com'},
    { region: 'tw', name: 'taiwan 臺灣', url: 'https://tdnfiles.netlify.app/public' },
    {region: 'jdn', name: 'japan 日本', url : 'https://jdnfiles.netlify.app/public'},
    { region: 'cdn', name: 'china 中國', url: 'https://cdnfiles.netlify.app/public' },
    { region: 'kdn', name: 'korea 대한민국', url: 'https://kdnfiles.netlify.app/public' },
    { region: 'duck', name: 'project duck', url: 'https://duckdnfiles.netlify.app/public', ownImages: true },
    // { region: 'br', name: 'Brazil', url: 'https://dnbr.netlify.com/public' },
  ];

  const dntLocationRegion: string = localStorage.getItem('lastDNTRegion');
  let dntLocation: Region = null;
  if (dntLocationRegion) {
    for (const hostedFile of [...hostedFiles, alternativeFiles]) {
      if (hostedFile.region === dntLocationRegion) {
        dntLocation = hostedFile;
      }
    }
  }
  if (!dntLocation && $location.path().indexOf('desktop-setup') > 0) {
    dntLocation = alternativeFiles;
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
