import { Item } from 'src/models/item';
import { Build } from 'src/models/build';
import { Stat } from 'src/models/stat';

class StatCalc {
  retVal = [];
  statLookup = {};

  constructor(combinedStats: Stat[], private valueService: any) {
    for (const stat of combinedStats) {
      this.statLookup[stat.id] = stat;
    }
  }

  getPc(stat) {
    const statDef = this.valueService.stats[stat.id];
    if (this.statLookup[statDef.pc]) {
      return Number(this.statLookup[statDef.pc].max);
    } else {
      return 0;
    }
  }

  getSkillPc(stat) {
    const statDef = this.valueService.stats[stat.id];
    if (this.statLookup[statDef.skPc]) {
      return Number(this.statLookup[statDef.skPc].max);
    } else {
      return 0;
    }
  }

  applyPc(stat) {
    stat.max += Math.floor(stat.max * this.getPc(stat));
    stat.max += Math.floor(stat.max * this.getSkillPc(stat));
  }

  dupeStat(id) {
    const stat = this.statLookup[id];
    if (stat) {
      return { id: id, max: Number(stat.max), pc: stat.pc };
    } else {
      return { id: id, max: 0, pc: 0 };
    }
  }

  addStat(stat) {
    if (stat.max > 0) {
      this.retVal.push(stat);
    }
  }
}

