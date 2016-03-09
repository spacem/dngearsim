(function () {
'use strict';

angular.module('dnsim').factory('itemFactory',
['translations','dntData','hCodeValues','items',itemFactory]);

function itemFactory(translations,dntData,hCodeValues,items) {
  
  return {
    loadItems: loadItems,
    initItem: initItem,
    createItem: createItem,
  };
  
  function createItem(itemSourceName, d, p, totalRatio) {
    
    // data and potential are used to initialise name and stats
    // this is only done when needed
    // they are then removed from the object
    return {
      data : d,
      potential : p,
      id: d.id,
      pid: null,
      totalRatio: totalRatio,
      name : null,
      stats : null,
      itemSource : itemSourceName,
      levelLimit : d.LevelLimit,
      needJobClass : d.NeedJobClass,
      typeId : d.Type,
      exchangeType: d.ExchangeType,
      potentialRatio : null,
      typeName : null,
      rank : hCodeValues.rankNames[d.Rank],
      enchantmentId : null,
      sparkTypeId: null,
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
          
          var potentials = [];
          if(dTypeParam1 > 0 && 'potentialDnt' in itemType) {
            potentials = dntData.find(itemType.potentialDnt, 'PotentialID', dTypeParam1);
          }
          
          var totalRatio = 0;
          angular.forEach(potentials, function(value, key) {
            totalRatio += value.PotentialRatio;
          });
          
          var numPotentials = potentials.length;
          if(numPotentials == 0) {
            itemType.items.push(this.createItem(itemType.name, d, null, totalRatio));
          }
          else {
            for(var p=0;p<numPotentials;++p) {
              itemType.items.push(this.createItem(itemType.name, d, potentials[p], totalRatio));
            }
          }
        }
      }
    }
            
    var end = new Date().getTime();
    var time = end - start;
    console.log('item init time: ' + time/1000 + 's for ' + itemType.name);
  }
  

  function initItem(item) {
    
    if(item.data) {
      var d = item.data;
      var p = item.potential;
  
      if(item.name == null) {
        var nameValue = d.NameIDParam;
        if(nameValue == null || nameValue == '') {
          nameValue = d.NameID;
        }
  
        var translatedName = translations.translate(nameValue);
        if(typeof translatedName == 'string') {
          item.name = translatedName.replace(/\{|\}/g,'').replace(/\,/g,' ');
        }
        else {
          item.name = translatedName.toString();
        }
      }
      
      if(item.sparkTypeId == null && d.TypeParam2 > 0) {
        item.sparkTypeId = d.TypeParam2;
      }
      
      if(item.stats == null) {
        var stats = hCodeValues.getStats(d);
        if(p != null) {
          var potentialStats = hCodeValues.getStats(p);
          stats = hCodeValues.mergeStats(stats, potentialStats);
        }
        
        item.stats = stats;
      }
      
      if(item.levelLimit == null) {
        item.levelLimit = d.LevelLimit;
      }
      
      if(item.id == null) {
        item.id = d.id;
      }
      
      if(item.typeName == null) {
        item.typeName = getTypeName(d, item.itemSource);
      }
      
      if(item.enchantmentId == null ) {
        item.enchantmentId = d.EnchantID;
      }
      
      if(p != null) {
        item.pid = p.id;
      
        if(item.potentialRatio == null) {
          item.potentialRatio = getPotentialRatio(p, item.totalRatio);
        }
      }
      
      item.data = null;
      item.potential = null;
    }
  }

  function getTypeName(d, itemSource) {
    var itemTypeDef = items[itemSource];
    
    if(itemSource in items && itemTypeDef.type == 'cash') {
      return 'cash';
    }
    else if(itemSource in items && itemTypeDef.type == 'techs') {
      return 'techs';
    }
    else if(d.Rank == 4 && itemTypeDef.type == 'plates') {
      return 'expedition plates';
    }
    else if(itemTypeDef.type == 'plates') {
      return 'enhancement plates';
    }
    else if(itemSource in items && itemTypeDef.type == 'titles') {
      return 'titles';
    }
    else if(d.Type == 0 && itemTypeDef.type == 'equipment') {
      return 'weapons';
    }
    else if(
      d.Type == 1 &&
      itemTypeDef.type == 'equipment' &&
      'NameIDParam' in d &&
      d.NameIDParam.indexOf('},{2227}') <= 0 &&
      d.NameIDParam.indexOf('},{2228}') <= 0 &&
      d.NameIDParam.indexOf('},{2229}') <= 0) {
        
      return 'armour';
    }
    else if(d.Type == 1 && itemTypeDef.type == 'equipment') {
      return 'accessories';
    }
    else if(d.Type == 139 && 'gemDnt' in itemTypeDef) {

      var gemTypes = dntData.find(itemTypeDef.gemDnt, 'id', d.id);
      if(gemTypes.length > 0) {
        
        if(gemTypes[0].Type == 1) {
          return 'offensive gems';
        }
        else if(gemTypes[0].Type == 2) {
          return 'increasing gems';
        }
        else {
          return 'other gems';
        }
      }
    }
    
    if(typeName == 'gems' || hCodeValues.typeNames[d.Type] == 'gems') {
      // console.log('should have got new type name ' + d.Tyoe + ' ' + itemTypeDef.gemDnt);
    }

    var typeName = hCodeValues.typeNames[d.Type];
    if(typeName == null) {
      return d.Type;
    }
    else {
      return typeName;
    }
  }
  
  function getPotentialRatio(p, totalRatio) {
    
    if(p != null && p.PotentialRatio > 0 && totalRatio != 0) {
      var ratio = Math.round(p.PotentialRatio/totalRatio*100*100)/100;
      if(ratio != 100) {
        return ratio + '%';
      }
    }

    return null;
  }
}
})();