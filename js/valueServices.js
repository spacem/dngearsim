var m = angular.module('valueServices', []);
m.factory('hCodeValues', [function() {
  
  function toOneDec(stat) {
    return Math.round(stat.max*10)/10;
  }
  function toNoDec(stat) {
    return Math.round(stat.max);
  }
  function toPercent(stat) {
    return (Math.round(stat.max*1000)/10) + '%';
  }
  
  return {
    stats : {
      0  : {id: 0, name: 'str', display: toNoDec, type: 'dps', pc: 50 },
      1  : {id: 1, name: 'agi', display: toNoDec, type: 'dps', pc: 51 },
      2  : {id: 2, name: 'int', display: toNoDec, type: 'dps', pc: 52 },
      3  : {id: 3, name: 'vit', display: toNoDec, type: 'def', pc: 53 },
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
      25 : {id: 25, name: 'hp', display: toNoDec, type: 'def', pc: 75 },
      26 : {id: 26, name: 'mp', display: toNoDec, pc: 76 },
      29 : {id: 29, name: 'fd', display: toNoDec, type: 'dps' },
      50 : {id: 50, name: 'str%', display: toPercent },
      51 : {id: 51, name: 'agi%', display: toPercent },
      52 : {id: 32, name: 'int%', display: toPercent },
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
      103: {id: 103, name: 'crit dmg', display: toNoDec, type: 'dps', pc: 104 },
      104: {id: 104, name: 'crit dmg%', display: toPercent },
      107: {id: 107, name: 'mp?', display: toNoDec, hide: true },
      
      1029: {id: 1000, name: 'fd%', display: toPercent },
      1012: {id: 1001, name: 'crit chance%', display: toPercent },
      1103: {id: 1001, name: 'crit damage%', display: toPercent },
      
      1004: {id: 1004, name: 'avg pdmg', display: toNoDec },
      1006: {id: 1006, name: 'avg mdmg', display: toNoDec },
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
          
          if(currentData.num != 0 ||
            currentData.max != 0 ||
            currentData.min != 0) {
              
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
      stat.id = id;
    },
    
    mergeStats : function(stats1, stats2) {
      var statMap = {};
      
      
      angular.forEach(stats1, function(value, key) {
        if(value.id in statMap) {
          statMap[value.id] += Number(value.max);
        }
        else {
          statMap[value.id] = Number(value.max);
        }
      });
      
      angular.forEach(stats2, function(value, key) {
        if(value.id in statMap) {
          statMap[value.id] += Number(value.max);
        }
        else {
          statMap[value.id] = Number(value.max);
        }
      });
      
      var newStats = [];
      
      for(var key in statMap) {
        var stat = { max : statMap[key] };
        this.setupStat(stat, key);
        newStats.push(stat);
      }
        
      return newStats;
    }
  }
}]);


m.factory('statHelper', ['hCodeValues',function(hCodeValues) {

  return {
    
    getCombinedStats: function(group) {
      var stats = [];
      var sets = {};
      
      angular.forEach(group.items, function(value, key) {
        stats = hCodeValues.mergeStats(stats, value.stats);
        
        if(value.enchantmentStats != null) {
          stats = hCodeValues.mergeStats(stats, value.enchantmentStats);
        }
        if(value.setStats != null) {
          if(value.setId in sets) {
            sets[value.setId].numItems++;
          }
          else {
            sets[value.setId] = { numItems : 1, stats : value.setStats };
          }
        }
      });
      
      angular.forEach(sets, function(value, key) {
        var setStats = [];
        angular.forEach(value.stats, function(stat, index) {
          if(stat.needSetNum <= value.numItems) {
            stats = hCodeValues.mergeStats(stats, [stat]);
          }
        });
      });
      
      return stats;
    },
    
    getCalculatedStats: function(group, combinedStats) {
      var statLookup = {};
      var retVal = [];
      angular.forEach(combinedStats, function(stat, index) {
        statLookup[stat.id] = stat;
      });
      
      function applyPc(stat) {
        var statDef = hCodeValues.stats[stat.id];
        if(statLookup[statDef.pc]) {
          return {id:stat.id, max: Number(stat.max)*(1+Number(statLookup[statDef.pc].max))}
        }
        else {
          return stat;
        }
      }
      
      var str = statLookup[0];
      if(str) {
        str = applyPc(str);
        retVal.push(str);
      }
      
      var agi = statLookup[1];
      if(agi) {
        agi = applyPc(agi);
        retVal.push(agi);
      }
      
      var int = statLookup[2];
      if(int) {
        int = applyPc(int);
        retVal.push(int);
      }
      
      var critDamagePc = 0;
      var critChance = 0;
      var minPdmg = {max:0};
      var maxPdmg = {max:0};
      var minMdmg = {max:0};
      var maxMdmg = {max:0};
      if(group.conversions) {
        
        var vit = statLookup[3];
        if(vit) {
          vit = applyPc(vit);
        }
        var hp = statLookup[25];
        if(hp) {
          hp = {id:hp.id, max:Number(hp.max)};
        }
        else {
          hp = {id:25, max:0};
        }
        
        if(vit) {
          hp.max += Number(vit.max) * Number(group.conversions.HP);
        }
        retVal.push(applyPc(hp));
        
        function getPdmg(id) {
          var dmg = statLookup[id];
          if(!dmg) {
            dmg = {id:id, max:0};
          }
          var val = Number(dmg.max);
          if(str) {
            val += (Number(str.max)*Number(group.conversions.StrengthAttack));
          }
          if(agi) {
            val += (Number(agi.max)*Number(group.conversions.AgilityAttack));
          }
          
          return applyPc({id: dmg.id, max:val});
        }
        
        minPdmg = getPdmg(4);
        if(minPdmg.max > 0) {
          retVal.push(minPdmg);
        }
        maxPdmg = getPdmg(5);
        if(maxPdmg.max > 0) {
          retVal.push(maxPdmg);
        }
        
        function getMdmg(id) {
          var dmg = statLookup[id];
          if(!dmg) {
            dmg = {id:id, max:0};
          }
          var val = Number(dmg.max);
          if(int) {
            val += (Number(int.max)*Number(group.conversions.IntelligenceAttack));
          }
          
          return applyPc({id: dmg.id, max:val});
        }
        
        minMdmg = getMdmg(6);
        if(minMdmg.max > 0) {
          retVal.push(minMdmg);
        }
        maxMdmg = getMdmg(7);
        if(maxMdmg.max > 0) {
          retVal.push(maxMdmg);
        }
        
        if(group.enemyStatCaps) {
          var crit = statLookup[12];
          if(!crit) {
            crit = {id:12,max:0};
          }
          var val = Number(applyPc(crit).max);
          if(agi) {
            val += (Number(agi.max)*Number(group.conversions.Critical));
          }
          
          critChance = Math.min(0.89, val / Number(group.enemyStatCaps.Ccritical));
          retVal.push({id: 1012, max: critChance})
          
          var intAndStr = 0
          if(str) {
            intAndStr += Number(str.max);
          }
          if(int) {
            intAndStr += Number(int.max);
          }
          
          var critDamage = intAndStr * Number(group.conversions.StrengthIntelligenceToCriticalDamage);
          var cDmg = statLookup[103];
          if(cDmg) {
            critDamage += Number(cDmg.max);
          }
          
          if(critDamage > 0) {
            cDmg = {id:103,max:critDamage}
            cDmg = applyPc(cDmg);
  
            critDamagePc = cDmg.max / group.enemyStatCaps.CcriticalDamage;
            retVal.push({id: 1103, max: critDamagePc + 2})
          }
        }
      }
        
      var fd = statLookup[29];
      var fdPc = 0;
      if(fd && group.enemyStatCaps) {
        var maxFd = Number(group.enemyStatCaps.Cfinaldamage);
        fdPc = Math.min(Math.max(0.35*Number(fd.max)/maxFd,Math.pow(Number(fd.max)/maxFd,2.2)),1);
        // var fdPc = 0.35*fd.max/maxFd;
        // var fdPc = Math.pow(fd.max/maxFd,2.2);
        
        retVal.push({id: 1029, max: fdPc})
      }
      
      var avgPdmg = (maxPdmg.max+minPdmg.max)/2;
      avgPdmg += (critChance * (critDamagePc+1) * avgPdmg);
      avgPdmg = avgPdmg * (1 + fdPc);
      if(avgPdmg > 0) {
        retVal.push({id: 1004, max: avgPdmg});
      }
            
      var avgMdmg = (maxMdmg.max+minMdmg.max)/2;
      avgMdmg += (critChance * (critDamagePc+1) * avgMdmg);
      avgMdmg = avgMdmg * (1 + fdPc);
      if(avgMdmg > 0) {
        retVal.push({id: 1006, max: avgMdmg});
      }
      
      return retVal;
    },
    
    getNakedStats: function(group) {
      
      if(
        group.baseStats && 
        group.baseStats.Strength > 0) {

        return [
          {id:0, max:group.baseStats.Strength},
          {id:1, max:group.baseStats.Agility},
          {id:2, max:group.baseStats.Intelligence},
          {id:3, max:group.baseStats.Stamina}
          ];
      }
      else {
        return [];
      }
    }
  }
}]);