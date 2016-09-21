(function () {
'use strict';

angular.module('dnsim').factory('itemFactory',
['translations','dntData','hCodeValues','items',itemFactory]);

function itemFactory(translations,dntData,hCodeValues,items) {
  
  return {
    loadItems: loadItems,
    initItem: initItem,
    createItem: createItem,
    getItemData: getItemData,
    createBasicItem: createBasicItem,
  };
  
  function createItem(itemSourceName, d, p, totalRatio) {
    
    // data and potential are used to initialise name and stats
    // this is only done when needed
    // they are then removed from the object
    return {
      data : d,
      potential : p,
      id: d.id,
      totalRatio: totalRatio,
      itemSource : itemSourceName,
      levelLimit : d.LevelLimit,
      needJobClass : d.NeedJobClass,
      typeId : d.Type,
      exchangeType: d.ExchangeType,
      rank : hCodeValues.rankNames[d.Rank],
      pid: null,
      name : null,
      stats : null,
      potentialRatio : null,
      typeName : null,
      sparkId: null,
    };
  };
  
  function loadItems(itemType) {
    
    if(!dntData.isLoaded(itemType.mainDnt)) {
      return null;
    }
    
    if(!translations.isLoaded()) {
      return null;
    }
    
    if('potentialDnt' in itemType && !dntData.isLoaded(itemType.potentialDnt)) {
      return null;
    }
    
    if('potentialDntEx' in itemType && !dntData.isLoaded(itemType.potentialDntEx)) {
      return null;
    }
    
    var start = new Date().getTime();
    
    itemType.items = [];
    var numRows = dntData.getNumRows(itemType.mainDnt);
    for(var r=0;r<numRows;++r) {
      var dType = dntData.getValue(itemType.mainDnt, r, 'Type');
      var dLevelLimit = dntData.getValue(itemType.mainDnt, r, 'LevelLimit');
      var dRank = dntData.getValue(itemType.mainDnt, r, 'Rank');
      
      // skip certain types like pouches, res scrolls, etc
      if(dType != 8 &&
        dType != 29 &&
        dType != 114 &&
        dType != 79 &&
        dType != 174 &&
        dType != 130 &&
        dType != 24 &&
        dType != 182 &&
        dType != 78 &&
        dType != 20 &&
        dType != 46 &&
        dType != 9 &&
        (!itemType.minLevel || dLevelLimit >= itemType.minLevel) &&
        (!itemType.maxLevel || dLevelLimit <= itemType.maxLevel) &&
        (!itemType.minRank || dRank >= itemType.minRank)) {

        var dState1_GenProb = dntData.getValue(itemType.mainDnt, r, 'State1_GenProb');
        var dStateValue1 = dntData.getValue(itemType.mainDnt, r, 'StateValue1');
        var dTypeParam1 = dntData.getValue(itemType.mainDnt, r, 'TypeParam1');
          
        // skip items with no data
        if(dState1_GenProb > 0 || dStateValue1 > 0 || dTypeParam1 > 0) {
          var d = dntData.getRow(itemType.mainDnt, r);
          
          if(itemType.type == 'techs') {
            var exists = false;
            for(var i=0;i<itemType.items.length;++i) {
              if(itemType.items[i].needJobClass == d.NeedJobClass &&
                itemType.items[i].levelLimit == d.LevelLimit &&
                itemType.items[i].potential && itemType.items[i].potential.PotentialID == dTypeParam1) {
                  exists = true;
                  break;
                }
            }
            
            if(exists) {
              continue;
            }
          }
          
          var potentials = [];
          if(dTypeParam1 > 0 && 'potentialDnt' in itemType) {
            potentials = dntData.find(itemType.potentialDnt, 'PotentialID', dTypeParam1);
            
            if(!potentials.length && 'potentialDntEx' in itemType) {
              potentials = dntData.find(itemType.potentialDntEx, 'PotentialID', dTypeParam1);
            }
          }
          
          var numPotentials = potentials.length;
          if(!numPotentials) {
            itemType.items.push(createItem(itemType.name, d, null, 0));
          }
          else {
            var totalRatio = 0;
            for(var p=0;p<numPotentials;++p) {
              totalRatio += potentials[p].PotentialRatio;
            }
            
            for(var p=0;p<numPotentials;++p) {
              
              var found = false;
              for(var q=0;q<p;++q) {
                if(potentialsMatch(potentials[p], potentials[q])) {
                  found = true;
                  break;
                }
              }
              
              if(!found) {
                for(var q=p+1;q<numPotentials;++q) {
                  if(potentialsMatch(potentials[p], potentials[q])) {
                    potentials[p].PotentialRatio += potentials[q].PotentialRatio;
                  }
                }
                
                itemType.items.push(createItem(itemType.name, d, potentials[p], totalRatio));
              }
            }
          }
        }
      }
    }
            
    var end = new Date().getTime();
    var time = end - start;
    console.log('item init time: ' + time/1000 + 's for ' + itemType.name);
  }
  
  function potentialsMatch(p1, p2) {
    
    var i = 1;
    var j = 1;
    for(;;) {
      var state1Col = 'State' + i;
      var state2Col = 'State' + j;
      
      if(p1[state1Col] == 107) {
        i++;
        state1Col = 'State' + i;
      }
      if(p2[state2Col] == 107) {
        j++;
        state2Col = 'State' + j;
      }
      
      if(!(state1Col in p1 || state2Col in p2)) {
        return true;
      }
      
      if(!(state1Col in p1)) {
        return false;
      }
      if(!(state2Col in p2)) {
        return false;
      }
      
      if(p1[state1Col] == -1 && p2[state2Col] == -1) {
        return true;
      }
      
      if(!(p1[state1Col] >= 0 || p2[state2Col] >= 0)) {
        return true;
      }
      
      if(p1[state1Col] != p2[state2Col]) {
        return false;
      }
      
      var val1Col = 'State' + i + 'Value';
      var val2Col = 'State' + j + 'Value';
      if(p1[val1Col] != p2[val2Col]) {
        return false;
      }
      
      ++i;
    }
  }
  
  function initItem(item) {
    
    if(item.data) {
      var d = item.data;
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
      
      if(d.EnchantID && !item.enchantmentId) {
        item.enchantmentId = d.EnchantID;
      }
      
      if(p) {
        item.pid = p.id;
      
        if(item.potentialRatio === null) {
          item.potentialRatio = getPotentialRatio(p, item.totalRatio);
        }
      }
      
      delete item.data;
      delete item.potential;
    }
  }
  
  function getPotentialRatio(p, totalRatio) {
    
    if(p && p.PotentialRatio > 0 && totalRatio != 0) {
      var ratio = Math.round(p.PotentialRatio/totalRatio*100*100)/100;
      if(ratio != 100) {
        return ratio + '%';
      }
    }

    return null;
  }
  
  function getItemData(item) {
    
    var fileName = null;
    var itemType = items[item.itemSource];
    
    if(item.fileName && dntData.isLoaded(item.fileName + '.optimised.lzjson')) {
      fileName = item.fileName + '.optimised.lzjson';
    }
    else if(item.fileName && dntData.isLoaded(item.fileName + '.lzjson')) {
      fileName = item.fileName + '.lzjson';
    }
    else if(itemType && dntData.isLoaded(itemType.mainDnt)) {
      fileName = itemType.mainDnt
    }

    if(fileName) {
      var itemData = dntData.find(fileName, 'id', item.id);
      if(itemData && itemData.length > 0) {
        return itemData[0];
      }
    }
    
    return [];
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
    };
  }
}
})();