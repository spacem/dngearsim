(function () {
'use strict';

angular.module('dnsim').factory('quickAdd', ['dntData', 'translations', 'itemColumnsToLoad', 'itemCategory','itemFactory','jobs', quickAdd]);
function quickAdd(dntData, translations, itemColumnsToLoad, itemCategory,itemFactory,jobs) {

  return {
    stepDefs: {
      exchangeStep: {
        name: 'type',
        getOptions: function(category, build, datas) {
          
          var exchanges = [];
          
          for(var e=0;e<category.limitExchange.length;++e) {
            var exId = category.limitExchange[e];
            
            var numExchange = 0;
            for(var i=0;i<build.items.length;++i) {
              if(build.items[i].exchangeType == exId) {
                numExchange++;
              }
            }
            
            if(numExchange >= category.maxExchange) {
              continue;
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
      levelStep: {
        name: 'level',
        getOptions: function(category, build, datas) {
          
          return [
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
          { id: 1, name: 'normal' },
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
          { id: 2, name: 'rare' },
          { id: 1, name: 'normal' },
          ];
        },
        matchesItem: function(id, item) {
          return item.rank.id == id;
        }
      },
      otherRankStep: {
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
          var allTitles = findData(category, build, datas, 9999);
          var usefulTitles = [];
          for(var i=0;i<allTitles.length;++i) {
            switch(allTitles[i].id) {
              case 1975: // Manticore Expert
              case 1973: // Returned
              case 1008: // Dark Knight
              // case 339: // Cow Wrangler
              case 230: // Miraculous
              case 279: // Provoking
              // case 1280: // Dragon Tamer
                usefulTitles.push(allTitles[i]);
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
          
          return [
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
          ]
        },
        alterItem: function(id, item) {
          item.enchantmentNum = id;
        }
      },
      itemStep: {
        name: 'select',
        getOptions: function(category, build, datas) {
          return findData(category, build, datas);
        },
        isItemStep: true,
      },
      techSkillStep: {
        name: 'skill',
        getOptions: function(category, build, datas) {
          var items = findData(category, build, datas, 1);
          
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
          var items = findData(category, build, datas);
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
      }
    },
    categorySteps: {
      titles: ['titleStep'],
      weapons: ['exchangeStep','levelStep','equipRankStep','itemStep','enhanceStep'],
      armour: ['exchangeStep','levelStep','equipRankStep','itemStep','enhanceStep'],
      accessories: ['exchangeStep','levelStep','equipRankStep','itemNameStep','itemStep'],
      'offensive gems': ['levelStep','equipRankStep','itemNameStep','itemStep'],
      '"increasing gems': ['levelStep','equipRankStep','itemNameStep','itemStep'],
      'enhancement plates': ['levelStep','otherRankStep','itemNameStep','itemStep'],
      'expedition plates': ['levelStep','itemNameStep','itemStep'],
      talisman: ['levelStep','talismanRankStep','itemNameStep','itemStep','enhanceTalismanStep'],
      costume: ['exchangeStep','otherRankStep','itemNameStep','itemStep'],
      cash: ['exchangeStep','cashRankStep','itemNameStep','itemStep'],
      techs: ['exchangeStep','levelStep','techRankStep','techSkillStep','itemStep'],
    },
    getOptions: function(category, build, datas) {
      if(category.name in this.categorySteps) {
        var stepName = this.getStepName(category, datas.length);
        return this.stepDefs[stepName].getOptions(category, build, datas);
      }
      else {
        return [];
      }
    },
    hasOptions: function(category, build, datas) {
      if(category.name in this.categorySteps) {
        var stepName = this.getStepName(category, datas.length);
        if(this.stepDefs[stepName].hasOptions) {
          return this.stepDefs[stepName].hasOptions(category, build, datas);
        }
        else {
          return this.stepDefs[stepName].getOptions(category, build, datas).length > 0;
        }
      }
      else {
        return false;
      }
    },
    isValidStepNumber: function(category, stepNumber) {
      return this.categorySteps[category.name].length > stepNumber;
    },
    createData: function(value, category, stepNumber) {
      var stepName = this.getStepName(category, stepNumber);
      var def = this.stepDefs[stepName];
      
      return {
        step: stepName,
        value: value,
        def: def,
        matchesItem: function(item) {
          return def.matchesItem(value.id, item);
        }
      };
    },
    getItem: function(datas) {
      var item = null;
      for(var d=0;d<datas.length;++d) {
        if(datas[d].def.isItemStep) {
          item = datas[d].value;
        }
      }
      
      for(var d=0;d<datas.length;++d) {
        if(datas[d].def.alterItem) {
          datas[d].def.alterItem(datas[d].value.id, item);
        }
      }
      
      return item;
    },
    getStepName: function(category, stepNumber) {
      return this.categorySteps[category.name][stepNumber];
    }
  }
  
  function findData(category, build, datas, maxItems) {
    if(!maxItems) {
      maxItems = 200;
    }
    
    var allItems = itemCategory.getItems(category.name);
    var retVal = [];
    // console.log('looking at ' + allItems.length + ' items');
    var numItems = allItems.length;
    
    for(var i=0;i<numItems;++i) {
      
      var item = allItems[i];
      
      if(build.job.id > 0 && item.needJobClass > 0 && !jobs.isClassJob(build.job.d, item.needJobClass)) {
        continue;
      }
      
      var addItem = true;
      for(var d=0;d<datas.length;++d) {
        if(datas[d].matchesItem && !datas[d].matchesItem(item)) {
          addItem = false;
          break;
        }
      }
      
      if(addItem) {
        itemFactory.initItem(item);
        retVal.push(item);
      }
      
      if(retVal.length >= maxItems) {
        break;
      }
    }
    
    retVal = retVal.sort(function(item1, item2) {
      return item1.name.localeCompare(item2.name);
    });
    
    // console.log('found ' + retVal.length + ' items');
    return retVal;
  }
}

})();