(function () {
'use strict';

angular.module('dnsim').factory('hCodeValues', [hCodeValues]);
function hCodeValues() {

  function toOneDec(stat) {
    return Math.round(stat.max*10)/10;
  }
  function toNoDec(stat) {
    return Math.floor(stat.max);
  }
  function inThousands(stat) {
    var val = Number(stat.max);
    if(val < 100) {
      return val;
    }
    else if(val < 100000) {
      return Math.round(val/100)/10 + 'k';
    }
    else if(val < 1000000) {
      return Math.round(val/1000) + 'k';
    }
    else if(val < 10000000) {
      return Math.round(val/10000)/100 + 'm';
    }
    else {
      return Math.round(val/1000000) + 'm';
    }
  }
  function toPercent(stat) {
    return (Math.floor(stat.max*100000)/1000) + '%';
  }
  
  return {
    stats : {
      0  : {id: 0, name: 'str', display: toNoDec, type: 'dps', pc: 50, skPc: 4050 },
      1  : {id: 1, name: 'agi', display: toNoDec, type: 'dps', pc: 51, skPc: 4051 },
      2  : {id: 2, name: 'int', display: toNoDec, type: 'dps', pc: 52, skPc: 4052 },
      3  : {id: 3, name: 'vit', display: toNoDec, type: 'def', pc: 53, skPc: 4053 },
      4  : {id: 4, name: 'pdmg', display: toNoDec, combineWith: 5, type: 'dps', pc: 54 },
      5  : {id: 5, name: 'maxPdmg', display: toNoDec, hide: true, pc: 55 },
      6  : {id: 6, name: 'mdmg', display: toNoDec, combineWith: 7, type: 'dps', pc: 56 },
      7  : {id: 7, name: 'maxMdmg', display: toNoDec, hide: true, pc: 57 },
      8  : {id: 8, name: 'def', display: toNoDec, type: 'def', pc: 58 },
      9  : {id: 9, name: 'mdef', display: toNoDec, type: 'def', pc: 59 },
      10 : {id: 10, name: 'para', display: toNoDec, pc: 60, noCustom: true },
      11 : {id: 11, name: 'para resist', display: toNoDec, pc: 61, noCustom: true },
      12 : {id: 12, name: 'crit', display: toNoDec, type: 'dps', pc: 62 },
      13 : {id: 13, name: 'crit resist', display: toNoDec, pc: 63, noCustom: true },
      14 : {id: 14, name: 'stun', display: toNoDec, pc: 64, noCustom: true },
      15 : {id: 15, name: 'stun resist', display: toNoDec, pc: 65, noCustom: true },
      16 : {id: 16, name: 'fire%', display: toPercent, type: 'dps' },
      17 : {id: 17, name: 'ice%', display: toPercent, type: 'dps' },
      18 : {id: 18, name: 'light%', display: toPercent, type: 'dps' },
      19 : {id: 19, name: 'dark%', display: toPercent, type: 'dps' },
      20 : {id: 20, name: 'fire def', display: toPercent, type: 'def' },
      21 : {id: 21, name: 'ice def', display: toPercent, type: 'def' },
      22 : {id: 22, name: 'light def', display: toPercent, type: 'def' },
      23 : {id: 23, name: 'dark def', display: toPercent, type: 'def' },
      25 : {id: 25, name: 'hp', display: inThousands, type: 'def', pc: 75, skPc: 4075 },
      26 : {id: 26, name: 'mp', display: inThousands, pc: 76, skPc: 4076 },
      29 : {id: 29, name: 'fd', display: toNoDec, type: 'dps' },
      
      // these are both min and max
      // shows with the same name but these are used really just for set bonus I think
      32 : {id: 32, name: 'pdmg', display: toNoDec, type: 'dps', pc: 54 },
      33 : {id: 33, name: 'mdmg', display: toNoDec, type: 'dps', pc: 54 },
      
      50 : {id: 50, name: 'str%', display: toPercent },
      51 : {id: 51, name: 'agi%', display: toPercent },
      52 : {id: 52, name: 'int%', display: toPercent },
      53 : {id: 53, name: 'vit%', display: toPercent },
      54 : {id: 54, name: 'pdmg%', display: toPercent, combineWith: 55 },
      55 : {id: 55, name: 'maxPdmg%', display: toPercent, hide: true },
      56 : {id: 56, name: 'mdmg%', display: toPercent, combineWith: 57 },
      57 : {id: 57, name: 'maxMdmg%', display: toPercent, hide: true },
      58 : {id: 58, name: 'def%', display: toPercent },
      59 : {id: 59, name: 'mdef%', display: toPercent },
      60 : {id: 60, name: 'para%', display: toPercent, noCustom: true },
      61 : {id: 61, name: 'para resist%', display: toPercent, noCustom: true },
      62 : {id: 62, name: 'crit%', display: toPercent },
      63 : {id: 63, name: 'crit resist%', display: toPercent },
      64 : {id: 64, name: 'stun%', display: toPercent, noCustom: true },
      65 : {id: 65, name: 'stun resist%', display: toPercent, noCustom: true },
      74 : {id: 74, name: 'move%', display: toPercent, noCustom: true },
      75 : {id: 75, name: 'hp%', display: toPercent },
      76 : {id: 76, name: 'mp%', display: toPercent },
      77 : {id: 77, name: 'mp recover%', display: toPercent },
      81 : {id: 81, name: 'safe move%', display: toPercent, noCustom: true },

      // these are both min and max
      // shows with the same name but these are used really just for set bonus I think
      101 : {id: 101, name: 'pdmg%', display: toPercent, noCustom: true },
      102 : {id: 102, name: 'mdmg%', display: toPercent, noCustom: true },

      103: {id: 103, name: 'crit dmg', display: toNoDec, type: 'dps', pc: 104 },
      104: {id: 104, name: 'crit dmg%', display: toPercent, noCustom: true },
      107: {id: 107, name: 'mp?', display: toNoDec, hide: true, noCustom: true },
      
      // stats below here are ones I made up
      1001: {id: 1001, name: 'dmg', display: inThousands, summaryDisplay: true, element: 'primary', noCustom: true },
      1004: {id: 1004, name: 'pdmg', display: inThousands, summaryDisplay: true, element: 'primary', noCustom: true },
      1006: {id: 1006, name: 'mdmg', display: inThousands, summaryDisplay: true, element: 'primary', noCustom: true },
      
      1008: {id: 1008, name: 'calc pdef', display: toPercent, noCustom: true },
      1009: {id: 1009, name: 'calc mdef', display: toPercent, noCustom: true },
      
      1012: {id: 1012, name: 'crit chance', display: toPercent, noCustom: true },
      1029: {id: 1029, name: 'fd calc', display: toPercent, noCustom: true },
      1103: {id: 1103, name: 'crit dmg', display: toPercent, noCustom: true },
      
      2001: {id: 2001, name: 'dmg', display: inThousands, summaryDisplay: true, element: 'secondary', noCustom: true },
      2004: {id: 2004, name: 'pdmg', display: inThousands, summaryDisplay: true, element: 'secondary', noCustom: true },
      2006: {id: 2006, name: 'mdmg', display: inThousands, summaryDisplay: true, element: 'secondary', noCustom: true },
      
      2008: {id: 2008, name: 'pdef eqhp', display: inThousands, noCustom: true },
      2009: {id: 2009, name: 'mdef eqhp', display: inThousands, noCustom: true },
      
      3000: {id: 3000, name: 'skDmg%', display: toPercent },
      3001: {id: 3000, name: 'skPDmg%', display: toPercent },
      3002: {id: 3000, name: 'skMDmg%', display: toPercent },
      3008: {id: 3008, name: 'eqhp', display: inThousands, summaryDisplay: true, noCustom: true },
      
      4012: {id: 4050, name: 'skCrit', display: inThousands },
      4050: {id: 4050, name: 'skStr%', display: toPercent },
      4051: {id: 4051, name: 'skAgi%', display: toPercent },
      4052: {id: 4052, name: 'skInt%', display: toPercent },
      4053: {id: 4053, name: 'skVit%', display: toPercent },
      4075: {id: 4075, name: 'skHp%', display: toPercent },
      4076: {id: 4076, name: 'skMp%', display: toPercent },
      
      // special cases for skills
      10164: {id: 10164, name: 'intToPdmg', display: toPercent, noCustom: true },
      10165: {id: 10165, name: 'strToMdmg', display: toPercent, noCustom: true },
      
      // items over 10000 are unknown skill effects
    },
  
    rankNames : {
      0 : { id: 0, name : 'normal' },
      1 : { id: 1, name : 'magic' },
      2 : { id: 2, name : 'rare' },
      3 : { id: 3, name : 'epic' },
      4 : { id: 4, name : 'unique' },
      5 : { id: 5, name : 'legendary' },
    },
    
    shopNames : {
      28001: 'lament',28002: 'lament',28003: 'lament',28004: 'lament',28005: 'lament',28006: 'lament',28007: 'lament',28008: 'lament',28009: 'lament',
      29001: 'aura',29002: 'aura',29003: 'aura',29004: 'aura',29005: 'aura',29006: 'aura',29007: 'aura',29008: 'aura',29009: 'aura',
      5001: 'medal',5002: 'medal',5003: 'medal',5004: 'medal',5005: 'medal',5006: 'medal',5007: 'medal',5008: 'medal',5009: 'medal',
      5101: 'ladder',5102: 'ladder',5103: 'ladder',5104: 'ladder',5105: 'ladder',5106: 'ladder',5107: 'ladder',5108: 'ladder',5109: 'ladder',
      59001: 'garden bunny',
      52001 : 'nightmare', 52002 : 'nightmare', 52003 : 'nightmare', 52004 : 'nightmare', 52005 : 'nightmare', 52006 : 'nightmare', 52007 : 'nightmare', 52008 : 'nightmare', 52009 : 'nightmare',
      21: 'blacksmith', 22: 'blacksmith', 23: 'blacksmith', 24: 'blacksmith', 25: 'blacksmith', 26: 'blacksmith', 27: 'blacksmith', 28: 'blacksmith', 29: 'blacksmith', 
      89001: 'guild master',
      88001: 'battlefield', 88002: 'battlefield', 88003: 'battlefield', 88004: 'battlefield', 88005: 'battlefield', 88006: 'battlefield', 88007: 'battlefield', 88008: 'battlefield', 88009: 'battlefield', 
      66001: 'erosion',
      35006: 'plate',
      14051: 'abyss', 14052: 'abyss', 14053: 'abyss', 14054: 'abyss', 14055: 'abyss', 14056: 'abyss', 14057: 'abyss', 14058: 'abyss', 14059: 'abyss', 
      40011: 'daredevil faire', 40012: 'daredevil faire', 40013: 'daredevil faire', 40014: 'daredevil faire', 40015: 'daredevil faire', 40016: 'daredevil faire', 40017: 'daredevil faire', 40018: 'daredevil faire',
      40001: 'daredevil faire', 40002: 'daredevil faire', 
    },
    
    checkedRank : {
      0 : true,
      1 : true,
      2 : true,
      3 : true,
      4 : true,
      5 : true,
    },
    
    typeNames : {
      0 : 'weapons',
      1 : 'equipment',
      5 : 'plates',
      8 : 'pouch',
      38 : 'plates',
      90 : 'welspring',
      132 : 'talisman',
      139 : 'gems',
    },
    
    elements : {
      0 : { id: 0, name: 'non-ele' },
      1 : { id: 1, name: 'fire', dmgStat: 16 },
      2 : { id: 2, name: 'ice', dmgStat: 17 },
      3 : { id: 3, name: 'light', dmgStat: 18 },
      4 : { id: 4, name: 'dark', dmgStat: 19 },
    },
    
    damageTypes : {
      0 : { id: 0, name: 'both separate' },
      1 : { id: 1, name: 'physical' },
      2 : { id: 2, name: 'magical' },
      3 : { id: 3, name: 'both combined' },
    },
    
    // note: skills shown on-screen have 1k added to their id
    skillEffectMapping : {
      2 : { id: 2, name: 'phyisical attack power', mapTo: 3001 },
      13 : { id: 13, name: 'mp', mapTo: 26 },
      25 : { id: 25, name: 'action speed' },
      29 : { id: 29, name: 'magic attack power', mapTo: 3002 },
      32 : { id: 32, name: 'fire %', mapTo: 16 },
      33 : { id: 33, name: 'ice %', mapTo: 17 },
      34 : { id: 34, name: 'light %', mapTo: 18 },
      35 : { id: 35, name: 'dark %', mapTo: 19 },
      36 : { id: 36, name: 'fire def', mapTo: 20 },
      37 : { id: 37, name: 'ice def', mapTo: 21 },
      38 : { id: 38, name: 'light def', mapTo: 22 },
      39 : { id: 39, name: 'dark def', mapTo: 23 },
      58 : { id: 58, name: 'hp%', mapTo: 4075 },
      59 : { id: 59, name: 'mp%', mapTo: 4076 },
      65 : { id: 65, name: 'range' },
      76 : { id: 76, name: 'movement speed', mapTo: 74 },
      87 : { id: 87, name: 'str%', mapTo: 4050 },
      88 : { id: 88, name: 'agi%', mapTo: 4051 },
      89 : { id: 89, name: 'int%', mapTo: 4052 },
      90 : { id: 90, name: 'vit%', mapTo: 4053 },
      134 : { id: 134, name: 'physicial defense%' },
      185 : { id: 185, name: 'wots attack power', mapTo: 3000 },
      251 : { id: 251, name: 'critical chance%', mapTo: 1012 },
      164 : { id: 164, name: 'intToPdmg', mapTo: 10164 },
      165 : { id: 165, name: 'strToMdmg', mapTo: 10165 },
      222: {
        id: 222, 
        name: 'hellfire', 
        getVals: function(val) {
          if(val.indexOf(';') > 0) {
            var vals = val.split(';');
            return [
              {id: 62, effect: 222, max: Number(vals[0])/100.0},
              {id: 4012, effect: 222, max: Number(vals[1])},
              ];
          }
          else {
            return [{id: 62, effect: 222, max: Number(val)/100.0}];
          }
        }
      },
    },
    
    customItems: 
    [
    {id: 0, typeName:'custom', name: 'wise plate fix', stats: [{id: 52, max:-0.001}]},
    {id: 0, typeName:'custom', name: 'hp unified', stats: [{id: 4075, max:0.05}]},
    ],
  
    getStats : function(data) {
      var currentState = 1;
      var statVals = []
      for(;;) {
        
        var stateProp = 'State' + currentState;
        if(stateProp in data) {
          
          var stateId = data[stateProp];
          if(stateId == -1) {
            break;
          }
          
          var currentData = {};
          
          var prop;
        
          prop = 'State' + currentState + '_Max';
          if(prop in data) {
            currentData.max = data[prop];
          }
          
          prop = 'State' + currentState + 'Value';
          if(prop in data) {
            currentData.max = data[prop];
          }
          
          prop = 'StateValue' + currentState;
          if(prop in data) {
            currentData.max = Number(data[prop]);
          }
          
          prop = 'State' + currentState + '_Min';
          if(prop in data && currentData.max != data[prop]) {
            currentData.min = Number(data[prop]);
          }
          
          prop = 'State' + currentState + '_GenProb';
          if(prop in data) {
            currentData.genProb = data[prop];
          }
          
          prop = 'NeedSetNum' + currentState;
          if(prop in data) {
            if(data[prop] == 0) {
              break;
            }
            currentData.needSetNum = data[prop];
          }
          
          this.setupStat(currentData, stateId);

          currentState++;
          
          if(currentData.max > 0 ||
            currentData.max < 0 ||
            currentData.min < 0 ||
            currentData.min > 0) {
              
            statVals.push(currentData);
          }
        }
        else {
          break;
        }
      }
      
      return statVals;
    },
    
    setupStat : function(stat, id) {
      stat.id = Number(id);
    },
    
    mergeStats : function(stats1, stats2) {
      var statMap = {};
      
      var self = this;
      function add(value) {
        
        var amount = Number(value.max);
        if(self.stats[value.id] && 'pc' in self.stats[value.id]) {
          amount = Math.floor(amount);
        }
        
        if(value.id in statMap) {
          statMap[value.id] += amount;
        }
        else {
          statMap[value.id] = amount;
        }
      }
      
      angular.forEach(stats1, function(value, key) {
        if(value) {
          add(value);
        }
      });
      
      if(stats2) {
        angular.forEach(stats2, function(value, key) {
          if(value) {
            add(value);
          }
        });
      }
      
      var newStats = [];
      
      for(var key in statMap) {
        var stat = { max : statMap[key] };
        this.setupStat(stat, key);
        newStats.push(stat);
      }
        
      return newStats;
    }
  }
}

})();