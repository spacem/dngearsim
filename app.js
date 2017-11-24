'use strict'

angular.module('dnsim', [
    require('angular-animate'),
    'ngRoute',
    'angulartics',
    'angulartics.google.analytics',
    'infinite-scroll',
    'pascalprecht.translate']);

angular.module('dnsim').config(['$compileProvider', allowAutoBindings]);
angular.module('dnsim').config(['$locationProvider', setupHtml5Mode]);
angular.module('dnsim').config(['$translateProvider', setupTranslations]);
angular.module('dnsim').factory('dnSimTranslationLoader', ['translations', '$q', dnSimTranslationLoader]);

function importAll(r) {
    r.keys().forEach(r);
}

require('./dngearsim.scss');

importAll(require.context('./services'));
importAll(require.context('./ui/'));


importAll(require.context('./ui/about'));
importAll(require.context('./ui/builds'));
importAll(require.context('./ui/filters'));
importAll(require.context('./ui/item'));
importAll(require.context('./ui/nav'));
importAll(require.context('./ui/online'));
importAll(require.context('./ui/region'));
importAll(require.context('./ui/search'));
importAll(require.context('./ui/widgets'));

require('./ui/routes');


function setupHtml5Mode($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true,
        rewriteLinks: true
    });
};

function allowAutoBindings($compileProvider) {
    // angular 1.6 requires use of $onInit unless this config is set
    // https://toddmotto.com/angular-1-6-is-here
    $compileProvider.preAssignBindingsEnabled(true);
};

function setupTranslations($translateProvider) {
    $translateProvider.useLoader('dnSimTranslationLoader');
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
}

function dnSimTranslationLoader(translations, $q) {
    return function (options) {
        return $q(function (resolve, reject) {
            translations.init(null, function () {
                return resolve(translations.getRawData());
            });
        });
    };
}
