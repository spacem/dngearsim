import { StatDef } from 'src/models/stat-def';

interface ValueStatDefs {
    [id: number]: StatDef;
}

function toOneDec(stat) {
    return Math.round(stat.max * 10) / 10;
}
function toNoDec(stat) {
    return Math.floor(stat.max);
}
function inThousands(stat) {
    const val = Number(stat.max);
    if (val < 1000) {
        return val;
    } else if (val < 10000) {
        return Math.round(val / 10) / 100 + 'k';
    } else if (val < 100000) {
        return Math.round(val / 100) / 10 + 'k';
    } else if (val < 1000000) {
        return Math.round(val / 1000) + 'k';
    } else if (val < 100000000) {
        return Math.round(val / 10000) / 100 + 'm';
    } else {
        return Math.round(val / 1000000) + 'm';
    }
}
function toPercent(stat) {
    return (Math.round(stat.max * 10000) / 100) + '%';
}

export const StatLookup: ValueStatDefs = {
    0: { id: 0, name: 'str', display: inThousands, dps: true, pc: 50, skPc: 4050, searchable: true, quickHigh: true },
    1: { id: 1, name: 'agi', display: inThousands, dps: true, pc: 51, skPc: 4051, searchable: true, quickHigh: true },
    2: { id: 2, name: 'int', display: inThousands, dps: true, pc: 52, skPc: 4052, searchable: true, quickHigh: true },
    3: { id: 3, name: 'vit', display: inThousands, def: true, pc: 53, skPc: 4053, searchable: true, quickHigh: true },
    4: { id: 4, name: 'pdmg',
        display: inThousands, combineWith: 5, dps: true, pc: 54, searchable: true, altStat: 32, quickHigh: true, addTo: 32 },
    5: { id: 5, name: 'maxPdmg', display: inThousands, hide: true, pc: 55, addTo: 32 },
    6: { id: 6, name: 'mdmg',
        display: inThousands, combineWith: 7, dps: true, pc: 56, searchable: true, altStat: 33, quickHigh: true, addTo: 33 },
    7: { id: 7, name: 'maxMdmg', display: inThousands, hide: true, pc: 57, addTo: 33 },
    8: { id: 8, name: 'pdef', display: inThousands, def: true, pc: 58, searchable: true },
    9: { id: 9, name: 'mdef', display: inThousands, def: true, pc: 59, searchable: true },
    10: { id: 10, name: 'para', display: inThousands, pc: 60, noCustom: true },
    11: { id: 11, name: 'para resist', display: inThousands, pc: 61, noCustom: true },
    12: { id: 12, name: 'crit', display: inThousands, dps: true, pc: 62, searchable: true },
    13: { id: 13, name: 'crit resist', display: inThousands, pc: 63, noCustom: true },
    14: { id: 14, name: 'stun', display: inThousands, pc: 64, noCustom: true },
    15: { id: 15, name: 'stun resist', display: inThousands, pc: 65, noCustom: true },
    16: { id: 16, name: 'fire%', display: toPercent, dps: true, searchable: true, altStat: 88, addTo: 88 },
    17: { id: 17, name: 'ice%', display: toPercent, dps: true, searchable: true, altStat: 88, addTo: 88 },
    18: { id: 18, name: 'light%', display: toPercent, dps: true, searchable: true, altStat: 88, addTo: 88 },
    19: { id: 19, name: 'dark%', display: toPercent, dps: true, searchable: true, altStat: 88, addTo: 88 },
    20: { id: 20, name: 'fire def', display: toPercent, def: true, searchable: true },
    21: { id: 21, name: 'ice def', display: toPercent, def: true, searchable: true },
    22: { id: 22, name: 'light def', display: toPercent, def: true, searchable: true },
    23: { id: 23, name: 'dark def', display: toPercent, def: true, searchable: true },
    25: { id: 25, name: 'hp', display: inThousands, def: true, pc: 75, skPc: 4075, searchable: true },
    26: { id: 26, name: 'mp', display: inThousands, def: true, pc: 76, skPc: 4076 },
    29: { id: 29, name: 'fd', display: toNoDec, dps: true, pc: 79, searchable: true },

    // these are both min and max
    // shows with the same name but these are used really just for set bonus I think
    32: { id: 32, name: 'pdmg', display: inThousands, dps: true, pc: 54, quickHigh: true, hideIf: 4 },
    33: { id: 33, name: 'mdmg', display: inThousands, dps: true, pc: 56, quickHigh: true, hideIf: 6 },

    50: { id: 50, name: 'str%', display: toPercent, dps: true },
    51: { id: 51, name: 'agi%', display: toPercent, dps: true },
    52: { id: 52, name: 'int%', display: toPercent, dps: true },
    53: { id: 53, name: 'vit%', display: toPercent, def: true },
    54: { id: 54, name: 'pdmg%', display: toPercent, combineWith: 55, dps: true },
    55: { id: 55, name: 'maxPdmg%', display: toPercent, hide: true },
    56: { id: 56, name: 'mdmg%', display: toPercent, combineWith: 57, dps: true },
    57: { id: 57, name: 'maxMdmg%', display: toPercent, hide: true },
    58: { id: 58, name: 'pdef%', display: toPercent, def: true },
    59: { id: 59, name: 'mdef%', display: toPercent, def: true },
    60: { id: 60, name: 'para%', display: toPercent, noCustom: true, def: true },
    61: { id: 61, name: 'para resist%', display: toPercent, noCustom: true, def: true },
    62: { id: 62, name: 'crit%', display: toPercent, dps: true },
    63: { id: 63, name: 'crit resist%', display: toPercent, def: true },
    64: { id: 64, name: 'stun%', display: toPercent, noCustom: true, def: true },
    65: { id: 65, name: 'stun resist%', display: toPercent, noCustom: true, def: true },
    74: { id: 74, name: 'move%', display: toPercent, noCustom: true, def: true },
    75: { id: 75, name: 'hp%', display: toPercent, def: true, searchable: true },
    76: { id: 76, name: 'mp%', display: toPercent, def: true },
    77: { id: 77, name: 'mp recover%', display: toPercent, def: true },
    79: { id: 79, name: 'fd%', display: toPercent, dps: true },
    81: { id: 81, name: 'safe move%', display: toPercent, noCustom: true, def: true },

    // this is found on ladder costumes and gives all types of element
    88: { id: 88, name: 'all element%', display: toPercent, noCustom: true, def: false, dps: true },

    // these are both min and max
    // shows with the same name but these are used really just for set bonus I think
    101: { id: 101, name: 'pdmg%', display: toPercent, noCustom: true, dps: true, quickHigh: true, searchable: true },
    102: { id: 102, name: 'mdmg%', display: toPercent, noCustom: true, dps: true, quickHigh: true, searchable: true },

    103: { id: 103, name: 'cdmg', display: inThousands, dps: true, pc: 104, searchable: true },
    104: { id: 104, name: 'crit dmg%', display: toPercent, noCustom: true, dps: true },
    105: { id: 104, name: 'pvp dmg', display: inThousands, noCustom: true, dps: true },
    106: { id: 106, name: 'pvp def', display: inThousands, noCustom: true, def: true },
    107: { id: 107, name: 'mp?', display: toNoDec, noCustom: true, hide: true, def: true },

    // stats below here are ones I made up
    1001: { id: 1001, name: 'avg dmg', display: inThousands, summaryDisplay: true, element: 'primary', noCustom: true, hide: true },
    1004: { id: 1004, name: 'avg pdmg', display: inThousands, summaryDisplay: true, element: 'primary', noCustom: true, hide: true },
    1005: { id: 1005, name: 'avg pheal', display: inThousands, summaryDisplay: true, noCustom: true, hide: true },
    1006: { id: 1006, name: 'avg mdmg', display: inThousands, summaryDisplay: true, element: 'primary', noCustom: true, hide: true },
    1007: { id: 1007, name: 'mheal', display: inThousands, summaryDisplay: true, noCustom: true, hide: true },

    1008: { id: 1008, name: 'pdef', display: toPercent, noCustom: true, summaryFor: 8 },
    1009: { id: 1009, name: 'mdef', display: toPercent, noCustom: true, summaryFor: 9 },

    1012: { id: 1012, name: 'crit chance', display: toPercent, noCustom: true, dps: true, summaryFor: 12, summaryDisplay: true },
    1030: { id: 1030, name: 'fd%', display: toPercent, noCustom: true, dps: true, summaryFor: 29, summaryDisplay: true },
    1103: { id: 1103, name: 'crit dmg', display: toPercent, noCustom: true, dps: true, summaryFor: 103, summaryDisplay: true },

    2001: { id: 2001, name: 'dmg', display: inThousands, summaryDisplay: true, element: 'secondary', noCustom: true, hide: true },
    2004: { id: 2004, name: 'pdmg', display: inThousands, summaryDisplay: true, element: 'secondary', noCustom: true, hide: true },
    2006: { id: 2006, name: 'mdmg', display: inThousands, summaryDisplay: true, element: 'secondary', noCustom: true, hide: true },

    2008: { id: 2008, name: 'pdef eqhp', display: inThousands, noCustom: true },
    2009: { id: 2009, name: 'mdef eqhp', display: inThousands, noCustom: true },

    3000: { id: 3000, name: 'skDmg%', display: toPercent, dps: true },
    3001: { id: 3001, name: 'skPDmg%', display: toPercent, dps: true },
    3002: { id: 3002, name: 'skMDmg%', display: toPercent, dps: true },

    3008: { id: 3008, name: 'eqhp', display: inThousands, summaryDisplay: true, noCustom: true, hide: true },

    4000: { id: 4000, name: 'skStr', display: inThousands, dps: true },
    4001: { id: 4001, name: 'skAgi', display: inThousands, dps: true },
    4002: { id: 4002, name: 'skInt', display: inThousands, dps: true },
    4003: { id: 4003, name: 'skVit', display: inThousands, def: true },
    4008: { id: 4008, name: 'skPDef', display: inThousands, def: true },
    4009: { id: 4009, name: 'skMDef', display: inThousands, def: true },
    4012: { id: 4012, name: 'skCrit', display: inThousands, dps: true },
    4032: { id: 4032, name: 'skPdmg', display: inThousands, dps: true },
    4033: { id: 4033, name: 'skMdmg', display: inThousands, dps: true },
    4050: { id: 4050, name: 'skStr%', display: toPercent, dps: true },
    4051: { id: 4051, name: 'skAgi%', display: toPercent, dps: true },
    4052: { id: 4052, name: 'skInt%', display: toPercent, dps: true },
    4053: { id: 4053, name: 'skVit%', display: toPercent, def: true },
    // 4058: { id: 4058, name: 'skPDef?%', display: toPercent, def: true },
    // 4059: { id: 4059, name: 'skMDef?%', display: toPercent, def: true },
    4062: { id: 4062, name: 'skCrit%', display: toPercent, dps: true },
    4075: { id: 4075, name: 'skHp%', display: toPercent, def: true },
    4076: { id: 4076, name: 'skMp%', display: toPercent, def: true },
    // 4079: { id: 4079, name: 'skFd?%', display: toPercent, dps: true },

    // special cases for skills
    10164: { id: 10164, name: 'intToPdmg', display: toPercent, noCustom: true, dps: true },
    10165: { id: 10165, name: 'strToMdmg', display: toPercent, noCustom: true, dps: true },
    10372: { id: 10372, name: 'intToMdmg', display: toPercent, noCustom: true, dps: true },
    103721: { id: 103721, name: 'strToPdmg', display: toPercent, noCustom: true, dps: true },

    10389: { id: 10389, name: 'fd%', display: toPercent, dps: true },
    // items over 10000 are unknown skill effects
};
