import * as _ from 'lodash';
import * as angular from 'angular';

angular.module('dnsim').factory('itemCategory',
  ['itemFactory', 'items', 'dntData', itemCategory]);
function itemCategory(itemFactory, items, dntData) {

  return {
    categories: [
      { path: 'everything', name: 'everything', searchType: 'everything', hideInBuild: true },
      { path: 'titles', name: 'titles', sourceType: 'titles', hideRank: true, hideJob: true, hideLevel: true, numItemText: '1', maxCat: 1 },
      { path: 'hero-titles', name: 'hero titles', sourceType: 'titles', searchType: 'hero-titles' },
      { path: 'weapons', name: 'weapons', sourceType: 'equipment', numItemText: '2', maxExchange: 1, maxCat: 2, limitExchange: [1, 2] },
      { path: 'armour', name: 'armour', sourceType: 'equipment', numItemText: '5', maxExchange: 1, maxCat: 5, limitExchange: [3, 4, 5, 6, 7] },
      { path: 'accessories', name: 'accessories', sourceType: 'equipment', hideJob: true, maxCat: 4, maxExchange: 2, limitExchange: [8, 9, 10], tId: 7604 },
      { path: 'offensive-gems', name: 'offensive gems', sourceType: 'gems', hideJob: true, limitExchange: [54], limitGemTypes: [1], tId: 'attack dragon jade' },
      { path: 'increasing-gems', name: 'increasing gems', sourceType: 'gems', hideJob: true, limitExchange: [54, 55], limitGemTypes: [2, 3], tId: 1000118219 },
      { path: 'enhancement-plates', name: 'enhancement plates', sourceType: 'plates', hideJob: true, numItemText: '8+3', maxCat: 11, maxExchange: 15, limitExchange: [33], limitRank: [0, 1, 2, 3], tId: 8039 },
      { path: 'expedition-plates', name: 'expedition plates', sourceType: 'plates', hideRank: true, hideJob: true, numItemText: '4', maxCat: 4, maxExchange: 15, limitExchange: [33], limitRank: [4, 5], tId: 1000054497 },
      { path: 'talisman', name: 'talisman', sourceType: 'talisman', hideJob: true, numItemText: '8+4', maxCat: 12, maxExchange: 12, limitExchange: [52, 53], tId: 1000054149 },
      { path: 'costume', name: 'costume', sourceType: 'cash', numItemText: '7', maxCat: 7, maxExchange: 1, hideLevel: true, limitExchange: [16, 17, 18, 19, 20, 21, 22], tId: 7607 },
      { path: 'imprint', name: 'imprint', sourceType: 'imprint', numItemText: '10', maxCat: 10, hideLevel: true, hideJob: true, tId: 1000108314 },
      { path: 'cash', name: 'cash', sourceType: 'cash', numItemText: '8', maxCat: 8, maxExchange: 2, hideJob: true, hideLevel: true, limitExchange: [23, 24, 25, 26, 27, 28, 29], tId: 7608 },
      { path: 'food', name: 'food', sourceType: 'food', hideJob: true, numItemText: '1', limitExchange: [40, 51] },
      { path: 'extras', name: 'extras', sourceType: 'xtras', limitExchange: [47], hideJob: true, hideLevel: true, tId: 4504 },
      { path: 'skills', name: 'skills', searchType: 'skills' },
      { path: 'custom', name: 'custom', searchType: 'custom', hideInSearch: true },
    ],

    byName: function (name) {
      var retVal = null;
      angular.forEach(this.categories, function (category, index) {
        if (category.name == name) {
          retVal = category;
        }
      });

      return retVal;
    },

    byPath: function (name) {
      var retVal = null;
      angular.forEach(this.categories, function (category, index) {
        if (category.path == name) {
          retVal = category;
        }
      });

      return retVal;
    },

    getItems: function (name) {
      var cat = this.byName(name);
      if (cat && 'sourceType' in cat) {
        var retVal = [];
        angular.forEach(items, function (source, sourceName) {
          if (source.type == cat.sourceType && retVal) {
            if (!source.items && !source.loading) {
              itemFactory.loadItems(source);
            }

            if (source.items) {
              retVal = retVal.concat(source.items);
            }
            else {
              retVal = null; // if any are null just return null
            }
          }
        });

        var catItems = [];
        if (retVal) {
          var vm = this;
          angular.forEach(retVal, function (item, index) {
            if (item.typeName == name) {
              catItems.push(item);
            }
            else if (vm.isItemForCat(cat, item, item.data)) {
              item.typeName = name;
              catItems.push(item);
            }
          });
        }

        return catItems;
      }
      else {
        return null;
      }
    },

    isItemForCat: function (cat, item) {

      if (!(item.itemSource in items)) {
        return false;
      }

      if (items[item.itemSource].type != cat.sourceType) {
        return false;
      }

      if (item.itemType == cat.name) {
        return true;
      }

      var anyMatch;
      if (cat.limitExchange) {
        anyMatch = false;
        for (var i = 0; i < cat.limitExchange.length; ++i) {
          if (cat.limitExchange[i] == item.exchangeType || (item.rawData && cat.limitExchange[i] == item.rawData.ExchangeType)) {
            anyMatch = true;
          }
        }

        if (!anyMatch) {
          return false;
        }
      }

      if (cat.limitRank) {
        anyMatch = false;
        for (var i = 0; i < cat.limitRank.length; ++i) {
          if ((item.rank && cat.limitRank[i] == item.rank.id) || (item.rawData && cat.limitRank[i] == item.rawData.Rank)) {
            anyMatch = true;
          }
        }

        if (!anyMatch) {
          return false;
        }
      }

      if (cat.limitGemTypes && cat.limitGemTypes.length) {
        var gemTypes = dntData.find(items.gem.gemDnt, 'id', item.id);
        if (gemTypes.length > 0) {
          return cat.limitGemTypes.find(type => type == gemTypes[0].Type) != null;
        }
      }

      return true;
    },

    init: function (name, complete) {
      return new Promise((res, rej) => {
        var cat = this.byName(name);
        if (cat && 'sourceType' in cat) {
          var sources = _.filter(items, function (source) {
            return (source.type == cat.sourceType);
          });

          var numComplete = 0;
          _.each(sources, function (source) {
            source.init(function () { }, function () {
              numComplete++;
              if (numComplete == sources.length) {
                if (complete) {
                  complete();
                }
                res();
              }
            });
          });
        }
      });
    },

    setItemCategory: function (item, rawData) {
      var vm = this;

      angular.forEach(this.categories, function (cat, index) {
        if (vm.isItemForCat(cat, item, rawData)) {
          item.typeName = cat.name;
        }
      });
    },

    getItemsByCategory: function (items) {
      var itemMap = {};
      if (items) {
        var types = {};
        angular.forEach(items, function (item, index) {
          if (item) {
            if (!(item.typeName in types)) {
              types[item.typeName] = [];
            }
            types[item.typeName].push(item);
          }
        });

        angular.forEach(this.categories, function (category, index) {

          if (category.name in types) {

            var sorted = types[category.name].sort(function (item1, item2) {
              if (category.name == 'talisman') {

                var enh1 = item1.enchantmentNum;
                if (!enh1) enh1 = 0;
                var enh2 = item2.enchantmentNum;
                if (!enh2) enh2 = 0;

                if (enh1 != enh2) {
                  return enh2 - enh1;
                }
              }
              else if (item1.itemSource == 'gem' || item1.itemSource == 'plate') {
                if (item1.gemSlot || item2.gemSlot) {
                  if (!item1.gemSlot) {
                    return 1;
                  }
                  else if (!item2.gemSlot) {
                    return -1;
                  }
                  return item1.gemSlot - item2.gemSlot;
                }
                else if (item2.levelLimit != item1.levelLimit) {
                  return item2.levelLimit - item1.levelLimit;
                }
              }
              else if ('exchangeType' in item1 && 'exchangeType' in item2) {
                return item1.exchangeType - item2.exchangeType;
              }

              return item1.name.localeCompare(item2.name);
            });
            itemMap[category.name] = sorted;
          }
          else {
            itemMap[category.name] = [];
          }
        });

        /*
        angular.forEach(items, function(item, index) {
          if(item && !(item.typeName in itemMap)) {
            // console.log('we dont know ' + item.typeName + ' anymore')
            itemMap.typeError = true;
          }
        });
        */
      }
      return itemMap;
    },
  }
}
