(function () {
'use strict';
angular.module('dnsim')
.controller('DesktopSetupCtrl',
  ['$http', '$window', 'region', 'translations',
  function($http, $window, region, translations) {
    'use strict';

    document.body.className = 'default-back';
    $window.document.title = 'dngearsim | SETUP';
    localStorage.setItem('lastDNTRegion', 'ALT');
    this.loading = false;

    this.selectWorkingFolder = () => {
      this.error = '';
      $http.get('dngearsim://select-folder').then(result => {
        this.error = result.data.error;
        if (result.data.folder) {
          this.workLocation = result.data.folder;
          this.setFolder();
        }
      });
    };

    this.setFolder = () => {
      this.error = '';
      const encoded = encodeURIComponent(this.workLocation);
      this.loading = true;
      $http.get('dngearsim://check-folder:' + encoded).then(result => {
        this.loading = false;
        this.error = result.data.error;
        this.locationDetail = result.data.detail;
        if (this.locationDetail) {
          localStorage.setItem('localLocation', this.workLocation);
          region.setCustomUrl('dngearsim://data:' + encoded);
          region.init();
          region.setTLocation(region.dntLocation);
        }
      });
    };

    this.locationDetail = '';
    this.error = '';
    this.workLocation = localStorage.getItem('localLocation');
    if (this.workLocation) {
      this.setFolder();
    }

    region.setLocationByName('ALT');
    region.init();
  }]
);
})();
