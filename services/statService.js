(function () {
'use strict';

angular.module('dnsim').factory('statHelper', ['hCodeValues',statHelper]);
function statHelper(hCodeValues) {

  return {
    
    getSetStats: function(groupItems) {
      var stats = [];
      var sets = {};
      
      angular.forEach(groupItems, function(value, key) {
        if(value != null && value.setStats != null) {
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
    
    getCombinedStats: function(groupItems) {
      var stats = [];
      
      angular.forEach(groupItems, function(value, key) {
        if(value != null) {
          
          if(value.fullStats != null) {
            stats = hCodeValues.mergeStats(stats, value.fullStats);
          }
          else {
            stats = hCodeValues.mergeStats(stats, value.stats);
          }
        }
      });
      
      return stats;
    },
    
    getCalculatedStats: function(group, combinedStats) {
      
      var retVal = [];
      var statLookup = {};
      if(!group.conversions || !group.enemyStatCaps) {
        return [];
      }
      
      angular.forEach(combinedStats, function(stat, index) {
        statLookup[stat.id] = stat;
      });
      
      function getPc(stat) {
        var statDef = hCodeValues.stats[stat.id];
        if(statLookup[statDef.pc]) {
          return Number(statLookup[statDef.pc].max);
        }
        else {
          return 0;
        }
      }
      
      function getSkillPc(stat) {
        var statDef = hCodeValues.stats[stat.id];
        if(statLookup[statDef.skPc]) {
          return Number(statLookup[statDef.skPc].max);
        }
        else {
          return 0;
        }
      }
      
      function applyPc(stat) {
        stat.max = Math.floor(
          stat.max * (1+getPc(stat)) * (1+getSkillPc(stat))
          );
      }
      
      function dupeStat(id) {
        var stat = statLookup[id];
        if(stat) {
          return {id: id, max: Number(stat.max), pc: stat.pc};
        }
        else {
          return {id: id, max: 0, pc: 0};
        }
      }
      
      function addStat(stat) {
        if(stat.max > 0) {
          retVal.push(stat);
        }
      }
      
      // base stats
      var str = dupeStat(0);
      applyPc(str);
      addStat(str);
      
      var agi = dupeStat(1);
      applyPc(agi);
      addStat(agi);
      
      var int = dupeStat(2);
      applyPc(int);
      addStat(int);

      var vit = dupeStat(3);
      applyPc(vit);
      addStat(vit);

      // add vit to hp
      var hp = dupeStat(25);
      hp.max += (vit.max * Number(group.conversions.HP));
      applyPc(hp);
      addStat(hp);
      
      // defs
      var def = dupeStat(8);
      def.max += (vit.max * Number(group.conversions.PhysicalDefense));
      applyPc(def);
      addStat(def);
      
      var defpc = dupeStat(1008);
      // defpc.max = Math.max(0.85, Number(def.max)/Number(group.enemyStatCaps.Cdefense));
      defpc.max = Math.min(0.85,def.max/Number(group.enemyStatCaps.Cdefense));
      addStat(defpc);
      
      var mdef = dupeStat(9);
      mdef.max += (int.max * Number(group.conversions.MagicDefense));
      applyPc(mdef);
      addStat(mdef);
      
      var mdefpc = dupeStat(1009);
      // mdefpc.max = Math.max(0.85, Number(mdef.max)/Number(group.enemyStatCaps.Cdefense));
      mdefpc.max = Math.min(0.85,mdef.max/Number(group.enemyStatCaps.Cdefense));
      addStat(mdefpc);
      
      // attack power - like fd but for bufs
      // this shows as blue damage
      // i think there are magic and phis variants of this but doesnt matter
      var aPwr = dupeStat(3000);

      // physical damage
      if(!group.damageType || group.damageType.id != 2) {
        var extraPdmg = dupeStat(32);
        var extraPdmgMod= dupeStat(101);
        
        // special stats for zeal
        var intToPdmg = dupeStat(10164);
        
        var minPdmg = dupeStat(4);
        minPdmg.max += extraPdmg.max;
        minPdmg.max += Math.floor(str.max*Number(group.conversions.StrengthAttack));
        minPdmg.max += Math.floor(agi.max*Number(group.conversions.AgilityAttack));
        
        minPdmg.max = Math.floor(minPdmg.max*(1+(getPc(minPdmg) + extraPdmgMod.max)));
        minPdmg.max = Math.floor(minPdmg.max * (1+aPwr.max));
        minPdmg.max += Math.floor(intToPdmg.max * int.max);
        addStat(minPdmg);
  
        var maxPdmg = dupeStat(5);
        maxPdmg.max += extraPdmg.max;
        maxPdmg.max += Math.floor(str.max*Number(group.conversions.StrengthAttack));
        maxPdmg.max += Math.floor(agi.max*Number(group.conversions.AgilityAttack));
        
        maxPdmg.max = Math.floor(maxPdmg.max*(1+(getPc(maxPdmg) + extraPdmgMod.max)));
        maxPdmg.max = Math.floor(maxPdmg.max * (1+aPwr.max));
        maxPdmg.max += Math.floor(intToPdmg.max * int.max);
        addStat(maxPdmg);
      }
      
      // magic damage
      if(!group.damageType || group.damageType.id != 1) {
        var extraMdmg = dupeStat(33);
        var extraMdmgMod = dupeStat(102);
        
        // special stats for zeal
        var strToMdmg = dupeStat(10165);
        
        var minMdmg = dupeStat(6);
        minMdmg.max += extraMdmg.max;
        minMdmg.max += Math.floor(int.max*Number(group.conversions.IntelligenceAttack));

        minMdmg.max = Math.floor(minMdmg.max*(1+(getPc(minMdmg) + extraMdmgMod.max)));
        minMdmg.max = minMdmg.max * (1+aPwr.max);
        minMdmg.max += Math.floor(strToMdmg.max * str.max);
        addStat(minMdmg);
        
        var maxMdmg = dupeStat(7);
        maxMdmg.max += extraMdmg.max;
        maxMdmg.max += (int.max*Number(group.conversions.IntelligenceAttack));
        
        maxMdmg.max = Math.floor(maxMdmg.max*(1+(getPc(maxMdmg) + extraMdmgMod.max)));
        maxMdmg.max = maxMdmg.max * (1+aPwr.max);
        maxMdmg.max += Math.floor(strToMdmg.max * str.max);
        addStat(maxMdmg);
      }
      
      
      // crit chance %
      var crit = dupeStat(12);
      crit.max += (agi.max*Number(group.conversions.Critical));
      applyPc(crit);
      addStat(crit);
      
      var critChance = Math.min(0.89, crit.max / Number(group.enemyStatCaps.Ccritical));
      retVal.push({id: 1012, max: critChance})

      // crit damage %
      var cDmg = dupeStat(103);
      cDmg.max += ((str.max+int.max) * Number(group.conversions.StrengthIntelligenceToCriticalDamage));
      applyPc(cDmg);
      addStat(cDmg);

      var critDamagePc = cDmg.max / group.enemyStatCaps.CcriticalDamage;
      addStat({id: 1103, max: critDamagePc + 2});

      // fd
      var fd = dupeStat(29);
      addStat(fd);
      var maxFd = Number(group.enemyStatCaps.Cfinaldamage);
      
      var fdPc = dupeStat(1029);
      fdPc.max = Math.min(Math.max(0.35*Number(fd.max)/maxFd,Math.pow(Number(fd.max)/maxFd,2.2)),1);
      addStat(fdPc);
      
      function addAvgDamageStat(id, min, max) {
        
        var avgDmg = (min+max)/2;
        avgDmg += (critChance * (critDamagePc+1) * avgDmg * 0.75);
        avgDmg = avgDmg * (1 + fdPc.max);
        
        if(group.element && group.element.id > 0) {
          var elementStat = statLookup[hCodeValues.elements[group.element.id].dmgStat];
          if(elementStat) {
            addStat(elementStat);
            avgDmg = avgDmg * (1+Number(elementStat.max));
          }
        }
        
        addStat({id: id, max: avgDmg});
      }
      
      // average damages
      if(!group.damageType || group.damageType.id == 1 || group.damageType.id == 0) {
        addAvgDamageStat(1004, minPdmg.max, maxPdmg.max);
      }

      if(!group.damageType || group.damageType.id == 2 || group.damageType.id == 0) {
        addAvgDamageStat(1006, minMdmg.max, maxMdmg.max);
      }
      
      if(!group.damageType || group.damageType.id == 3) {
        addAvgDamageStat(1001, minMdmg.max+minPdmg.max, maxMdmg.max+maxPdmg.max);
      }
      
      // Equivalent HP
      var pdefEqHp = dupeStat(2008);
      pdefEqHp.max = hp.max / (1-defpc.max);
      
      var mdefEqHp = dupeStat(2009);
      mdefEqHp.max = hp.max / (1-mdefpc.max);
      
      var eqHp = dupeStat(3008);
      eqHp.max = (pdefEqHp.max + mdefEqHp.max) / 2;
      addStat(eqHp);
      
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
    },
    
    getSkillStats : function (item, skillData) {

      var skillLevelVals = null;
      angular.forEach(skillData, function(value, index) {
        if(value.SkillIndex == item.id && value.SkillLevel == item.enchantmentNum) {
          skillLevelVals = value;
          return;
        }
      });
      
      if(!skillLevelVals) {
        return null;
      }
      
      var index = 1;
      var effects = [];
      var stillCols = true;
      
      while(stillCols) {
        var colName = 'EffectClass' + index;
        var valColName = 'EffectClassValue' + index;
        if(item.d && colName in item.d && valColName in skillLevelVals) {
          if(item.d[colName] > 0) {
            
            // for now add 10k
            var effectId = item.d[colName];
            var statId = 10000 + effectId;
            var map = hCodeValues.skillEffectMapping[effectId];
            if(map && map.mapTo) {
              statId = map.mapTo;
            }
            
            var val = skillLevelVals[valColName];
            if(val > 0) {
              effects.push({ id: statId, effect: effectId, max: val });
            }
            else {
              if(val.toString().indexOf(';') > 0) {
                var vals = val.split(';');
                if(vals.length > 0 && vals[0] > 0) {
                  effects.push({ id: statId, effect: effectId, max: vals[0] });
                }
              }
            }
          }
        }
        else {
          stillCols = false;
        }
        
        index++;
      }
      
      return effects;
    },

    getBuildStats: function(build) {
      var stats = {};
      stats.nakedStats = this.getNakedStats(build);
      stats.combinedStats = this.getCombinedStats(build.items);
      stats.setStats = this.getSetStats(build.items);
      stats.allStats = hCodeValues.mergeStats(stats.nakedStats, stats.combinedStats);
      stats.allStats = hCodeValues.mergeStats(stats.allStats, stats.setStats);
      if(build.heroStats != null && build.heroStats.length > 0) {
        stats.heroStats = build.heroStats;
        stats.allStats = hCodeValues.mergeStats(stats.allStats, build.heroStats);
      }
      
      stats.calculatedStats = this.getCalculatedStats(build, stats.allStats);
      return stats;
    }
  }
}

})();