(function () {
  'use strict';

  angular.module('dnsim').factory('statHelper', ['hCodeValues', statHelper]);
  function statHelper(hCodeValues) {
    return {

      getSetStats(groupItems) {
        const stats = [];
        const sets = {};

        angular.forEach(groupItems, function (value, key) {
          if (value !== null && value.setStats != null) {
            if (value.setId in sets) {
              sets[value.setId].numItems++;
            } else {
              sets[value.setId] = { numItems: 1, stats: value.setStats };
            }
          }
        });

        angular.forEach(sets, function (value, key) {
          angular.forEach(value.stats, function (stat, index) {
            if (stat.needSetNum <= value.numItems) {
              stats.push(stat);
            }
          });
        });

        return hCodeValues.mergeStats(stats);
      },

      getNumItemsForSet(items: Item[], setId: number) {
        let numItems = 0;
        for (const value of items) {
          if (value && value.setId && value.setId == setId) {
            numItems++;
          }
        }

        return numItems;
      },

      getCombinedStats(groupItems: Item[]) {
        let stats = [];

        for (const value of groupItems) {
          if (value) {

            if (value.fullStats) {
              stats = stats.concat(value.fullStats);
            } else if (value.stats) {
              stats = stats.concat(value.stats);
            }
          }
        }

        return hCodeValues.mergeStats(stats);
      },

      getCalculatedStatsFromItems(group: Build, items: Item[]) {
        const nakedStats = this.getNakedStats(group);
        const combinedStats = this.getCombinedStats(items);
        const setStats = this.getSetStats(items);
        let allStats = nakedStats.concat(combinedStats).concat(setStats);
        if (group.heroStats != null && group.heroStats.length > 0) {
          allStats = allStats.concat(group.heroStats);
        }
        allStats = hCodeValues.mergeStats(allStats);

        return this.getCalculatedStats(group, allStats);
      },

      getCalculatedStats: function (group: Build, combinedStats: Stat[]) {

        if (!group.conversions || !group.enemyStatCaps || !group.playerStatCaps) {
          return [];
        }

        const calc = new StatCalc(combinedStats, hCodeValues);

        let critResist;
        if (!('critResist' in group)) {
          critResist = 0.20;
        } else {
          critResist = group.critResist / 100.0;
        }

        let eleResist;
        if (!('eleResist' in group)) {
          eleResist = 0;
        } else {
          eleResist = group.eleResist / 100.0;
        }

        // base stats
        const str = calc.dupeStat(0);
        calc.applyPc(str);
        const skStr = calc.dupeStat(4000);
        str.max += skStr.max;

        const agi = calc.dupeStat(1);
        calc.applyPc(agi);
        const skAgi = calc.dupeStat(4001);
        agi.max += skAgi.max;

        const int = calc.dupeStat(2);
        calc.applyPc(int);
        const skInt = calc.dupeStat(4002);
        int.max += skInt.max;

        const vit = calc.dupeStat(3);
        calc.applyPc(vit);
        const skVit = calc.dupeStat(4003);
        vit.max += skVit.max;

        // add vit to hp
        const hp = calc.dupeStat(25);
        hp.max += (vit.max * Number(group.conversions.HP));
        calc.applyPc(hp);

        // defs
        const def = calc.dupeStat(8);
        def.max += (vit.max * Number(group.conversions.PhysicalDefense));
        calc.applyPc(def);
        const skDef = calc.dupeStat(4008);
        def.max += skDef.max;

        const defpc = calc.dupeStat(1008);
        // defpc.max = Math.max(0.85, Number(def.max)/Number(group.enemyStatCaps.Cdefense));
        defpc.max = Math.min(0.85, def.max / Number(group.enemyStatCaps.Cdefense));
        // const skDefPc = calc.dupeStat(4058);
        // defpc.max += skDefPc.max; // TODO: need to confirm this is how to calculate def% skill
        calc.addStat(defpc);

        const mdef = calc.dupeStat(9);
        mdef.max += (int.max * Number(group.conversions.MagicDefense));
        calc.applyPc(mdef);
        const skMDef = calc.dupeStat(4009);
        mdef.max += skMDef.max;

        const mdefpc = calc.dupeStat(1009);
        // mdefpc.max = Math.max(0.85, Number(mdef.max)/Number(group.enemyStatCaps.Cdefense));
        mdefpc.max = Math.min(0.85, mdef.max / Number(group.enemyStatCaps.Cdefense));
        // const skMDefPc = calc.dupeStat(4059);
        // mdefpc.max += skMDefPc.max; // TODO: need to confirm this is how to calculate def% skill
        calc.addStat(mdefpc);

        // attack power - like fd but for bufs
        // this shows as blue damage
        // i think there are magic and phis variants of this but doesnt matter
        var aPwr = calc.dupeStat(3000);

        var minPdmg = calc.dupeStat(4);
        var maxPdmg = calc.dupeStat(5);

        // physical damage
        if (!group.damageType || (group.damageType.id != 2 && group.damageType.id != 5)) {
          var extraPdmg = calc.dupeStat(32);
          var extraPdmgMod = calc.dupeStat(101);
          var paPwr = calc.dupeStat(3001);
          var skPdmg = calc.dupeStat(4032);

          // special stats for zeal
          var intToPdmg = calc.dupeStat(10164);

          // special stat for ah
          var strToPdmg = calc.dupeStat(103721);

          minPdmg.max += extraPdmg.max;
          minPdmg.max += Math.floor(str.max * Number(group.conversions.StrengthAttack));
          minPdmg.max += Math.floor(agi.max * Number(group.conversions.AgilityAttack));

          minPdmg.max += Math.floor(minPdmg.max * (calc.getPc(minPdmg) + extraPdmgMod.max));
          minPdmg.max += Math.floor(minPdmg.max * (aPwr.max + paPwr.max));
          minPdmg.max += Math.floor(intToPdmg.max * int.max);
          minPdmg.max += Math.floor(strToPdmg.max * str.max);
          minPdmg.max += Math.floor(skPdmg.max);
          calc.addStat(minPdmg);

          maxPdmg.max += extraPdmg.max;
          maxPdmg.max += Math.floor(str.max * Number(group.conversions.StrengthAttack));
          maxPdmg.max += Math.floor(agi.max * Number(group.conversions.AgilityAttack));

          maxPdmg.max += Math.floor(maxPdmg.max * (calc.getPc(maxPdmg) + extraPdmgMod.max));
          maxPdmg.max += Math.floor(maxPdmg.max * (aPwr.max + paPwr.max));
          maxPdmg.max += Math.floor(intToPdmg.max * int.max);
          maxPdmg.max += Math.floor(strToPdmg.max * str.max);
          maxPdmg.max += Math.floor(skPdmg.max);
          calc.addStat(maxPdmg);
        }

        var minMdmg = calc.dupeStat(6);
        var maxMdmg = calc.dupeStat(7);

        // magic damage
        if (!group.damageType || (group.damageType.id != 1 && group.damageType.id != 4)) {
          var extraMdmg = calc.dupeStat(33);
          var extraMdmgMod = calc.dupeStat(102);
          var maPwr = calc.dupeStat(3002);
          var skMdmg = calc.dupeStat(4033);

          // special stats for zeal
          var strToMdmg = calc.dupeStat(10165);
          var intToMdmg = calc.dupeStat(10372);

          minMdmg.max += extraMdmg.max;
          minMdmg.max += Math.floor(int.max * Number(group.conversions.IntelligenceAttack));

          minMdmg.max += Math.floor(minMdmg.max * (calc.getPc(minMdmg) + extraMdmgMod.max));
          minMdmg.max += Math.floor(minMdmg.max * (aPwr.max + maPwr.max));
          minMdmg.max += Math.floor(strToMdmg.max * str.max);
          minMdmg.max += Math.floor(intToMdmg.max * int.max);
          minMdmg.max += Math.floor(skMdmg.max);
          calc.addStat(minMdmg);

          maxMdmg.max += extraMdmg.max;
          maxMdmg.max += (int.max * Number(group.conversions.IntelligenceAttack));

          maxMdmg.max += Math.floor(maxMdmg.max * (calc.getPc(maxMdmg) + extraMdmgMod.max));
          maxMdmg.max += Math.floor(maxMdmg.max * (aPwr.max + maPwr.max));
          maxMdmg.max += Math.floor(strToMdmg.max * str.max);
          maxMdmg.max += Math.floor(intToMdmg.max * int.max);
          maxMdmg.max += Math.floor(skMdmg.max);
          calc.addStat(maxMdmg);
        }

        // crit chance %
        const crit = calc.dupeStat(12);
        crit.max += (agi.max * Number(group.conversions.Critical));
        calc.applyPc(crit);

        const skCrit = calc.dupeStat(4012);
        crit.max += skCrit.max;
        const skCritPc = calc.dupeStat(4062);
        if (skCritPc.max) {
          crit.max += Math.floor(crit.max * skCritPc.max);
        }
        calc.addStat(crit);
        var itemCrit = calc.dupeStat(1012);

        var critChance = Math.min(0.89, (crit.max / Number(group.enemyStatCaps.Ccritical)) + itemCrit.max);
        calc.addStat({id: 1012, max: critChance});

        let agiToCdmg = 0;
        if(Number(group.conversions.AgilityToCriticalDamage) > 0) {
          agiToCdmg = Number(group.conversions.AgilityToCriticalDamage);
        }

        let strToCdmg = 0;
        if(Number(group.conversions.StrengthToCriticalDamage) > 0) {
          strToCdmg = Number(group.conversions.StrengthToCriticalDamage);
        } else if(Number(group.conversions.StrengthIntelligenceToCriticalDamage)) {
          strToCdmg = Number(group.conversions.StrengthIntelligenceToCriticalDamage);
        }

        let intToCdmg = 0;
        if(Number(group.conversions.IntelligenceToCriticalDamage) > 0) {
          intToCdmg = Number(group.conversions.IntelligenceToCriticalDamage);
        } else if(Number(group.conversions.StrengthIntelligenceToCriticalDamage)) {
          intToCdmg = Number(group.conversions.StrengthIntelligenceToCriticalDamage);
        }
  
        // crit damage %
        var cDmg = calc.dupeStat(103);
        cDmg.max += ((str.max) * strToCdmg);
        cDmg.max += ((agi.max) * agiToCdmg);
        cDmg.max += ((int.max) * intToCdmg);
        calc.applyPc(cDmg);
        calc.addStat(cDmg);

        var itemCtriDmg = calc.dupeStat(1103);
        var critDamagePc = Math.min(1, (cDmg.max / group.playerStatCaps.CcriticalDamage) + itemCtriDmg.max);
        calc.addStat({ id: 1103, max: critDamagePc + 2 });

        // fd
        var fd = calc.dupeStat(29);
        fd.max += Math.floor(fd.max * (calc.getPc(fd)));
        calc.addStat(fd);
        var maxFd = Number(group.enemyStatCaps.Cfinaldamage);

        var fdSkill = calc.dupeStat(10389);
        var newFdPc = calc.dupeStat(1030);
        newFdPc.max += fdSkill.max + Math.min(1, (fd.max / maxFd));
        calc.addStat(newFdPc);

        // TODO: how is this calculated
        // var fdUnifiedSkill = calc.dupeStat(4079);

        var secElementId = 0;
        var priElementId = 0;
        if (group.element) {
          priElementId = hCodeValues.elements[group.element.id].dmgStat;
        }
        else {
          priElementId = 0;
        }
        if (group.secondaryElement) {
          secElementId = hCodeValues.elements[group.secondaryElement.id].dmgStat;
        }
        else {
          secElementId = 0;
        }

        var allElementStat = calc.dupeStat(88);

        // elements
        var firePc = calc.dupeStat(16);
        firePc.max += allElementStat.max;
        if (firePc.id == priElementId || firePc.id == secElementId) {
          calc.addStat(firePc);
        }

        var icePc = calc.dupeStat(17);
        icePc.max += allElementStat.max;
        if (icePc.id == priElementId || icePc.id == secElementId) {
          calc.addStat(icePc);
        }

        var lightPc = calc.dupeStat(18);
        lightPc.max += allElementStat.max;
        if (lightPc.id == priElementId || lightPc.id == secElementId) {
          calc.addStat(lightPc);
        }

        var darkPc = calc.dupeStat(19);
        darkPc.max += allElementStat.max;
        if (darkPc.id == priElementId || darkPc.id == secElementId) {
          calc.addStat(darkPc);
        }

        // average damage
        function addAvgDamageStat(id, min, max) {

          var nonEleDamage = (min + max) / 2;
          // add crit
          nonEleDamage += (critChance * (critDamagePc + 1) * nonEleDamage * (1 - critResist));
          // apply fd
          nonEleDamage += Math.floor(nonEleDamage * newFdPc.max);

          // apply element(s)
          var avgDmg = nonEleDamage;
          if (priElementId > 0) {
            var elementStat = calc.dupeStat(priElementId);
            if (elementStat) {
              elementStat.max += allElementStat.max;
              avgDmg = avgDmg * (1 + Number(elementStat.max)) * (1 - Number(eleResist));
            }
          }
          calc.addStat({ id: id, max: avgDmg });

          if (secElementId != priElementId) {
            if (secElementId > 0) {
              var secondaryElementStat = calc.dupeStat(secElementId);
              if (secondaryElementStat) {
                secondaryElementStat.max += allElementStat.max;
                var secAvgDmg = nonEleDamage * (1 + Number(secondaryElementStat.max)) * (1 - Number(eleResist));
                calc.addStat({ id: id + 1000, max: secAvgDmg });
              }
            }
            else {
              calc.addStat({ id: id + 1000, max: nonEleDamage });
            }
          }
        }

        // average damages
        if (!group.damageType || group.damageType.id == 1 || group.damageType.id == 0 || group.damageType.id == 4) {
          addAvgDamageStat(1004, minPdmg.max, maxPdmg.max);
        }

        if (!group.damageType || group.damageType.id == 2 || group.damageType.id == 0 || group.damageType.id == 5) {
          addAvgDamageStat(1006, minMdmg.max, maxMdmg.max);
        }

        if (!group.damageType || group.damageType.id == 3) {
          addAvgDamageStat(1001, minMdmg.max + minPdmg.max, maxMdmg.max + maxPdmg.max);
        }

        if (group.damageType && group.damageType.id == 4) {
          calc.addStat({ id: 1005, max: (minPdmg.max + maxPdmg.max) / 2 });
        }

        if (group.damageType && group.damageType.id == 5) {
          calc.addStat({ id: 1007, max: (minMdmg.max + maxMdmg.max) / 2 });
        }

        // Equivalent HP
        var pdefEqHp = calc.dupeStat(2008);
        pdefEqHp.max = hp.max / (1 - defpc.max);

        var mdefEqHp = calc.dupeStat(2009);
        mdefEqHp.max = hp.max / (1 - mdefpc.max);

        var eqHp = calc.dupeStat(3008);
        // eqHp.max = (pdefEqHp.max + mdefEqHp.max) / 2;
        eqHp.max = pdefEqHp.max;
        calc.addStat(eqHp);

        calc.addStat(str);
        calc.addStat(agi);
        calc.addStat(int);
        calc.addStat(vit);
        calc.addStat(hp);
        calc.addStat(def);
        calc.addStat(mdef);

        return calc.retVal;
      },

      getNakedStats(group: Build) {

        if (
          group.baseStats &&
          group.baseStats.Strength > 0) {

          return [
            { id: 0, max: group.baseStats.Strength },
            { id: 1, max: group.baseStats.Agility },
            { id: 2, max: group.baseStats.Intelligence },
            { id: 3, max: group.baseStats.Stamina }
          ];
        } else {
          return [];
        }
      },

      getSkillStats(item: Item, data: any, skillData: any[]) {

        let skillLevelVals = null;
        for (const value of skillData) {
          if (value.SkillIndex == item.id && value.SkillLevel == item.enchantmentNum) {
            skillLevelVals = value;
            break;
          }
        }

        if (!skillLevelVals) {
          return null;
        }

        return this.getSkillStatValues(data, skillLevelVals);
      },

      getSkillStatValues(data: any, skillLevelVals: any) {

        let index = 1;
        const effects = [];
        let stillCols = true;

        while (stillCols) {
          const colName = 'EffectClass' + index;
          const valColName = 'EffectClassValue' + index;
          if (data && colName in data && valColName in skillLevelVals) {
            if (data[colName] > 0) {
              const effectId = data[colName];
              const val = skillLevelVals[valColName];

              const map = hCodeValues.skillEffectMapping[effectId];
              if (map && map.getVals && map.getVals(val)) {
                const vals = map.getVals(val);
                for (let i = 0; i < vals.length; ++i) {
                  effects.push(vals[i]);
                }
              } else if (map && map.mapTo >= 0) {
                effects.push({ id: map.mapTo, effect: effectId, max: val });
              } else {
                // CAN ENABLE THIS TO DEBUG UNUSED STAT VALUES
                // effects.push({ id: -effectId, effect: effectId, max: val });
              }
            }
          } else {
            stillCols = false;
          }

          index++;
        }

        return effects;
      },

      getBuildStats: function (build) {
        const stats: any = {};
        stats.nakedStats = this.getNakedStats(build);
        stats.combinedStats = this.getCombinedStats(build.items);
        stats.setStats = this.getSetStats(build.items);
        stats.allStats = stats.nakedStats.concat(stats.combinedStats).concat(stats.setStats);
        if (build.heroStats && build.heroStats.length) {
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