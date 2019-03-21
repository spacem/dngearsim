import * as angular from 'angular';

angular.module('dnsim').factory('dvStatcardHelper', dvStatcardHelper);
function dvStatcardHelper() {
    'use strict';

    // Conversions between dngs stat IDs and dvstatcard keys
    var statMap = {
        0: 'statStr',
        1: 'statAgi',
        2: 'statInt',
        3: 'statVit',
        4: 'statPDmgMin',
        5: 'statPDmgMax',
        6: 'statMDmgMin',
        7: 'statMDmgMax',
        8: 'statPDef',
        9: 'statMDef',
        12: 'statCrit',
        16: 'statFire',
        17: 'statIce',
        18: 'statLight',
        19: 'statDark',
        25: 'statHp',
        26: 'statMana',
        29: 'statFD',
        103: 'statCritDmg',
    };

    //    Converts dngs stat IDs to dvstatcard stat keys
    function convertStat(stat) {
        var ret = statMap[stat.id];
        return ret || 'unknown';
    };

    function convertPercentToNum(val) {
        return val * 100;
    };

    //    Stats that need to have some conversion applied between dngs and dvstatcard
    var adjustments = {
        16: convertPercentToNum,
        17: convertPercentToNum,
        18: convertPercentToNum,
        19: convertPercentToNum,
    }

    //    Convert between numerical standards between dngs and dvstatcard
    function adjustStat(stat) {
        var func = adjustments[stat.id];
        if (func) {
            return func(stat.max);
        }
        return stat.max;
    };

    return {
        convertStats: function (build, buildName, calcStats) {
            var ret = {
                characterName: buildName,
                remark: 'Imported from DNGearsim',
                classId: build.job.id,
                statHeroLevel: build.heroLevel,
            }
            for (var k in calcStats) {
                var v = calcStats[k];
                ret[convertStat(v)] = adjustStat(v);
            }
            return ret;
        },
        cardImportUrl: 'https://redirect.divinitor.com/dngsimport',
    }
}
