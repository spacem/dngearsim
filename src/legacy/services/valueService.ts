import { StatLookup } from 'src/values/stat-values';
import { ShopNameLookup } from 'src/values/shop-names';
import { RankNameLookup } from 'src/values/rank-names';
import { Stat } from 'src/models/stat';
import { ElementLookup } from 'src/values/elements';
import { DamageTypeLookup } from 'src/values/damage-types';
import { ItemTypeNameLookup } from 'src/values/item-type-names';
import { SkillEffectLookup } from 'src/values/skill-effects';
import { GemExchanges } from 'src/values/gem-exchanges';

angular.module('dnsim').factory('hCodeValues', [hCodeValues]);
function hCodeValues() {

  return {
    stats: StatLookup,
    rankNames: RankNameLookup,
    shopNames: ShopNameLookup,
    typeNames: ItemTypeNameLookup,
    elements: ElementLookup,
    damageTypes: DamageTypeLookup,
    skillEffectMapping: SkillEffectLookup,
    gemExchanges: GemExchanges,

    checkedRank: {
      0: true,
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
    },

    customItems:
      [
        { id: 0, typeName: 'custom', name: 'hp unified', stats: [{ id: 4075, max: 0.05 }] },
      ],

    getStats: function (data) {

      let useMax = false;
      let useStateXVal = false;
      let mightHaveSets = true;
      if ('State1_Max' in data) {
        useMax = true;
      } else {
        if ('State1Value' in data) {
          useStateXVal = true;
        }
      }

      let currentState = 0;
      const statVals = [];
      for (; ;) {
        currentState++;

        const stateProp = 'State' + currentState;
        if (!(stateProp in data)) {
          break;
        }

        const stateId = Number(data[stateProp]);
        if (stateId === -1) {
          break;
        }

        if (stateId === 107) {
          // is this mp?
        } else {

          const currentData: Stat = { id: stateId, max: 0 };

          let prop: string;
          if (useMax) {
            prop = 'State' + currentState + '_Max';
            currentData.max = data[prop];
          } else if (useStateXVal) {
            prop = 'State' + currentState + 'Value';
            currentData.max = data[prop];
          } else {
            prop = 'StateValue' + currentState;
            currentData.max = Number(data[prop]);
          }

          if (currentData.max > 0 || currentData.max < 0) {
            if (mightHaveSets) {
              prop = 'NeedSetNum' + currentState;
              if (prop in data) {
                if (Number(data[prop]) === 0) {
                  break;
                }
                currentData.needSetNum = data[prop];
              } else {
                mightHaveSets = false;
              }
            }

            statVals.push(currentData);
          }
        }
      }

      return statVals;
    },

    mergeStats: function (stats1: Stat[], stats2?: Stat[]) {
      const statMap = {};
      function add(value) {

        let amount = Number(value.max);
        if (StatLookup[value.id] && 'pc' in StatLookup[value.id]) {
          amount = Math.floor(amount);
        }

        if (value.id in statMap) {
          statMap[value.id] += amount;
        } else {
          statMap[value.id] = amount;
        }
      }


      for (const value of stats1) {
        if (value) {
          add(value);
        }
      }

      if (stats2) {
        for (const value of stats2) {
          if (value) {
            add(value);
          }
        }
      }

      const newStats = [];

      for (const key of Object.keys(statMap)) {
        const stat = { max: statMap[key], id: Number(key) };
        newStats.push(stat);
      }

      return newStats;
    }
  };
}
