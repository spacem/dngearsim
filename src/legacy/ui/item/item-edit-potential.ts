import { Item } from 'src/models/item';
import { StatDef } from 'src/models/stat-def';

angular.module('dnsim').controller('itemEditPotentialCtrl',

  ['dntData', 'items', 'hCodeValues', 'itemColumnsToLoad', 'statHelper',
    function (dntData, items, hCodeValues, itemColumnsToLoad, statHelper) {
      'use strict';

      var vm = this;

      this.potentials = null;
      this.potential = null;
      this.changingPotentials = false;
      this.potentialStats = {};
      this.searchStats = [{ name: ''}, ...Object.values(hCodeValues.stats).filter((s: StatDef) => s.searchable)];

      if (this.item == null) return;

      if ('itemSource' in this.item) {
        this.itemType = items[this.item.itemSource];
      }

      if (!this.itemType || !this.item.pid || !('potentialDnt' in this.itemType)) {
        return;
      }

      this.init = async function() {
        if (vm.itemType.potentialDnt) {
          await dntData.init(vm.itemType.potentialDnt, itemColumnsToLoad.potentialDnt);
          await dntData.init(vm.itemType.mainDnt, itemColumnsToLoad.mainDnt);
        }
        this.getPotentials();
      };

      this.filterPotential = function() {
        vm.potentials = null;
        vm.getPotentials();
      };

      this.getPotentials = function () {
        if (!vm.potentials) {
          if (vm.item && vm.item.pid && 'potentialDnt' in vm.itemType) {
            let potentials = dntData.find(vm.itemType.potentialDnt, 'id', vm.item.pid);

            if (potentials.length == 1) {
              vm.potential = potentials[0];
              vm.potentials = dntData.find(vm.itemType.potentialDnt, 'PotentialID', vm.potential.PotentialID);
              vm.potentialStats = getPotentialStats();
            }
            else if ('potentialDntEx' in vm.itemType) {
              potentials = dntData.find(vm.itemType.potentialDntEx, 'id', vm.item.pid);

              if (potentials.length == 1) {
                vm.potential = potentials[0];
                vm.potentials = dntData.find(vm.itemType.potentialDntEx, 'PotentialID', vm.potential.PotentialID);
                vm.potentialStats = getPotentialStats();
              }
            }

            if (vm.searchStat && vm.searchStat.id) {
              for (const p of vm.potentials) {
                if (vm.potentialStats[p.id].find(s => s.id == vm.searchStat.id) == null) {
                  delete vm.potentialStats[p.id];
                }
              }
            }

            if (vm.potentialStats) {
              vm.potentialAffects = {};
              for (var pid in vm.potentialStats) {
                vm.potentialAffects[pid] = vm.getAffects(vm.potentialStats[pid]);
              }
            }
          }
        }

        return vm.potentials;
      };

      this.changePotential = function (pid) {
        for (var i = 0; i < vm.potentials.length; ++i) {
          if (pid == vm.potentials[i].id) {
            vm.potential = vm.potentials[i];
            vm.item.pid = vm.potential.id;
            vm.changingPotentials = false;
            vm.onChange();
            return;
          }
        }
      };

      this.getAffects = function(itemStats) {
        const results = [];
        for (const stat in hCodeValues.stats) {
          if (hCodeValues.stats[stat].summaryDisplay) {
            results.push({
              amount: vm.getAffectAmount(stat, itemStats),
              statId: stat
            });
          }
        }
        return results;
      };

      this.getAffectAmount = function (stat, itemStats) {
        if (!vm.build || !vm.build.items) {
          return 0;
        }

        let newItems = [];
        let found = null;
        for (const item of vm.build.items) {
          if (found || item.id != vm.item.id || item.pid != vm.item.pid) {
            newItems.push(item);
          } else {
            found = item;
          }
        }

        if (!found) {
          return 0;
        }

        const newItem: Item = {};
        Object.assign(newItem, vm.item);
        if (found.enchantmentStats) {
          newItem.fullStats = vm.item.fullStats = hCodeValues.mergeStats(found.enchantmentStats, itemStats);
        } else {
          newItem.fullStats = vm.item.fullStats = itemStats;
        }
        newItems.push(newItem);

        const newStats = statHelper.getCalculatedStatsFromItems(vm.build, newItems);
        const origStats = statHelper.getCalculatedStatsFromItems(vm.build, vm.build.items);
        const newAffectAmount = getStat(stat, newStats).max;
        const oldAffectAmount = getStat(stat, origStats).max;
        const percent = calcStatPercent(newAffectAmount, oldAffectAmount);
        return percent;
      };

      this.getStatName = function(id) {
        return statHelper.getStatName(vm.build, id);
      };

      function getStat(id, stats) {
        const len = stats.length;
        for (var i = 0; i < len; ++i) {
          if (stats[i].id == id) {
            return stats[i];
          }
        }
        return { id: id, max: 0 };
      }

      function calcStatPercent(newVal, origVal) {
        if (newVal && origVal) {
          return Math.round(10000 * ((newVal - origVal) / origVal)) / 100;
        } else {
          return 0;
        }
      }

      function getPotentialStats() {
        const retVal = {};

        if (vm.potentials != null) {
          let iStats = [];
          if (vm.itemType) {
            const d = dntData.find(vm.itemType.mainDnt, 'id', vm.item.id);
            if (d && d.length) {
              iStats = hCodeValues.getStats(d[0]);
            }
          }
          for (const p of vm.potentials) {
            const pStats = hCodeValues.getStats(p);
            retVal[p.id] = hCodeValues.mergeStats(pStats, iStats);
          }
        }

        return retVal;
      }

      this.init();

    }])
  .directive('dngearsimItemEditPotential', function () {
    return {
      scope: true,
      bindToController: {
        item: '=item',
        build: '=build',
        onChange: '&onChange',
      },
      controller: 'itemEditPotentialCtrl',
      controllerAs: 'editCtrl',
      template: require('./item-edit-potential.html')
    };
  });