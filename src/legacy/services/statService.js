(function () {
  'use strict';
  
  angular.module('dnsim').factory('statHelper', ['hCodeValues',statHelper]);
  function statHelper(hCodeValues) {
  
    return {
      
      getSetStats: function(groupItems) {
        var stats = [];
        var sets = {};
        
        angular.forEach(groupItems, function(value, key) {
          if(value !== null && value.setStats != null) {
            if(value.setId in sets) {
              sets[value.setId].numItems++;
            }
            else {
              sets[value.setId] = { numItems : 1, stats : value.setStats };
            }
          }
        });
        
        angular.forEach(sets, function(value, key) {
          angular.forEach(value.stats, function(stat, index) {
            if(stat.needSetNum <= value.numItems) {
              stats.push(stat);
            }
          });
        });
        
        return hCodeValues.mergeStats(stats);
      },
      
      getNumItemsForSet: function(items, setId) {
        var numItems = 0;
        angular.forEach(items, function(value, key) {
          if(value && value.setId && value.setId == setId) {
            numItems++;
          }
        });
        
        return numItems;
      },
      
      getCombinedStats: function(groupItems) {
        var stats = [];
        
        angular.forEach(groupItems, function(value, key) {
          if(value) {
            
            if(value.fullStats) {
              stats = stats.concat(value.fullStats);
            }
            else if(value.stats) {
              stats = stats.concat(value.stats);
            }
          }
        });
        
        return hCodeValues.mergeStats(stats);
      },
      
      getCalculatedStatsFromItems: function(group, items) {
        var nakedStats = this.getNakedStats(group);
        var combinedStats = this.getCombinedStats(items);
        var setStats = this.getSetStats(items);
        var allStats = nakedStats.concat(combinedStats).concat(setStats);
        if(group.heroStats != null && group.heroStats.length > 0) {
          allStats = allStats.concat(group.heroStats);
        }
        allStats = hCodeValues.mergeStats(allStats);
        
        return this.getCalculatedStats(group, allStats);
      },
      
      getCalculatedStats: function(group, combinedStats) {
        
        var retVal = [];
        var statLookup = {};
        if(!group.conversions || !group.enemyStatCaps || !group.playerStatCaps) {
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
  
        var critResist;
        if(!('critResist' in group)) {
          critResist = 0.20;
        }
        else {
          critResist = group.critResist / 100.0;
        }
  
        var eleResist;
        if(!('eleResist' in group)) {
          eleResist = 0;
        }
        else {
          eleResist = group.eleResist / 100.0;
        }
        
        // base stats
        var str = dupeStat(0);
        applyPc(str);
        
        var agi = dupeStat(1);
        applyPc(agi);
        
        var int = dupeStat(2);
        applyPc(int);
  
        var vit = dupeStat(3);
        applyPc(vit);
  
        // add vit to hp
        var hp = dupeStat(25);
        hp.max += (vit.max * Number(group.conversions.HP));
        applyPc(hp);
        
        // defs
        var def = dupeStat(8);
        def.max += (vit.max * Number(group.conversions.PhysicalDefense));
        applyPc(def);
        
        var defpc = dupeStat(1008);
        // defpc.max = Math.max(0.85, Number(def.max)/Number(group.enemyStatCaps.Cdefense));
        defpc.max = Math.min(0.85,def.max/Number(group.enemyStatCaps.Cdefense));
        addStat(defpc);
        
        var mdef = dupeStat(9);
        mdef.max += (int.max * Number(group.conversions.MagicDefense));
        applyPc(mdef);
        
        var mdefpc = dupeStat(1009);
        // mdefpc.max = Math.max(0.85, Number(mdef.max)/Number(group.enemyStatCaps.Cdefense));
        mdefpc.max = Math.min(0.85,mdef.max/Number(group.enemyStatCaps.Cdefense));
        addStat(mdefpc);
        
        // attack power - like fd but for bufs
        // this shows as blue damage
        // i think there are magic and phis variants of this but doesnt matter
        var aPwr = dupeStat(3000);
        
        var minPdmg = dupeStat(4);
        var maxPdmg = dupeStat(5);
  
        // physical damage
        if(!group.damageType || (group.damageType.id != 2 && group.damageType.id != 5)) {
          var extraPdmg = dupeStat(32);
          var extraPdmgMod= dupeStat(101);
          var paPwr = dupeStat(3001);
          
          // special stats for zeal
          var intToPdmg = dupeStat(10164);

          // special stat for ah
          var strToPdmg = dupeStat(103721);
          
          minPdmg.max += extraPdmg.max;
          minPdmg.max += Math.floor(str.max*Number(group.conversions.StrengthAttack));
          minPdmg.max += Math.floor(agi.max*Number(group.conversions.AgilityAttack));
          
          minPdmg.max = Math.floor(minPdmg.max*(1+(getPc(minPdmg) + extraPdmgMod.max)));
          minPdmg.max = Math.floor(minPdmg.max * (1+aPwr.max+paPwr.max));
          minPdmg.max += Math.floor(intToPdmg.max * int.max);
          minPdmg.max += Math.floor(strToPdmg.max * str.max);
          addStat(minPdmg);
    
          maxPdmg.max += extraPdmg.max;
          maxPdmg.max += Math.floor(str.max*Number(group.conversions.StrengthAttack));
          maxPdmg.max += Math.floor(agi.max*Number(group.conversions.AgilityAttack));
          
          maxPdmg.max = Math.floor(maxPdmg.max*(1+(getPc(maxPdmg) + extraPdmgMod.max)));
          maxPdmg.max = Math.floor(maxPdmg.max * (1+aPwr.max+paPwr.max));
          maxPdmg.max += Math.floor(intToPdmg.max * int.max);
          maxPdmg.max += Math.floor(strToPdmg.max * str.max);
          addStat(maxPdmg);
        }
        
        var minMdmg = dupeStat(6);
        var maxMdmg = dupeStat(7);
        
        // magic damage
        if(!group.damageType || (group.damageType.id != 1 && group.damageType.id != 4)) {
          var extraMdmg = dupeStat(33);
          var extraMdmgMod = dupeStat(102);
          var maPwr = dupeStat(3002);
          
          // special stats for zeal
          var strToMdmg = dupeStat(10165);
          var intToMdmg = dupeStat(10372);
          
          minMdmg.max += extraMdmg.max;
          minMdmg.max += Math.floor(int.max*Number(group.conversions.IntelligenceAttack));
  
          minMdmg.max = Math.floor(minMdmg.max*(1+(getPc(minMdmg) + extraMdmgMod.max)));
          minMdmg.max = minMdmg.max * (1+aPwr.max+maPwr.max);
          minMdmg.max += Math.floor(strToMdmg.max * str.max);
          minMdmg.max += Math.floor(intToMdmg.max * int.max);
          addStat(minMdmg);
          
          maxMdmg.max += extraMdmg.max;
          maxMdmg.max += (int.max*Number(group.conversions.IntelligenceAttack));
          
          maxMdmg.max = Math.floor(maxMdmg.max*(1+(getPc(maxMdmg) + extraMdmgMod.max)));
          maxMdmg.max = maxMdmg.max * (1+aPwr.max+maPwr.max);
          maxMdmg.max += Math.floor(strToMdmg.max * str.max);
          maxMdmg.max += Math.floor(intToMdmg.max * int.max);
          addStat(maxMdmg);
        }
        
        
        // crit chance %
        var crit = dupeStat(12);
        crit.max += (agi.max*Number(group.conversions.Critical));
        applyPc(crit);
        
        var skCrit = dupeStat(4012);
        crit.max += skCrit.max;
        addStat(crit);
        var itemCrit = dupeStat(1012);
        
        var critChance = Math.min(0.89, (crit.max / Number(group.enemyStatCaps.Ccritical)) + itemCrit.max);
        retVal.push({id: 1012, max: critChance});
  
        // crit damage %
        var cDmg = dupeStat(103);
        cDmg.max += ((str.max+int.max) * Number(group.conversions.StrengthIntelligenceToCriticalDamage));
        applyPc(cDmg);
        addStat(cDmg);
  
        var itemCtriDmg = dupeStat(1103);
        var critDamagePc = Math.min(1, (cDmg.max / group.playerStatCaps.CcriticalDamage) + itemCtriDmg.max);
        addStat({id: 1103, max: critDamagePc + 2});
  
        // fd
        var fd = dupeStat(29);
        addStat(fd);
        var maxFd = Number(group.enemyStatCaps.Cfinaldamage);
        
        var fdSkill = dupeStat(10389);
        var newFdPc = dupeStat(1030);
        newFdPc.max += fdSkill.max + Math.min(1, (fd.max / maxFd));
        addStat(newFdPc);
        
        var secElementId = 0;
        var priElementId = 0;
        if(group.element) {
          priElementId = hCodeValues.elements[group.element.id].dmgStat;
        }
        else {
          priElementId = 0;
        }
        if(group.secondaryElement) {
          secElementId = hCodeValues.elements[group.secondaryElement.id].dmgStat;
        }
        else {
          secElementId = 0;
        }

        var allElementStat = dupeStat(88);
        
        // elements
        var firePc = dupeStat(16);
        firePc.max += allElementStat.max;
        if(firePc.id == priElementId || firePc.id == secElementId) {
          addStat(firePc);
        }
        
        var icePc = dupeStat(17);
        icePc.max += allElementStat.max;
        if(icePc.id == priElementId || icePc.id == secElementId) {
          addStat(icePc);
        }
        
        var lightPc = dupeStat(18);
        lightPc.max += allElementStat.max;
        if(lightPc.id == priElementId || lightPc.id == secElementId) {
          addStat(lightPc);
        }
        
        var darkPc = dupeStat(19);
        darkPc.max += allElementStat.max;
        if(darkPc.id == priElementId || darkPc.id == secElementId) {
          addStat(darkPc);
        }
        
        // average damage
        function addAvgDamageStat(id, min, max) {
          
          var nonEleDamage = (min+max)/2;
          // add crit
          nonEleDamage += (critChance * (critDamagePc+1) * nonEleDamage * (1 - critResist));
          // apply fd
          nonEleDamage = nonEleDamage * (1 + newFdPc.max);
          
          // apply element(s)
          var avgDmg = nonEleDamage;
          if(priElementId > 0) {
            var elementStat = statLookup[priElementId];
            if(elementStat) {
              avgDmg = avgDmg * (1 + Number(elementStat.max)) * (1 - Number(eleResist));
            }
          }
          addStat({id: id, max: avgDmg});
          
          if(secElementId != priElementId) {
            if(secElementId > 0) {
              var secondaryElementStat = statLookup[secElementId];
              if(secondaryElementStat) {
                var secAvgDmg = nonEleDamage * (1+Number(secondaryElementStat.max)) * (1 - Number(eleResist));
                addStat({id: id + 1000, max: secAvgDmg});
              }
            }
            else {
              addStat({id: id + 1000, max: nonEleDamage});
            }
          }
        }
        
        // average damages
        if(!group.damageType || group.damageType.id == 1 || group.damageType.id == 0 || group.damageType.id == 4) {
          addAvgDamageStat(1004, minPdmg.max, maxPdmg.max);
        }
  
        if(!group.damageType || group.damageType.id == 2 || group.damageType.id == 0 || group.damageType.id == 5) {
          addAvgDamageStat(1006, minMdmg.max, maxMdmg.max);
        }
        
        if(!group.damageType || group.damageType.id == 3) {
          addAvgDamageStat(1001, minMdmg.max+minPdmg.max, maxMdmg.max+maxPdmg.max);
        }
        
        if(group.damageType && group.damageType.id == 4) {
          addStat({id: 1005, max: (minPdmg.max + maxPdmg.max)/2});
        }
        
        if(group.damageType && group.damageType.id == 5) {
          addStat({id: 1007, max: (minMdmg.max + maxMdmg.max)/2});
        }
        
        // Equivalent HP
        var pdefEqHp = dupeStat(2008);
        pdefEqHp.max = hp.max / (1-defpc.max);
        
        var mdefEqHp = dupeStat(2009);
        mdefEqHp.max = hp.max / (1-mdefpc.max);
        
        var eqHp = dupeStat(3008);
        // eqHp.max = (pdefEqHp.max + mdefEqHp.max) / 2;
        eqHp.max = pdefEqHp.max;
        addStat(eqHp);

        addStat(str);
        addStat(agi);
        addStat(int);
        addStat(vit);
        addStat(hp);
        addStat(def);
        addStat(mdef);
        
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
      
      getSkillStats : function (item, data, skillData) {
  
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
          if(data && colName in data && valColName in skillLevelVals) {
            if(data[colName] > 0) {
              var effectId = data[colName];
              var val = skillLevelVals[valColName];
                        
              var map = hCodeValues.skillEffectMapping[effectId];
              if(map && map.getVals && map.getVals(val)) {
                var vals = map.getVals(val);
                for (var i=0;i<vals.length;++i) {
                  effects.push(vals[i]);
                }
              }
              else if(map && map.mapTo) {
                effects.push({ id: map.mapTo, effect: effectId, max: val });
              }
              else {
                // CAN ENABLE THIS TO DEBUG UNUSED STAT VALUES
                // effects.push({ id: -effectId, effect: effectId, max: val });
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
        stats.allStats = stats.nakedStats.concat(stats.combinedStats).concat(stats.setStats);
        if(build.heroStats && build.heroStats.length) {
          stats.heroStats = build.heroStats;
          stats.allStats = stats.allStats.concat(build.heroStats);
        }
        stats.allStats = hCodeValues.mergeStats(stats.allStats);
        
        stats.calculatedStats = this.getCalculatedStats(build, stats.allStats);
        return stats;
      }
    };
  }
  
  })();