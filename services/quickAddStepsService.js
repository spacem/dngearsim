(function () {
'use strict';

angular.module('dnsim').factory('quickAddSteps', quickAddSteps);
function quickAddSteps(dntData, translations, itemColumnsToLoad, itemCategory,itemFactory,jobs,hCodeValues, quickAddHelper) {

  return {
      exchangeStep: {
        name: 'type',
        getOptions: function(category, build, datas) {
          
          var exchanges = [];
          
          for(var e=0;e<category.limitExchange.length;++e) {
            var exId = category.limitExchange[e];
            
            var numExchange = 0;
            if(build.items) {
              for(var i=0;i<build.items.length;++i) {
                if(build.items[i].exchangeType == exId) {
                  numExchange++;
                }
              }
            }
            
            if(numExchange >= category.maxExchange) {
              continue;
            }
            
            var exchange = dntData.find('exchange.lzjson','ExchangeType',exId);
            var exName = '';
            if(exchange && exchange.length > 0 && exchange[0].NameID > 0) {
              exName = translations.translate(exchange[0].NameID).toLowerCase();
            }
            exchanges.push({id: exId, name: exName.toLowerCase()});
          }
          
          return exchanges;
        },
        matchesItem: function(id, item) {
          return item.exchangeType == id;
        }
      },
      accExchangeStep: {
        name: 'type',
        getOptions: function(category, build, datas) {
          
          var exchanges = [];
          
          for(var e=0;e<category.limitExchange.length;++e) {
            var exId = category.limitExchange[e];
            
            var numExchange = 0;
            for(var i=0;i<build.items.length;++i) {
              if(build.items[i] && build.items[i].exchangeType == exId) {
                numExchange++;
              }
            }
            
            if(exId == 10 || exId == 25) {
              if(numExchange >= 2) {
                continue;
              }
            }
            else {
              if(numExchange >= 1) {
                continue;
              }
            }
            
            var exchange = dntData.find('exchange.lzjson','ExchangeType',exId);
            if(exchange && exchange.length > 0 && exchange[0].NameID > 0) {
              var exName = translations.translate(exchange[0].NameID).toLowerCase();
              
              exchanges.push({id: exId, name: exName.toLowerCase()});
            }
          }
          
          return exchanges;
        },
        matchesItem: function(id, item) {
          return item.exchangeType == id;
        }
      },
      sixtyLevelStep: {
        name: 'level',
        getOptions: function(category, build, datas) {
          
          return [
          { id: 93, name: 'level 93' },
          { id: 90, name: 'level 90' },
          { id: 80, name: 'level 80' },
          { id: 70, name: 'level 70' }, 
          { id: 60, name: 'level 60' }, 
          ];
        },
        matchesItem: function(id, item) {
          return item.levelLimit == id;
        }
      },
      allLevelStep: {
        name: 'level',
        getOptions: function(category, build, datas) {
          
          return [
          { id: 93, name: 'level 93' },
          { id: 90, name: 'level 90' },
          { id: 80, name: 'level 80' },
          { id: 70, name: 'level 70' }, 
          { id: 60, name: 'level 60' }, 
          { id: 50, name: 'level 50' }, 
          { id: 40, name: 'level 40' }, 
          { id: 32, name: 'level 32' }, 
          { id: 24, name: 'level 24' }, 
          ];
        },
        matchesItem: function(id, item) {
          return item.levelLimit == id;
        }
      },
      cashRankStep: {
        name: 'rank',
        getOptions: function(category, build, datas) {
          
          return [
          { id: 4, name: 'unique' },
          { id: 3, name: 'epic' },
          { id: 2, name: 'rare' },
          { id: 1, name: 'magic' },
          { id: 0, name: 'normal' },
          ];
        },
        matchesItem: function(id, item) {
          return item.rank.id == id;
        }
      },
      imprintRankStep: {
        name: 'rank',
        getOptions: function(category, build, datas) {
          
          return [
          { id: 4, name: 'unique' },
          { id: 3, name: 'epic' },
          { id: 2, name: 'rare' },
          ];
        },
        matchesItem: function(id, item) {
          return item.rank.id == id;
        }
      },
      techRankStep: {
        name: 'rank',
        getOptions: function(category, build, datas) {
          
          return [
          { id: 4, name: 'unique' },
          { id: 3, name: 'epic' },
          ];
        },
        matchesItem: function(id, item) {
          return item.rank.id == id;
        }
      },
      talismanRankStep: {
        name: 'rank',
        getOptions: function(category, build, datas) {
          
          return [
          { id: 3, name: 'epic' },
          { id: 2, name: 'rare' },
          { id: 999, name: 'quality high grade' },
          { id: 1, name: 'magic' },
          { id: 0, name: 'normal' },
          ];
        },
        matchesItem: function(id, item) {
          itemFactory.initItem(item);
          if(item.name) {
            // todo: change this to use the name id
            var index = Math.max(
              item.name.indexOf('Quality'),
              item.name.indexOf('High Grade'));
              
            if(id == 999) {
              return index === 0;
            }
            else {
              return item.rank.id == id && index != 0;
            }
          }
          return false;
        }
      },
      gemRankStep: {
        name: 'rank',
        getOptions: function(category, build, datas) {
          
          return [
          { id: 5, name: 'legendary' },
          { id: 999, name: 'quality high grade epic' },
          { id: 3, name: 'epic' },
          ];
        },
        matchesItem: function(id, item) {
          itemFactory.initItem(item);
          if(item.name) {
            var index = Math.max(
              item.name.indexOf('Quality'),
              item.name.indexOf('High Grade'));
            if(id == 999) {
              return item.rank.id == 3 && index >= 0;
            }
            else {
              return item.rank.id == id && index < 0;
            }
          }
          return false;
        }
      },
      plateRankStep: {
        name: 'rank',
        getOptions: function(category, build, datas) {
          
          return [
          { id: 3, name: 'epic' },
          { id: 2, name: 'rare' },
          { id: 1, name: 'normal' },
          ];
        },
        matchesItem: function(id, item) {
          return item.rank.id == id;
        }
      },
      equipRankStep: {
        name: 'rank',
        getOptions: function(category, build, datas) {
          
          return [
          { id: 5, name: 'legendary' },
          { id: 4, name: 'unique' },
          { id: 3, name: 'epic' },
          ];
        },
        matchesItem: function(id, item) {
          return item.rank.id == id;
        }
      },
      enhanceTalismanStep: {
        name: 'slot',
        getOptions: function(category, build, datas) {
          
          return [
          { id: 100, name: '+100% slot' },
          { id: 75, name: '+75% slot' },
          { id: 25, name: '+25% slot' },
          { id: 0, name: '+0% slot' },
          ];
        },
        alterItem: function(id, item) {
          item.enchantmentNum = id;
        }
      },
      titleStep: {
        name: 'select',
        getOptions: function(category, build, datas) {
          var allTitles = quickAddHelper.findData(category, build, datas, 9999);
          var usefulTitles = [];
          for(var i=0;i<allTitles.length;++i) {
            switch(allTitles[i].id) {
              case 1975: // Manticore Expert
              case 1973: // Returned
              case 1008: // Dark Knight
              case 230: // Miraculous
              case 279: // Provoking
              case 2032: // Sharing Goddess's Grief
              case 2033: // Grief-stricken
              case 1313: // Jakard's Demise
              case 2188: // Teary eyed
              // case 1280: // Dragon Tamer
              // case 339: // Cow Wrangler
                usefulTitles.push(allTitles[i]);
                break;
            }
          }
          
          return usefulTitles;
        },
        hasOptions: function(category, build, datas) {
          return true;
        },
        isItemStep: true,
      },
      enhanceStep: {
        name: 'enhance',
        getOptions: function(category, build, datas) {
          
          var item = quickAddHelper.getItem(datas);
          if(item && item.enchantmentId) {
            return [
            { id: 15, name: 'enhance to +15' },
            { id: 14, name: 'enhance to +14' },
            { id: 13, name: 'enhance to +13' },
            { id: 12, name: 'enhance to +12' },
            { id: 11, name: 'enhance to +11' },
            { id: 10, name: 'enhance to +10' },
            { id: 9, name: 'enhance to +9' },
            { id: 8, name: 'enhance to +8' },
            { id: 7, name: 'enhance to +7' },
            { id: 6, name: 'enhance to +6' },
            { id: 5, name: 'enhance to +5' },
            { id: 4, name: 'enhance to +4' },
            { id: 3, name: 'enhance to +3' },
            { id: 2, name: 'enhance to +2' },
            { id: 1, name: 'enhance to +1' },
            { id: 0, name: 'not enhanced' },
            ];
          }
          else {
            return [{ id: 0, name: 'not enhanced' }];
          }
        },
        alterItem: function(id, item) {
          item.enchantmentNum = id;
        }
      },
      itemStep: {
        name: 'select',
        getOptions: function(category, build, datas) {
          return quickAddHelper.findData(category, build, datas);
        },
        isItemStep: true,
        hideName: true,
      },
      namedItemStep: {
        name: 'select',
        getOptions: function(category, build, datas) {
          return quickAddHelper.findData(category, build, datas);
        },
        isItemStep: true,
      },
      techSkillStep: {
        name: 'skill',
        getOptions: function(category, build, datas) {
          var items = quickAddHelper.findData(category, build, datas, 1);
          
          // eventually show all the skills
          // but for now
          if(items.length > 0) {
            return [{id: items[0].skillId, name: items[0].skillId}];
          }
          else {
            return [];
          }
        },
        matchesItem: function(id, item) {
          return item.skillId == id;
        }
      },
      itemNameStep: {
        name: 'item',
        getOptions: function(category, build, datas) {
          var items = quickAddHelper.findData(category, build, datas);
          var itemNames = {};
          var itemNamesList = [];
          for(var i=0;i<items.length;++i) {
            var name = items[i].name;
            if(!(name in itemNames)) {
              itemNames[name] = true;
              itemNamesList.push({
                id: name,
                name: name,
              });
            }
          }
          
          return itemNamesList;
        },
        matchesItem: function(id, item) {
          return item.name == id;
        },
        isItemStep: true,
      },
      distinctItemNameStep: {
        name: 'item',
        getOptions: function(category, build, datas) {
          var items = quickAddHelper.findData(category, build, datas);
          var itemNames = {};
          var itemNamesList = [];
          
          for(var i=0;i<build.items.length;++i) {
            var item = build.items[i];
            itemNames[item.name] = true;
          }
          
          for(var i=0;i<items.length;++i) {
            var name = items[i].name;
            if(!(name in itemNames)) {
              itemNames[name] = true;
              itemNamesList.push({
                id: name,
                name: name,
              });
            }
          }
          
          return itemNamesList;
        },
        matchesItem: function(id, item) {
          return item.name == id;
        },
        isItemStep: true,
      },
      numStatsStep: {
        name: 'Num Stats',
        getOptions: function(category, build, datas) {
          var items = quickAddHelper.findData(category, build, datas);
          var numStats = {};
          
          for(var i=0;i<items.length;++i) {
            var len = 0;
            for(var j=0;j<items[i].stats.length;++j) {
              var stat = hCodeValues.stats[items[i].stats[j].id];
              if(stat && !stat.hide) {
                len++;
              }
            }
            numStats[len + 'x stats'] = len;
          }
          
          var retVal = [];
          for(var val in numStats) {
            retVal.push({
              id: numStats[val],
              name: val,
            });
          }
          
          retVal = retVal.sort(function(a, b) {
              return a.id - b.id;
            });
          
          return retVal;
        },
        matchesItem: function(id, item) {
          var len = 0;
          for(var j=0;j<item.stats.length;++j) {
            var stat = hCodeValues.stats[item.stats[j].id];
            if(stat && !stat.hide) {
              len++;
            }
          }
            
          return len == id;
        },
        isItemStep: true,
      },
      highStatStep: {
        name: 'High Stat',
        getOptions: function(category, build, datas) {
          var items = quickAddHelper.findData(category, build, datas);
            
          var allItem = { id: -1, name: 'all' };
          var retVal = [allItem];
          if(items.length > 1) {
            var allStats = {};
            
            for(var i=0;i<items.length;++i) {
              for(var j=0;j<items[i].stats.length;++j) {
                var stat = hCodeValues.stats[items[i].stats[j].id];
                if(stat && stat.quickHigh && !('high ' + stat.name in allStats)) {
                  allStats['high ' + stat.name] = stat.id;
                }
              }
            }

            for(var val in allStats) {
              retVal.push({
                id: allStats[val],
                name: val,
              });
            }
            
            if(retVal.length <= 2) {
              retVal = [allItem];
            }
            else {
              retVal = retVal.sort(function(a, b) {
                  return a.id - b.id;
                });
            }
          }
          
          return retVal;
        },
        matchesItem: function(id, item) {
          if(id == -1) {
            return true;
          }
          
          var largestVal = 0;
          var selectedVal = 0;
          
          for(var j=0;j<item.stats.length;++j) {
            var val = item.stats[j];
            var stat = hCodeValues.stats[val.id];
            if(stat.quickHigh) {
              if(val.id == id) {
                selectedVal += val.max;
              }
              else if(val.max > largestVal) {
                largestVal = val.max;
              }
            }
          }
          
          return selectedVal > largestVal;
        },
        sortFunc: function(id, item1, item2) {
          var val1 = 0;
          var val2 = 0;
          
          for(var i=0;i<item1.stats.length;++i) {
            if(item1.stats[i].id == id) {
              val1 = item1.stats[i].max;
              break;
            }
          }
          for(var j=0;j<item2.stats.length;++j) {
            if(item2.stats[j].id == id) {
              val2 = item2.stats[j].max;
              break;
            }
          }
          return val2 - val1;
        },
        isItemStep: false,
        minOptions: 3,
      },
      hasStatStep: {
        name: 'Has Stat',
        getOptions: function(category, build, datas) {
          var items = quickAddHelper.findData(category, build, datas);
            
          var allItem = { id: -1, name: 'all' };
          var retVal = [allItem];
          if(items.length > 1) {
            var allStats = {};
            
            for(var i=0;i<items.length;++i) {
              for(var j=0;j<items[i].stats.length;++j) {
                var stat = hCodeValues.stats[items[i].stats[j].id];
                if(stat && stat.searchable && !('high ' + stat.name in allStats)) {
                  allStats['has ' + stat.name] = stat.id;
                }
              }
            }

            for(var val in allStats) {
              retVal.push({
                id: allStats[val],
                name: val,
              });
            }
            
            if(retVal.length <= 2) {
              retVal = [allItem];
            }
            else {
              retVal = retVal.sort(function(a, b) {
                  return a.id - b.id;
                });
            }
          }
          
          return retVal;
        },
        matchesItem: function(id, item) {
          if(id == -1) {
            return true;
          }
          
          for(var j=0;j<item.stats.length;++j) {
            var val = item.stats[j];
            var stat = hCodeValues.stats[val.id];
            if(stat.searchable) {
              if(val.id == id) {
                return true;
              }
            }
          }
          
          return false;
        },
        sortFunc: function(id, item1, item2) {
          var val1 = 0;
          var val2 = 0;
          
          for(var i=0;i<item1.stats.length;++i) {
            if(item1.stats[i].id == id) {
              val1 = item1.stats[i].max;
              break;
            }
          }
          for(var j=0;j<item2.stats.length;++j) {
            if(item2.stats[j].id == id) {
              val2 = item2.stats[j].max;
              break;
            }
          }
          return val2 - val1;
        },
        isItemStep: false,
        minOptions: 3,
      },
      customStep: {
        name: 'misc',
        getOptions: function(category, build, datas) {
          return hCodeValues.customItems;
        },
        isItemStep: true,
      },
    }
}

})();