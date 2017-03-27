(function () {
'use strict';

angular.module('dnsim').factory('quickAdd', quickAdd);
function quickAdd(dntData, translations, itemColumnsToLoad, itemCategory,itemFactory,jobs,hCodeValues, quickAddSteps, quickAddHelper) {

  return {
    categorySteps: {
      titles: ['titleStep'],
      weapons: ['exchangeStep','sixtyLevelStep','equipRankStep','itemNameStep','hasStatStep','itemStep','enhanceStep'],
      armour: ['exchangeStep','sixtyLevelStep','equipRankStep','itemNameStep','hasStatStep','itemStep','enhanceStep'],
      accessories: ['accExchangeStep','allLevelStep','equipRankStep','itemNameStep','hasStatStep','itemStep'],
      techs: ['exchangeStep','allLevelStep','techRankStep','techSkillStep','itemNameStep','hasStatStep','itemStep'],
      'offensive gems': ['sixtyLevelStep','gemRankStep','itemNameStep','numStatsStep','hasStatStep','itemStep','enhanceStep'],
      'increasing gems': ['sixtyLevelStep','gemRankStep','itemNameStep','numStatsStep','hasStatStep','itemStep','enhanceStep'],
      'enhancement plates': ['allLevelStep','otherRankStep','distinctItemNameStep','numStatsStep','hasStatStep','itemStep'],
      'expedition plates': ['sixtyLevelStep','distinctItemNameStep','numStatsStep','highStatStep','hasStatStep','itemStep'],
      talisman: ['sixtyLevelStep','talismanRankStep','distinctItemNameStep','numStatsStep','hasStatStep','itemStep','enhanceTalismanStep'],
      costume: ['exchangeStep','otherRankStep','itemNameStep','itemStep'],
      imprint: ['imprintRankStep','itemNameStep','highStatStep','itemStep'],
      cash: ['accExchangeStep','cashRankStep','itemNameStep','itemStep'],
      custom: ['customStep'],
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