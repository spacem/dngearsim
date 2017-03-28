(function () {
'use strict';

angular.module('dnsim').factory('itemFactory',itemFactory);

function itemFactory(translations,dntData,hCodeValues,items) {
  
  return {
    loadItems: loadItems,
    initItem: initItem,
    createItem: createItem,
    getItemData: getItemData,
    createBasicItem: createBasicItem,
  };
  
  function createItem(itemType, row, p) {
    
    // data and potential are used to initialise name and stats
    // this is only done when needed
    // they are then removed from the object
    return {
      row: row,
      potential : p,
      id: dntData.getValue(itemType.mainDnt, row, 'id'),
      itemSource : itemType.name,
      levelLimit : dntData.getValue(itemType.mainDnt, row, 'LevelLimit'),
      needJobClass : dntData.getValue(itemType.mainDnt, row, 'NeedJobClass'),
      typeId : dntData.getValue(itemType.mainDnt, row, 'Type'),
      exchangeType: dntData.getValue(itemType.mainDnt, row, 'ExchangeType'),
      rank : hCodeValues.rankNames[dntData.getValue(itemType.mainDnt, row, 'Rank')],
      pid: null,
      name : null,
      stats : null,
      potentialRatio : null,
      typeName : null,
      sparkId: null,
    };
  }

  function isDataLoaded(itemType) {
    
    if(!dntData.isLoaded(itemType.mainDnt)) {
      return false;
    }
    
    if(!translations.isLoaded()) {
      return false;
    }
    
    if('potentialDnt' in itemType && !dntData.isLoaded(itemType.potentialDnt)) {
      return false;
    }
    
    if('potentialDntEx' in itemType && !dntData.isLoaded(itemType.potentialDntEx)) {
      return false;
    }

    return true;

  }
  
  function loadItems(itemType) {

    if(!isDataLoaded(itemType)) {
      return null;
    }
    
    var start = new Date().getTime();
    
    itemType.items = [];
    var numRows = dntData.getNumRows(itemType.mainDnt);
    for(var r=0;r<numRows;++r) {
      var dType = dntData.getValue(itemType.mainDnt, r, 'Type');

      var state1Max = dntData.getValue(itemType.mainDnt, r, 'State1_Max');
      var dStateValue1 = dntData.getValue(itemType.mainDnt, r, 'StateValue1');
      var dTypeParam1 = dntData.getValue(itemType.mainDnt, r, 'TypeParam1');
        
      // skip items with no data
      if(state1Max > 0 || dStateValue1 > 0 || dTypeParam1 > 0 || dType == 35) {        
        var potentials = [];
        if(dTypeParam1 > 0 && 'potentialDnt' in itemType) {
          potentials = dntData.find(itemType.potentialDnt, 'PotentialID', dTypeParam1);
          
          if(!potentials.length && 'potentialDntEx' in itemType) {
            potentials = dntData.find(itemType.potentialDntEx, 'PotentialID', dTypeParam1);
          }
        }
        
        var numPotentials = potentials.length;
        if(!numPotentials) {
          potentials = [null];
          numPotentials = 1;
        }

        for(var p=0;p<numPotentials;++p) {
          var found = false;          
          if(!found) {
            itemType.items.push(createItem(itemType, r, potentials[p], 0));
          }
        }
      }
    }
            
    var end = new Date().getTime();
    var time = end - start;
    console.log('item init time: ' + (time/1000) + 's for ' + itemType.name);
  }
  
  function initItem(item) {
    
    if(item.row >= 0) {
      var d;
      if(item.itemSource && item.itemSource in items) {
        d = dntData.getRow(items[item.itemSource].mainDnt, item.row);
      }
      else if(item.fileName) {
        d = dntData.getRow(item.fileName + '.lzjson', item.row);
      }
      delete item.row;

      var p = item.potential;
  
      if(item.name == null) {
        item.name = translations.translate(d.NameID, d.NameIDParam);
      }
      
      if(!item.sparkTypeId && d.TypeParam2 > 0) {
        item.sparkTypeId = d.TypeParam2;
      }
      
      if(item.stats == null) {
        var stats = hCodeValues.getStats(d);
        if(p) {
          var potentialStats = hCodeValues.getStats(p);
          stats = hCodeValues.mergeStats(stats, potentialStats);
        }
        
        item.stats = stats;
      }
      
      if(d.SkillID && !item.skillId) {
        item.skillId = d.SkillID;
      }
      
      if(item.iconIndex == null) {
        item.icon = d.IconImageIndex;
        if(!item.icon && item.itemSource == 'title') {
          item.icon = 12417;
        }
      }
      
      if(d.dragonjeweltype >= 0) {
        item.dragonjeweltype = d.dragonjeweltype;
      }
      
      if(d.EnchantID && !item.enchantmentId) {
        item.enchantmentId = d.EnchantID;
      }
      
      if(d.EnchantID && !item.enchantmentId) {
        item.enchantmentId = d.EnchantID;
      }
      else if(d.Type == 35) {
        item.itemSource = 'xtras';
        var itemType = items[item.itemSource];
        if(itemType) {
          // item.fileName = itemType.mainDnt;
          var petData = dntData.find(itemType.petDnt, 'id', d.id);
          if(petData && petData.length) {
            item.enchantmentId = petData[0].PetLevelTypeID;
          }
        }
      }
      
      if(p) {
        item.pid = p.id;
      }
      
      delete item.potential;
    }
  }
  
  function getItemData(item) {
    var itemType = items[item.itemSource];
    
    if(item.fileName && dntData.isLoaded(item.fileName + '.lzjson')) {
      var result = getItemDataFromFile(item.fileName + '.lzjson', item);
      if(result) {
        return result;
      }
    }
    
    if(item.fileName && dntData.isLoaded(item.fileName + '.optimised.json')) {
      var result = getItemDataFromFile(item.fileName + '.optimised.json', item);
      if(result) {
        return result;
      }
    }
    
    if(itemType && dntData.isLoaded(itemType.mainDnt)) {
      var result = getItemDataFromFile(itemType.mainDnt, item);
      if(result) {
        return result;
      }
    }
    
    return [];
  }
  
  function getItemDataFromFile(fileName, item) {
    if(fileName) {
      var itemData = dntData.find(fileName, 'id', item.id);
      if(itemData && itemData.length > 0) {
        return itemData[0];
      }
    }
    
    return null;
  }
  
  function createBasicItem(d) {
    if(!d) {
      return [];
    }
    return {
      id: d.id,
      name: translations.translate(d.NameID, d.NameIDParam),
      rank: hCodeValues.rankNames[d.Rank],
      icon: d.IconImageIndex,
      levelLimit : d.LevelLimit,
      fileName: d.fileName,
      typeId: d.Type
    };
  }
}
})();