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
      10 : {id: 10, name: 'para', display: toNoDec, pc: 60 },
      11 : {id: 11, name: 'para resist', display: toNoDec, pc: 61 },
      12 : {id: 12, name: 'crit', display: toNoDec, type: 'dps', pc: 62 },
      13 : {id: 13, name: 'crit resist', display: toNoDec, pc: 63 },
      14 : {id: 14, name: 'stun', display: toNoDec, pc: 64 },
      15 : {id: 15, name: 'stun resist', display: toNoDec, pc: 65 },
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
      60 : {id: 60, name: 'para%', display: toPercent },
      61 : {id: 61, name: 'para resist%', display: toPercent },
      62 : {id: 62, name: 'crit%', display: toPercent },
      63 : {id: 63, name: 'crit resist%', display: toPercent },
      64 : {id: 64, name: 'stun%', display: toPercent },
      65 : {id: 65, name: 'stun resist%', display: toPercent },
      74 : {id: 74, name: 'move%', display: toPercent },
      75 : {id: 75, name: 'hp%', display: toPercent },
      76 : {id: 76, name: 'mp%', display: toPercent },
      77 : {id: 77, name: 'mp recover%', display: toPercent },
      81 : {id: 81, name: 'safe move%', display: toPercent },

      // these are both min and max
      // shows with the same name but these are used really just for set bonus I think
      101 : {id: 101, name: 'pdmg%', display: toPercent },
      102 : {id: 102, name: 'mdmg%', display: toPercent },

      103: {id: 103, name: 'crit dmg', display: toNoDec, type: 'dps', pc: 104 },
      104: {id: 104, name: 'crit dmg%', display: toPercent },
      107: {id: 107, name: 'mp?', display: toNoDec, hide: true },
      
      // stats below here are ones I made up
      1001: {id: 1001, name: 'avg dmg', display: inThousands, summaryDisplay: true },
      1004: {id: 1004, name: 'avg pdmg', display: inThousands, summaryDisplay: true },
      1006: {id: 1006, name: 'avg mdmg', display: inThousands, summaryDisplay: true },
      
      1008: {id: 1008, name: 'pdef', display: toPercent },
      1009: {id: 1009, name: 'mdef', display: toPercent },
      
      1012: {id: 1012, name: 'crit chance', display: toPercent },
      1029: {id: 1029, name: 'fd calc', display: toPercent },
      1103: {id: 1103, name: 'crit dmg', display: toPercent },
      
      2008: {id: 2008, name: 'pdef eqhp', display: inThousands },
      2009: {id: 2009, name: 'mdef eqhp', display: inThousands },
      
      3000: {id: 3000, name: 'atk pwr', display: toPercent },
      3008: {id: 3008, name: 'avg eqhp', display: inThousands, summaryDisplay: true },
      
      4050: {id: 4050, name: 'skStr%', display: toPercent },
      4051: {id: 4051, name: 'skAgi%', display: toPercent },
      4052: {id: 4052, name: 'skInt%', display: toPercent },
      4053: {id: 4053, name: 'skVit%', display: toPercent },
      4075: {id: 4075, name: 'skHp%', display: toPercent },
      4076: {id: 4076, name: 'skMp%', display: toPercent },
      
      // special cases for skills
      10164: {id: 10164, name: 'intToPdmg', display: toPercent },
      10165: {id: 10165, name: 'strToMdmg', display: toPercent },
      
      
      // 8001: {id: 8001, name: 'whiteDMG', display: toOneDec },
      // 8002: {id: 8002, name: 'greenDMG', display: toOneDec },
      // 8003: {id: 8003, name: 'blueDMG', display: toOneDec },
      
      // items over 10000 are unknown skill effects
    },
  
    rankNames : {
      0 : { id: 0, name : 'normal', checked: true },
      1 : { id: 1, name : 'magic', checked: true },
      2 : { id: 2, name : 'rare', checked: true },
      3 : { id: 3, name : 'epic', checked: true },
      4 : { id: 4, name : 'unique', checked: true },
      5 : { id: 5, name : 'legendary', checked: true },
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
      0 : { id: 0, name: 'not elemental' },
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
    
    skillEffectMapping : {
      2 : { id: 2, name: 'phyisical attack power' },
      13 : { id: 13, name: 'mp', mapTo: 26 },
      25 : { id: 25, name: 'action speed' },
      29 : { id: 29, name: 'magic attack power', mapTo: 3000 },
      32 : { id: 34, name: 'fire %', mapTo: 16 },
      33 : { id: 35, name: 'ice %', mapTo: 17 },
      34 : { id: 34, name: 'light %', mapTo: 18 },
      35 : { id: 35, name: 'dark %', mapTo: 19 },
      36 : { id: 38, name: 'fire def', mapTo: 20 },
      37 : { id: 38, name: 'ice def', mapTo: 21 },
      38 : { id: 38, name: 'light def', mapTo: 22 },
      39 : { id: 38, name: 'dark def', mapTo: 23 },
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
      10164 : { id: 10164, name: 'intToPdmg', mapTo: 10164 },
      10165 : { id: 10165, name: 'strToMdmg', mapTo: 10165 },
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