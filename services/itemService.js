var m = angular.module('itemService', ['translationService','ngRoute','valueServices','dntServices']);

'use strict';

m.factory('initItem',
['translations','hCodeValues','items','dntData',
function(translations,hCodeValues,items,dntData) {

  function getTypeName(d, itemSource) {
    var itemTypeDef = items[itemSource];
    
    if(itemSource in items && itemTypeDef.type == 'cash') {
      return 'cash';
    }
    else if(itemSource in items && itemTypeDef.type == 'techs') {
      return 'techs';
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
  
  return function(item) {
    
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
      
      if(item.potentialRatio == null) {
        item.potentialRatio = getPotentialRatio(p, item.totalRatio);
      }
      
      if(item.typeName == null) {
        item.typeName = getTypeName(d, item.itemSource);
      }
      
      if(item.enchantmentId == null ) {
        item.enchantmentId = d.EnchantID;
      }
      
      if(p != null) {
        item.pid = p.id;
      }
      
      item.data = null;
      item.potential = null;
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
    potentialDnt : {
      PotentialID: true, PotentialNo: true,PotentialRatio: true,
      State1: true,State1Value: true,
      State2: true,State2Value: true,
      State3: true,State3Value: true,
      State4: true,State4Value: true,
      State5: true,State5Value: true,
      State6: true,State6Value: true,
      State7: true,State7Value: true,
      State8: true,State8Value: true,
      State9: true,State9Value: true,
      State10: true,State10Value: true,
      State11: true,State11Value: true,
      State12: true,State12Value: true,
      State13: true,State13Value: true,
      State14: true,State14Value: true,
      State15: true,State15Value: true,
      State16: true,State16Value: true
    },
    gemDnt: {
      Type: true
    },
    setDnt : null,
    sparkDnt: null,
    jobsDnt: {
      JobName: true,JobNumber: true,BaseClass: true,ParentJob: true, EnglishName: true
    },
    jobBaseStatColsToLoad: {
      Strength:true,Agility:true,Intelligence:true,Stamina:true,AggroperPvE:true,BaseMP:true
    },
    statCapColsToLoad: {
      Cbase: true,
      Cdefense: true,
      Ccritical: true,
      Cfinaldamage: true,
      CcriticalDamage: true,
    },
    jobConversionColsToLoad: {
      HP: true,StrengthAttack: true,AgilityAttack: true,IntelligenceAttack: true,PhysicalDefense: true,MagicDefense: true,Critical: true,CriticalResistance: true,Stiff: true,StiffResistance: true,Stun: true,StunResistance: true,MoveSpeed: true,MoveSpeedRevision: true,DownDelay: true,ElementAttack: true,ElementDefense: true,ElementDefenseMin: true,ElementDefenseMax: true,StrengthIntelligenceToCriticalDamage: true
    }
  }
}]);

m.factory('createItem',
['translations','dntData','hCodeValues','itemColumnsToLoad',
function(translations,dntData,hCodeValues,itemColumnsToLoad) {
  
  return function(itemSource, d, p, totalRatio) {
    
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
      itemSource : itemSource,
      levelLimit : d.LevelLimit,
      needJobClass : d.NeedJobClass,
      id : null,
      typeId : d.Type,
      potentialRatio : null,
      typeName : null,
      rank : hCodeValues.rankNames[d.Rank],
      enchantmentId : null,
      sparkTypeId: null,
    };
  }
}]);

m.factory('items',
['translations','dntData','hCodeValues','itemColumnsToLoad','createItem',
function(translations,dntData,hCodeValues,itemColumnsToLoad,createItem) {

  function loadItems(itemType) {
    
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
        dLevelLimit >= itemType.minLevel &&
        dRank >= itemType.minRank) {

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
            
    var end = new Date().getTime();
    var time = end - start;
    console.log('item init time: ' + time/1000 + 's for ' + itemType.name);
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
      if(translations.isLoaded() && 
      dntData.isLoaded(itemType.mainDnt) && 
      (!('potentialDnt' in itemType) || dntData.isLoaded(itemType.potentialDnt)) &&
      (!('gemDnt' in itemType) || dntData.isLoaded(itemType.gemDnt))
      ) {
        
        loadItems(itemType);
        dntData.reset(itemType.mainDnt);
        if('potentialDnt' in itemType) {
          // could reset but these are shared
          // dntData.reset(itemType.potentialDnt);
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
          dntData.init(itemType.potentialDnt, itemColumnsToLoad.potentialDnt, progress, function() { doComplete(complete) });
        }
        if('gemDnt' in itemType) {
          dntData.init(itemType.gemDnt, itemColumnsToLoad.gemDnt, progress, function() { doComplete(complete) });
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
  
  var itemSources = {
    
      title : { mainDnt : 'appellationtable.optimised.lzjson', type : 'titles', minLevel: 0 },
      // wspr: { mainDnt: 'itemtable_source.dnt', type: 'wellspring', minLevel: 24 },
      
      tech: { 
        mainDnt: 'itemtable_skilllevelup.optimised.lzjson', 
        potentialDnt: 'potentialtable.optimised.lzjson',
        sparkDnt: 'potentialtable_potentialjewel.optimised.lzjson',
        type: 'techs', 
        minLevel: 24,
        minRank: 0 },
      
      tman: { 
        mainDnt: 'itemtable_talisman.optimised.lzjson', 
        type: 'talisman', 
        potentialDnt: 'potentialtable_talismanitem.optimised.lzjson',
        minLevel: 24,
        minRank: 0 },
      
      gem: { 
        mainDnt: 'itemtable_dragonjewel.optimised.lzjson', 
        potentialDnt: 'potentialtable_dragonjewel.optimised.lzjson',
        enchantDnt: 'enchanttable_dragonjewel.optimised.lzjson', 
        gemDnt: 'dragonjeweltable.optimised.lzjson',
        type: 'gems',
        minLevel: 24,
        minRank: 3},
      
      plate: { 
        mainDnt : 'itemtable_glyph.optimised.lzjson', 
        potentialDnt: 'potentialtable_glyph.optimised.lzjson',
        type: 'plates',
        minLevel: 16,
        minRank: 2 },

      items: {
        mainDnt: 'itemtable.optimised.lzjson', 
        partsDnt: 'partstable.optimised.lzjson', 
        weaponDnt: 'weapontable.optimised.lzjson', 
        enchantDnt: 'enchanttable.optimised.lzjson', 
        potentialDnt: 'potentialtable.optimised.lzjson',
        setDnt: 'setitemtable.optimised.lzjson',
        type: 'equipment',
        minLevel: 80,
        minRank: 3 },
      eq: {
        mainDnt: 'itemtable_equipment.optimised.lzjson', 
        partsDnt: 'partstable_equipment.optimised.lzjson', 
        weaponDnt: 'weapontable_equipment.optimised.lzjson', 
        enchantDnt: 'enchanttable.optimised.lzjson', 
        potentialDnt: 'potentialtable.optimised.lzjson',
        sparkDnt: 'potentialtable_potentialjewel.optimised.lzjson',
        setDnt: 'setitemtable.optimised.lzjson',
        type: 'equipment',
        minLevel: 24,
        minRank: 3 },
      rbeq: { 
        mainDnt: 'itemtable_reboot.optimised.lzjson', 
        partsDnt: 'partstable_reboot.optimised.lzjson', 
        weaponDnt: 'weapontable_reboot.optimised.lzjson', 
        enchantDnt: 'enchanttable_reboot.optimised.lzjson', 
        potentialDnt: 'potentialtable_reboot.optimised.lzjson',
        setDnt: 'setitemtable.optimised.lzjson',
        type: 'equipment',
        minLevel: 24,
        minRank: 3 },
      pvpeq: { 
        mainDnt: 'itemtable_pvp.optimised.lzjson',
        partsDnt: 'partstable_pvp.optimised.lzjson', 
        weaponDnt: 'weapontable_pvp.optimised.lzjson', 
        enchantDnt: 'enchanttable.optimised.lzjson', 
        setDnt: 'setitemtable.optimised.lzjson',
        type: 'equipment',
        minLevel: 24,
        minRank: 3 },

      c2015: { 
        mainDnt: 'itemtable_common2015.optimised.lzjson', 
        partsDnt: 'partstable_common2015.optimised.lzjson', 
        weaponDnt: 'weapontable_common2015.optimised.lzjson', 
        setDnt: 'setitemtable_cash.optimised.lzjson',
        type: 'cash',
        minLevel: 0,
        minRank: 0 },
      c2014: { 
        mainDnt: 'itemtable_common2014.optimised.lzjson', 
        partsDnt: 'partstable_common2014.optimised.lzjson', 
        weaponDnt: 'weapontable_common2014.optimised.lzjson', 
        setDnt: 'setitemtable_cash.optimised.lzjson',
        type: 'cash',
        minLevel: 0,
        minRank: 0 },
      cash: { 
        mainDnt: 'itemtable_cash.optimised.lzjson', 
        partsDnt: 'partstable_cash.optimised.lzjson', 
        weaponDnt: 'weapontable_cash.optimised.lzjson', 
        setDnt: 'setitemtable_cash.optimised.lzjson',
        type: 'cash',
        minLevel: 0,
        minRank: 0 },
      event: {
        mainDnt: 'itemtable_event.lzjson', 
        setDnt: 'setitemtable_cash.lzjson',
        type: 'cash',
        minLevel: 0,
        minRank: 0 },
    };
    
    var allItems = [];
    
    angular.forEach(itemSources, function(value, key) {
      value.name = key;
      addMethods(value);
      allItems.push(value);
    });

    itemSources.all = allItems;
    
  return itemSources;
  
}]);
