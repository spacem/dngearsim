require('angulartics');

angular.module('dnsim', [
    require('angular-animate'),
    require('angular-route'),
    require('ng-infinite-scroll'),
    require('angular-translate'),
    'angulartics',
    require('angulartics-google-analytics')
]);

angular.module('dnsim').config(['$compileProvider', allowAutoBindings]);
console.log('AngularJS Version:', angular.version);
angular.module('dnsim').config(['$locationProvider', setupHtml5Mode]);
angular.module('dnsim').config(['$translateProvider', setupTranslations]);
angular.module('dnsim').factory('dnSimTranslationLoader', ['translations', '$q', dnSimTranslationLoader]);

function setupHtml5Mode($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true,
        rewriteLinks: true
    });
}

function allowAutoBindings($compileProvider) {
    // angular 1.6 requires use of $onInit unless this config is set
    // https://toddmotto.com/angular-1-6-is-here
    $compileProvider.preAssignBindingsEnabled(true);
}

function setupTranslations($translateProvider) {
    $translateProvider.useLoader('dnSimTranslationLoader');
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
}

function dnSimTranslationLoader(translations, $q) {
    return function (options) {
        return $q(function(resolve, reject) {
            translations.init(null, function() {
                return resolve(translations.getRawData());
            });
        });
    };
}
