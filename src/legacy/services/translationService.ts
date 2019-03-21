import { DnTranslations } from '../dntviewer/dntranslations';
import * as angular from 'angular';

angular.module('dnsim').factory('translations', ['$rootScope', 'uiTranslations', '$translate', translations]);
function translations($rootScope, uiTranslations, $translate) {

  var dnTranslations = new DnTranslations();
  var smallFile = 'uistring.optimised.json';
  var bigFile = 'uistring.json';

  var completeCallback = [];
  var progressCallback = [];

  return {

    getRawData: function () {
      return dnTranslations.data;
    },

    reset: function () {
      dnTranslations = new DnTranslations();
      dnTranslations.sizeLimit = 100;
      this.loaded = false;
      this.startedLoading = false;
      completeCallback = [];
      progressCallback = [];
    },

    getFileName: function () {
      if (this.small) {
        // console.log('loading optimised translations');
        return smallFile;
      }
      else {
        // console.log('loading full translations');
        return bigFile;
      }
    },

    loaded: false,
    startedLoading: false,
    small: false,

    location: null,
    region: null,

    init: function (progress, complete) {

      if (this.isLoaded()) {
        complete();
      }
      else {
        progressCallback = [];
        if (progress) {
          progressCallback.push(progress);
        }
        if (complete) {
          completeCallback.push(complete);
        }

        if (!this.startedLoading) {
          this.startedLoading = true;
          var t = this;

          var fileName = null;
          if (this.location && this.location != '') {
            fileName = this.location + '/' + this.getFileName();

            if (fileName != localStorage.getItem("UIStrings_file")) {
              sessionStorage.removeItem('UIStrings');
              localStorage.removeItem('UIStrings_file');
            }
          }

          $rootScope.$broadcast('TRANSLATION_LOAD_EVENT');
          dnTranslations.loadDefaultFile(
            fileName,
            function (msg) {
              console.log(msg);
            },
            function () {
              uiTranslations.addTranslations(t.region, t.getRawData());
              console.log('using ', t.region);
              $translate.use(t.region);
              t.loaded = true;
              angular.forEach(completeCallback, function (value, key) { value(); });
              completeCallback = [];
              $rootScope.$broadcast('TRANSLATION_LOAD_EVENT');
            },
            function (msg) {
              angular.forEach(progressCallback, function (value, key) { value(msg); });
              $rootScope.$broadcast('TRANSLATION_LOAD_ERROR');
              t.startedLoading = false;
              t.loaded = false;
            }
          );
        }
      }
    },

    isLoaded: function () {
      if (!this.loaded) {
        var fileName = this.location + '/' + this.getFileName();

        if (fileName != localStorage.getItem("UIStrings_file")) {
          sessionStorage.removeItem('UIStrings');
          localStorage.removeItem('UIStrings_file');
        }

        this.loaded = dnTranslations.loadFromSession();
        if (this.loaded) {
          uiTranslations.addTranslations(this.region, this.getRawData());
          $translate.use(this.region);
          this.startedLoading = true;
        }
      }
      return this.loaded;
    },

    translate: function (id, idParam) {
      if (this.loaded) {
        try {
          var name;
          if (!id) {
            return '';
          }
          else {
            name = dnTranslations.translate(id);

            if (typeof name != 'string') {
              return 'm' + name;
            }
          }

          if (idParam && name) {

            if (typeof idParam === 'string') {
              var params = idParam.split(',');
              for (var p = 0; p < params.length; ++p) {
                var pid = params[p];
                if (pid.indexOf('{') == 0) {
                  pid = params[p].replace(/\{|\}/g, '');
                  pid = dnTranslations.translate(pid);
                }

                name = name.replace('{' + p + '}', pid);
              }
            }
            else {
              name = name.replace('{0}', idParam);
            }
          }

          return name;
        }
        catch (ex) {
          console.log('unable to translate', id, idParam, ex);
        }
      }

      return 'm' + id;
    }
  }
}
