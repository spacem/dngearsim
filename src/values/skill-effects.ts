// note: skills shown on-screen have 1k added to their id
export const SkillEffectLookup = {
    2: { id: 2, name: 'phyisical attack power', mapTo: 3001 },
    13: { id: 13, name: 'mp', mapTo: 26 },
    25: { id: 25, name: 'action speed' },
    29: { id: 29, name: 'magic attack power', mapTo: 3002 },
    32: { id: 32, name: 'fire %', mapTo: 16 },
    33: { id: 33, name: 'ice %', mapTo: 17 },
    34: { id: 34, name: 'light %', mapTo: 18 },
    35: { id: 35, name: 'dark %', mapTo: 19 },
    36: { id: 36, name: 'fire def', mapTo: 20 },
    37: { id: 37, name: 'ice def', mapTo: 21 },
    38: { id: 38, name: 'light def', mapTo: 22 },
    39: { id: 39, name: 'dark def', mapTo: 23 },
    58: { id: 58, name: 'hp%', mapTo: 4075 },
    59: { id: 59, name: 'mp%', mapTo: 4076 },
    65: { id: 65, name: 'range' },
    76: { id: 76, name: 'movement speed', mapTo: 74 },
    87: { id: 87, name: 'str%', mapTo: 4050 },
    88: { id: 88, name: 'agi%', mapTo: 4051 },
    89: { id: 89, name: 'int%', mapTo: 4052 },
    90: { id: 90, name: 'vit%', mapTo: 4053 },
    // 134 : { id: 134, name: 'p dmg reduction%' },
    // 135 : { id: 135, name: 'm dmg reduction%' },
    185: { id: 185, name: 'wots attack power', mapTo: 3000 },
    251: { id: 251, name: 'critical chance%', mapTo: 1012 },
    164: { id: 164, name: 'intToPdmg', mapTo: 10164 },
    165: { id: 165, name: 'strToMdmg', mapTo: 10165 },
    222: {
        id: 222,
        name: 'hellfire',
        getVals: function (val) {
            if (val.indexOf(';') > 0) {
                const vals = val.split(';');
                return [
                    { id: 62, effect: 222, max: Number(vals[0]) / 100.0 },
                    { id: 4012, effect: 222, max: Number(vals[1]) },
                ];
            } else {
                return [{ id: 62, effect: 222, max: Number(val) / 100.0 }];
            }
        }
    },
    372: {
        id: 372,
        name: 'statConversion',
        getVals: function (val) {
            if (val.indexOf(';') > 0) {
                const vals = val.split(';');
                if (vals.length === 3 && Number(vals[0]) === 2 && Number(vals[2]) === 6) {
                    return [{ id: 10372, name: 'intToMdmg', max: Number(vals[1]) }];
                } else if (vals.length === 3 && Number(vals[0]) === 0 && Number(vals[2]) === 5) {
                    return [{ id: 103721, name: 'strToPdmg', max: Number(vals[1]) }];
                }
            }
            return [];
        }
    },
    389: {
        id: 389,
        name: 'fd buff or sader cm1',
        getVals: function (val) {
            if (val && val.indexOf && val.indexOf(';') > 0) {
                return [];
            } else {
                return [{ id: 10389, name: 'fd buf', max: Number(val) }];
            }
        }
    },
    404: { id: 404, name: 'critical damage%', mapTo: 1103 },
};
