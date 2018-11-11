const _ = require('lodash');

(function () {
'use strict';

angular.module('dnsim').factory('quickAdd',
['quickAddSteps', 'quickAddHelper',
quickAdd]);
function quickAdd(quickAddSteps, quickAddHelper) {

  return {
    categorySteps: {
      titles: ['titleStep'],
      weapons: ['exchangeStep','levelStep','rankStep','itemNameStep','hasStatStep','itemStep','enhanceEqStep'],
      armour: ['exchangeStep','levelStep','rankStep','itemNameStep','hasStatStep','itemStep','enhanceEqStep'],
      accessories: ['accExchangeStep','levelStep','rankStep','itemNameStep','hasStatStep','itemStep'],
      techs: ['exchangeStep','levelStep','rankStep','techSkillStep','itemNameStep','hasStatStep','itemStep'],
      'offensive gems': ['levelStep','gemRankStep','itemNameStep','hasStatStep','hasStatStep','itemStep','enhanceGemStep'],
      'increasing gems': ['levelStep','gemRankStep','itemNameStep','hasStatStep','hasStatStep','itemStep','enhanceGemStep'],
      'enhancement plates': ['levelStep','rankStep','distinctItemNameStep','numStatsStep','hasStatStep','itemStep'],
      'expedition plates': ['levelStep','distinctItemNameStep','numStatsStep','highStatStep','hasStatStep','itemStep'],
      talisman: ['levelStep','talismanRankStep','distinctItemNameStep','numStatsStep','hasStatStep','itemStep','enhanceTalismanStep'],
      costume: ['exchangeStep','rankStep','itemNameStep','itemStep'],
      imprint: ['rankStep','itemNameStep','highStatStep','itemStep'],
      cash: ['accExchangeStep','rankStep','itemNameStep','itemStep'],
      custom: [],
    },
    getOptions: function(category, build, datas) {
      var t = this;
      if(category.name in this.categorySteps) {
        var stepName = this.getStepName(category, datas.length);
        var stepDef = quickAddSteps[stepName];
        var allOptions = stepDef.getOptions(category, build, datas);
        if(stepDef.isItemStep) {
          return allOptions;
        }
        else {
          if(stepDef.minOptions) {
              var unfilteredItems = quickAddHelper.findData(category, build, datas, 50);
          }

          var newOptions = _.filter(allOptions, function(option) {
            var tempDatas = datas.concat([
              t.createData(option, category, datas.length)
            ]);

            var items;
            if(stepDef.minOptions) {
              if(allOptions[0] == option) {
                return true;
              }

              items = quickAddHelper.findData(category, build, tempDatas, 50);
              if(items.length > 0 && items.length < 50) {
                return items.length < unfilteredItems.length;
              }
            }
            else {
              items = quickAddHelper.findData(category, build, tempDatas, 1);
            }
            return items.length;
          });

          if(stepDef.minOptions && newOptions.length < stepDef.minOptions) {
            return [allOptions[0]];
          }

          return newOptions;
        }
      }
      else {
        return [];
      }
    },
    hasOptions: function(category, build, datas) {
      if(category.name in this.categorySteps) {
        var stepName = this.getStepName(category, datas.length);
        if(quickAddSteps[stepName].hasOptions) {
          return quickAddSteps[stepName].hasOptions(category, build, datas);
        }
        else {
          return quickAddSteps[stepName].getOptions(category, build, datas).length > 0;
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
      var def = quickAddSteps[stepName];
      
      return {
        step: stepName,
        value: value,
        def: def,
      };
    },
    getItem: quickAddHelper.getItem,
    getStepName: function(category, stepNumber) {
      return this.categorySteps[category.name][stepNumber];
    }
  };
}

})();