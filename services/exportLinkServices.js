(function () {
'use strict';

angular.module('dnsim').factory('exportLinkHelper', exportLinkHelper);
function exportLinkHelper($http,items,dntData,itemFactory,hCodeValues,itemColumnsToLoad,statHelper,translations,itemCategory,region) {

  return {
    
    encodeItem: function(item, small) {
      if(item) {
        var itemString;

        if(item.typeName == 'custom')  {
          itemString = '_custom';
          angular.forEach(item.stats, function(stat, index) {
            if(index > 0) {
              itemString += '|';
            }
            else {
              itemString += ':C';
            }
            itemString += stat.id.toString(36) + '=' + stat.max;
          });
        }
        else if(item.id) {
          itemString = 'I' + item.id.toString(36) + ':_';
          if('itemSource' in item) {
            itemString += item.itemSource;
          }
          else if('itemTypeName' in item) {
            // this is to support groups saved with the old property name
            itemString += item.itemTypeName;
          }
          else if(item.fileName) {
            itemString += ':F' + item.fileName;
          }
        
          if(item.enchantmentNum || item.enchantmentNum == 0) {
            itemString += ':E' + item.enchantmentNum.toString(36);
          }
          if(item.pid > 0) {
            itemString += ':P' + item.pid.toString(36);
          }
          // if(item.setId > 0) {
            // itemString += ':S' + item.setId.toString(36);
          // }
          if(item.sparkId > 0) {
            itemString += ':H' + item.sparkId.toString(36);
          }
          if(item.typeName == 'skills') {
            itemString += ':J' + item.baseJobName;
          }
          if(item.pve) {
            itemString += ':V' + item.pve;
          }
        }
        
        if(item.name && !small) {
          itemString += ':.' + item.name.replace(/ /g, '-').replace(/\//g, ' ');
        }

        return itemString;
      }
      
      return '';
    },
    
    decodeItem: function(itemStr) {
      var item = {};
      
      if(itemStr) {
        angular.forEach(itemStr.split(':'), function(itemBit, bitIndex) {
          if(itemBit.charAt(0) == 'I') {
            item.id = parseInt(itemBit.substr(1), 36);
          }
          else if(itemBit.charAt(0) == 'E') {
            item.enchantmentNum = parseInt(itemBit.substr(1), 36);
          }
          else if(itemBit.charAt(0) == 'P') {
            item.pid = parseInt(itemBit.substr(1), 36);
          }
          else if(itemBit.charAt(0) == 'S') {
            item.setId = parseInt(itemBit.substr(1), 36);
          }
          else if(itemBit.charAt(0) == 'H') {
            item.sparkId = parseInt(itemBit.substr(1), 36);
          }
          else if(itemBit.charAt(0) == 'J') {
            item.baseJobName = itemBit.substr(1);
          }
          else if(itemBit.charAt(0) == 'V') {
            item.pve = itemBit.substr(1);
          }
          else if(itemBit.charAt(0) == '_') {
            item.itemSource = itemBit.substr(1);
          }
          else if(itemBit.charAt(0) == '.') {
            item.name = itemBit.substr(1).replace('-', ' ');
          }
          else if(itemBit.charAt(0) == 'C') {
            item.stats = [];
            var statString = itemBit.substr(1);
            angular.forEach(statString.split('|'), function(statBit, statBitIndex) {
              var splitStat = statBit.split('=');
              item.stats.push({
                id: parseInt(splitStat[0], 36),
                max: Number(splitStat[1])
              });
            });
          }
          else if(itemBit.charAt(0) == 'F') {
            
            item.fileName = itemBit.substr(1);
            angular.forEach(items, function(itemSource, key) {
              if(itemSource.mainDnt && itemSource.mainDnt.indexOf(item.fileName + '.') == 0) {
                item.itemSource = key;
              }
            });
          }
        });
      }
      
      return item;
    },
    
    createGroupLink: function(groupName, group) {
      var itemStrings = [];
      var self = this;
      
      if(group == null) {
        return '';
      }
      
      angular.forEach(group.items, function(item, key) {
        var itemString = self.encodeItem(item, true);  
        if(itemString && itemString.length) {
          itemStrings.push(itemString);
        }
      });
  
      var retVal = 'view-group?region=';
      if(region.dntLocation && region.dntLocation.region) {
        retVal += region.dntLocation.region;
      }
      
      if(group.enemyLevel) {
        retVal += '&e=' + group.enemyLevel;
      }
      if(group.playerLevel) {
        retVal += '&p=' + group.playerLevel;
      }
      if(group.heroLevel) {
        retVal += '&h=' + group.heroLevel;
      }
      if(group.job && group.job.id) {
        retVal += '&j=' + group.job.id;
      }
      if(group.damageType && group.damageType.id) {
        retVal += '&d=' + group.damageType.id;
      }
      if(group.element && group.element.id) {
        retVal += '&t=' + group.element.id;
      }
      if(group.secondaryElement && group.secondaryElement.id) {
        retVal += '&s=' + group.secondaryElement.id;
      }
      retVal += '&g=' + encodeURI(groupName) + '&i=' + itemStrings.join(',');
      return retVal;
    },

    reloadSkill: function(item) {

        if(!item.enchantmentNum) {
          item.enchantmentNum = 1;
        }
        
        var skillDnt = 'skilltable_character' + item.baseJobName + '.lzjson';
        var pv = 'pve';
        if(item.pve == 'pvp') {
          pv = 'pvp';
        }
        var skillLevelDnt = 'skillleveltable_character' + item.baseJobName + pv + '.lzjson';
        
        var skillData = dntData.find(skillDnt, 'id', item.id)[0];
        if(!skillData) {
          console.log('cannot get skill data from ', skillDnt);
        }
        var skillLevelDatas = dntData.getData(skillLevelDnt);

        var skillLevelVals = {};
        angular.forEach(skillLevelDatas, function(value, index) {
          if(value.SkillIndex == item.id && value.SkillLevel == item.enchantmentNum) {
            skillLevelVals = value;
          }
        });
        
        var newItem = {
          id: item.id,
          itemSource: item.itemSource,
          typeName: item.itemSource,
          needJobClass: skillData.NeedJob,
          baseJobName: item.baseJobName,
          rank: hCodeValues.rankNames[0],
          enchantmentNum: item.enchantmentNum,
          name: translations.translate(skillData.NameID, skillData.NameIDParam),
          description: translations.translate(skillLevelVals.SkillExplanationID, skillLevelVals.SkillExplanationIDParam),
          icon: skillData.IconImageIndex,
          pve: item.pve
        };
        
        newItem.stats = statHelper.getSkillStats(newItem, skillData, skillLevelDatas);
        return newItem;
    },

    reloadSourceItem: function(item) {
      var itemType = items[item.itemSource];
      var ds = dntData.findFast(itemType.mainDnt, 'id', item.id);
      if(!ds.length) {
        console.log('item ' + item.id + ' not found in ' + itemType.mainDnt);
        return;
      }

      var rowNum = ds[0];
      var typeParam1 = dntData.getValue(itemType.mainDnt, rowNum, 'TypeParam1');
    
      var p = null;
      
      var ps = dntData.find(itemType.potentialDnt, 'id', item.pid);
      if(!ps.length) {
        ps = dntData.find(itemType.potentialDnt, 'PotentialID', typeParam1);
      }
      
      if(!ps.length) {
        ps = dntData.find(itemType.potentialDntEx, 'id', item.pid);
        if(!ps.length) {
          ps = dntData.find(itemType.potentialDntEx, 'PotentialID', typeParam1);
        }
      }
      
      if(ps.length > 0) {
        p = ps[0];
        
        if(p.PotentialID != typeParam1) {
          // this happened one time
          // not sure how but it corrupted the stats
          p = null;
          console.log('bad potential');
        }
      }
      
      var newItem = itemFactory.createItem(itemType, rowNum, p);
      itemFactory.initItem(newItem);
      itemCategory.setItemCategory(newItem);
      newItem.gemSlot = item.gemSlot;

      var usePartDnt = null;
      if(newItem.typeName != 'weapons' && newItem.typeId != 0) {
        usePartDnt = 'partsDnt';
      }
      else {
        usePartDnt = 'weaponDnt';
      }

      if(usePartDnt) {
        if(dntData.isLoaded(itemType[usePartDnt]) && dntData.isLoaded(itemType.setDnt)) {
          newItem.setStats = [];
          var parts = dntData.find(itemType[usePartDnt], 'id', item.id);
          if(parts.length > 0) {
            newItem.setId = parts[0].SetItemID;
            var sets = dntData.find(itemType.setDnt, 'id', parts[0].SetItemID);
            if(sets.length > 0) {
              newItem.setStats = hCodeValues.getStats(sets[0]);
            }
          }
        }
      }

      newItem.fullStats = newItem.stats;
      if(item.enchantmentNum >= 0) {
        newItem.enchantmentNum = item.enchantmentNum;
        
        if(newItem.typeName == 'skills') {
          // would this even happen?
        }
        else if(newItem.typeName == 'talisman') {
          var extraStats = [];
          angular.forEach(newItem.stats, function(stat, index) {
            extraStats.push({id: stat.id, max: stat.max * (newItem.enchantmentNum/100)});
          });
          
          newItem.enchantmentStats = extraStats;
        }
        else if(itemType.enchantDnt) {
          var enchantments = dntData.find(itemType.enchantDnt, 'EnchantID', newItem.enchantmentId);
          if(!enchantments.length && itemType.enchantDnt2) {
            enchantments = dntData.find(itemType.enchantDnt2, 'EnchantID', newItem.enchantmentId);
          }

          angular.forEach(enchantments, function(enchantment, index) {
            if(enchantment.EnchantLevel == newItem.enchantmentNum) {
              newItem.enchantmentStats = hCodeValues.getStats(enchantment);
            }
          });
        }
        else if(itemType.petLevelDnt) {
          var petLevels = dntData.find(itemType.petLevelDnt, 'PetLevelTypeID', newItem.enchantmentId);
          angular.forEach(petLevels, function(enchantment, index) {
            if(enchantment.PetLevel == newItem.enchantmentNum) {
              newItem.enchantmentStats = hCodeValues.getStats(enchantment);
            }
          });
        }
      }

      if(newItem.enchantmentStats) {
        newItem.fullStats = hCodeValues.mergeStats(newItem.enchantmentStats, newItem.stats);
      }
      
      if(item.sparkId > 0) {
        newItem.sparkId = item.sparkId;
        var sparks = dntData.find(itemType.sparkDnt, 'id', item.sparkId);
        if(sparks.length > 0) {
          newItem.sparkStats = hCodeValues.getStats(sparks[0]);
          newItem.fullStats = hCodeValues.mergeStats(newItem.fullStats, newItem.sparkStats);
        }
      }
      else if(newItem.dragonjeweltype) {
        newItem.offensiveGemSlots = 0;
        newItem.increasingGemSlots = 0;
        var itemData = dntData.find('dragonjewelslottable.lzjson', 'DragonJewelID', newItem.dragonjeweltype);
        if(itemData && itemData.length > 0) {
          if(itemData[0].DragonJewelSlot1 == 1) newItem.offensiveGemSlots++;
          if(itemData[0].DragonJewelSlot2 == 1) newItem.offensiveGemSlots++;
          if(itemData[0].DragonJewelSlot3 == 1) newItem.offensiveGemSlots++;
          if(itemData[0].DragonJewelSlot4 == 1) newItem.offensiveGemSlots++;
          
          if(itemData[0].DragonJewelSlot1 == 2) newItem.increasingGemSlots++;
          if(itemData[0].DragonJewelSlot2 == 2) newItem.increasingGemSlots++;
          if(itemData[0].DragonJewelSlot3 == 2) newItem.increasingGemSlots++;
          if(itemData[0].DragonJewelSlot4 == 2) newItem.increasingGemSlots++;
        }
      }
      
      return newItem;
    },
    
    reloadItem: function(item) {

      if(item == null) {
        // console.log('cannot reload null item');
        return;
      }
      
      // support for old property name
      if('itemTypeName' in item && !item.itemSource) {
        item.itemSource = item.itemTypeName;
      }
      
      // console.log('checking ' + item.itemSource)
      if(item.itemSource == 'rbTech') {
        item.itemSource = 'tech';
        // console.log('changed to ' + item.itemSource)
      }
      
      if(item.itemSource == 'custom' || item.typeName == 'custom') {
        item.typeName = 'custom';
        return item;
      }
      else if(item.itemSource == 'skills' || item.typeName == 'skills') {
        return this.reloadSkill(item);
      }
      else if(item.itemSource in items) {
        return this.reloadSourceItem(item);
      }
      
      if(item.fileName) {
        var datas = dntData.findFast(item.fileName + '.lzjson', 'id', item.id);
        if(datas.length > 0) {
          var row = datas[0];
          var d = dntData.getRow(item.fileName + '.lzjson', row);
          var newItem = itemFactory.createBasicItem(d);
          newItem.row = row;
          newItem.needJobClass = d.NeedJobClass;
          newItem.exchangeType = d.ExchangeType;
          newItem.fileName = item.fileName;
          newItem.gemSlot = item.gemSlot;
          newItem.description = translations.translate(d.DescriptionID, d.DescriptionIDParam);
          itemFactory.initItem(newItem);
          return newItem;
        }
        else {
          return {name: 'unknown item'};
        }
      }
      else {
        return {name: 'unknown item source: ' + item.itemSource};
      }
    },
    
    getDntFiles: function(item) {
      if(item == null) {
        return {};
      }

      var dntFiles = {};
      if(!item.itemSource && item.itemTypeName in items) {
        item.itemSource = item.itemTypeName;
      }
      
      if(item.itemSource == 'rbTech') {
        item.itemSource = 'tech';
      }
      
      if(item.itemSource in items) {
        var itemType = items[item.itemSource];
        
        dntFiles['exchange.lzjson'] = null;
        dntFiles[itemType.mainDnt] = itemColumnsToLoad.mainDnt;
        
        for(var fileType in itemType) {
          if(fileType.indexOf('Dnt') > 0) {
            if(fileType != 'enchantDnt' || fileType != 'enchantDnt2' || item.enchantmentNum) {
              dntFiles[itemType[fileType]] = itemColumnsToLoad[fileType];
            }
          }
        }
      }
      
      if(item.itemSource == 'skills' || item.typeName == 'skills') {
          var skillDnt = 'skilltable_character' + item.baseJobName + '.lzjson';
          dntFiles[skillDnt] = null;
          var skillLevelDnt = 'skillleveltable_character' + item.baseJobName + 'pve' + '.lzjson';
          dntFiles[skillLevelDnt] = null;
          skillLevelDnt = 'skillleveltable_character' + item.baseJobName + 'pvp' + '.lzjson';
          dntFiles[skillLevelDnt] = null;
      }
      
      if(item.fileName) {
        dntFiles[item.fileName + '.lzjson'] = null;
      }
    
      return dntFiles;
    }
  };
}

})();