import * as angular from 'angular';
angular.module('dnsim').factory('excludeService', excludeService);

function excludeService() {
    return {
        ids: [{
            name: 'unbound plates',
            min: 0,
            max: 0
        }
        ],
    };
}
