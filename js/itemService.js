var m = angular.module('itemService', ['translationService','ngRoute','valueServices','dntServices']);

m.factory('initItem',
['translations','hCodeValues','items',
function(translations,hCodeValues,items) {

  function getTypeName(d, itemTypeName) {
    if(itemTypeName in items && items[itemTypeName].type == 'cash') {
      return 'cash';
    }
    else if(itemTypeName in items && items[itemTypeName].type == 'techs') {
      return 'techs';
    }
    else if(itemTypeName in items && items[itemTypeName].type == 'titles') {
      return 'titles';
    }
    else if(d.Type == 0 && items[itemTypeName].type == 'equipment') {
      return 'weapons';
    }
    else if(
      d.Type == 1 &&
      items[itemTypeName].type == 'equipment' &&
      'NameIDParam' in d &&
      d.NameIDParam.indexOf('},{2227}') <= 0 &&
      d.NameIDParam.indexOf('},{2228}') <= 0 &&
      d.NameIDParam.indexOf('},{2229}') <= 0) {
        
      return 'armour';
    }
    else if(d.Type == 1 && items[itemTypeName].type == 'equipment') {
      return 'accessories';
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
    
    if(p != null && p.PotentialRatio > 0) {
      var ratio = Math.round(p.PotentialRatio/totalRatio*100*100)/100;
      if(ratio != 100) {
        return ratio + '%';
      }
    }

    return null;
  }
  
  return function(item) {
    
    if('data' in item) {
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
      
      if(item.potentialRatio == null) {
        item.potentialRatio = getPotentialRatio(p, item.totalRatio);
      }
      
      if(item.typeName == null) {
        item.typeName = getTypeName(d, item.itemTypeName);
      }
      
      if(item.enchantmentId == null ) {
        item.enchantmentId = d.EnchantID;
      }
      
      if(p != null) {
        item.pid = p.id;
      }
      
      delete item.data;
      delete item.potential;
    }
  }
}]);

m.factory('itemColumnsToLoad',[function() {
  return {
    mainDnt: {
      NameID: true, DescriptionID: true, NameIDParam: true, DescriptionIDParam: true,
      Type: true,TypeParam1: true,TypeParam2: true, TypeParam3: true, LevelLimit: true, NeedJobClass: true, Rank: true,
      State1: true, StateValue1: true, State1_Max: true, State1_GenProb: true,
      State2: true, StateValue2: true, State2_Max: true,
      State3: true, StateValue3: true, State3_Max: true,
      State4: true, StateValue4: true, State4_Max: true,
      State5: true, StateValue5: true, State5_Max: true,
      State6: true, StateValue6: true, State6_Max: true,
      State7: true, StateValue7: true, State7_Max: true,
      State8: true, StateValue8: true, State8_Max: true,
      State9: true, StateValue9: true, State9_Max: true,
      State10: true,StateValue10: true,State10_Max: true,
      EnchantID: true, ItemCategoryType: true
    },
    partsDnt: {
      SetItemID: true
    },
    enchantDnt: {
      EnchantID: true,EnchantLevel: true,EnchantRatio: true,BreakRatio: true,MinDown: true,MaxDown: true,NeedCoin: true,
      State1: true,State1Value: true,State2: true,State2Value: true,State3: true,State3Value: true,State4: true,State4Value: true,State5: true,State5Value: true,State6: true,State6Value: true,State7: true,State7Value: true,State8: true,State8Value: true,State9: true,State9Value: true,State10: true,State10Value: true
    },
    potentialDnt : null,
    setDnt : null,
  }
}]);

m.factory('createItem',
['translations','dntData','hCodeValues','itemColumnsToLoad',
function(translations,dntData,hCodeValues,itemColumnsToLoad) {
  
  return function(itemTypeName, d, p, totalRatio) {
    
    // data and potential are used to initialise name and stats
    // this is only done when needed
    // they are then removed from the object
    return {
      data : d,
      potential : p,
      totalRatio: totalRatio,
      id: d.id,
      name : null,
      stats : null,
      itemTypeName : itemTypeName,
      levelLimit : d.LevelLimit,
      needJobClass : d.NeedJobClass,
      id : null,
      typeId : d.Type,
      potentialRatio : null,
      typeName : null,
      rank : hCodeValues.rankNames[d.Rank],
      enchantmentId : null,
    };
  }
}]);

m.factory('items',
['translations','dntData','hCodeValues','itemColumnsToLoad','createItem',
function(translations,dntData,hCodeValues,itemColumnsToLoad,createItem) {

  function loadItems(itemType) {
    
    itemType.items = [];
    var numRows = dntData.getNumRows(itemType.mainDnt);
    for(var r=0;r<numRows;++r) {
      var dType = dntData.getValue(itemType.mainDnt, r, 'Type');
      var dLevelLimit = dntData.getValue(itemType.mainDnt, r, 'LevelLimit');
      
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
        dLevelLimit >= itemType.minLevel) {

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
            itemType.items.push(createItem(itemType.name, d, null, totalRatio));
          }
          else {
            for(var p=0;p<numPotentials;++p) {
              itemType.items.push(createItem(itemType.name, d, potentials[p], totalRatio));
            }
          }
        }
      }
    }
  }
  
  function addMethods(itemType) {

    itemType.loading = false;
    itemType.items = null;
    itemType.isLoaded = function() {
      return itemType.items != null;
    };
    
    itemType.hasStartedLoading = function() {
      return itemType.loading;
    };
    
    function doComplete(complete) {
      if(translations.isLoaded() && dntData.isLoaded(itemType.mainDnt) && (!('potentialDnt' in itemType) || dntData.isLoaded(itemType.potentialDnt))) {
        loadItems(itemType);
        dntData.reset(itemType.mainDnt);
        if('potentialDnt' in itemType) {
          dntData.reset(itemType.potentialDnt);
        }
        complete();
      }
    }

    itemType.init = function(progress, complete) {
      itemType.loading = true;

      if(itemType.items != null) {
        complete();

      }
      else {
        
        translations.init(progress, function() { doComplete(complete) });
        dntData.init(itemType.mainDnt, itemColumnsToLoad.mainDnt, progress, function() { doComplete(complete) });
        if('potentialDnt' in itemType) {
          dntData.init(itemType.potentialDnt, null, progress, function() { doComplete(complete) });
        }

        doComplete(complete);
      }
    };
    
    itemType.reset = function() {
      itemType.items = null;
      itemType.loading = false;
      dntData.reset(itemType.mainDnt);
    };

    itemType.getItems = function () {
      return itemType.items;
    }
  }
  
  var itemTypes = {
    
      title : { mainDnt : 'appellationtable.dnt', type : 'titles', minLevel: 0 },
      // wspr: { mainDnt: 'itemtable_source.dnt', type: 'wellspring', minLevel: 24 },
      
      tech: { 
        mainDnt: 'itemtable_skilllevelup.dnt', 
        potentialDnt: 'potentialtable.dnt', 
        type: 'techs', 
        minLevel: 24 },
      
      tman: { 
        mainDnt: 'itemtable_talisman.dnt', 
        type: 'talisman', 
        potentialDnt: 'potentialtable_talismanitem.dnt',
        minLevel: 24 },
      
      gem: { 
        mainDnt: 'itemtable_dragonjewel.dnt', 
        potentialDnt: 'potentialtable_dragonjewel.dnt',
        type: 'gems',
        minLevel: 24 },
      
      plate: { 
        mainDnt : 'itemtable_glyph.dnt', 
        potentialDnt: 'potentialtable_glyph.dnt',
        type: 'plates',
        minLevel: 16 },

      eq: {
        mainDnt: 'itemtable_equipment.dnt', 
        partsDnt: 'partstable_equipment.dnt', 
        weaponDnt: 'weapontable_equipment.dnt', 
        enchantDnt: 'enchanttable.dnt', 
        potentialDnt: 'potentialtable.dnt',
        setDnt: 'setitemtable.dnt',
        type: 'equipment',
        minLevel: 24 },
      rbeq: { 
        mainDnt: 'itemtable_reboot.dnt', 
        partsDnt: 'partstable_reboot.dnt', 
        weaponDnt: 'weapontable_reboot.dnt', 
        enchantDnt: 'enchanttable_reboot.dnt', 
        potentialDnt: 'potentialtable_reboot.dnt',
        setDnt: 'setitemtable.dnt',
        type: 'equipment',
        minLevel: 24 },
      pvpeq: { 
        mainDnt: 'itemtable_pvp.dnt',
        partsDnt: 'partstable_pvp.dnt', 
        weaponDnt: 'weapontable_pvp.dnt', 
        enchantDnt: 'enchanttable.dnt', 
        setDnt: 'setitemtable.dnt',
        type: 'equipment',
        minLevel: 24 },
      c2015: { 
        mainDnt: 'itemtable_common2015.dnt', 
        partsDnt: 'partstable_common2015.dnt', 
        weaponDnt: 'weapontable_common2015.dnt', 
        setDnt: 'setitemtable_cash.dnt',
        type: 'cash',
        minLevel: 0 },
      c2014: { 
        mainDnt: 'itemtable_common2014.dnt', 
        partsDnt: 'partstable_common2014.dnt', 
        weaponDnt: 'weapontable_common2014.dnt', 
        setDnt: 'setitemtable_cash.dnt',
        type: 'cash',
        minLevel: 0 },
      cash: { 
        mainDnt: 'itemtable_cash.dnt', 
        partsDnt: 'partstable_cash.dnt', 
        weaponDnt: 'weapontable_cash.dnt', 
        setDnt: 'setitemtable_cash.dnt',
        type: 'cash',
        minLevel: 0 },
      event: {
        mainDnt: 'itemtable_event.dnt', 
        setDnt: 'setitemtable_cash.dnt',
        type: 'cash',
        minLevel: 0 },
    };
    
    var allItems = [];
    
    angular.forEach(itemTypes, function(value, key) {
      value.name = key;
      addMethods(value);
      allItems.push(value);
    });

    itemTypes.all = allItems;
    
  return itemTypes;
  
}]);
