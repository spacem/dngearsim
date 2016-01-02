var m = angular.module('itemService', ['translationService','ngRoute','valueServices','dntServices']);

m.factory('initItem',
['translations','hCodeValues',
function(translations,hCodeValues) {
  return function(item) {

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
    
    if(p != null) {
      item.pid = p.id;
    }
    
    delete item.data;
    delete item.potential;
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
    
    function getTypeName(type) {
      var typeName = hCodeValues.typeNames[type];
      if(typeName == null) {
        return type;
      }
      else {
        return typeName;
      }
    }
    
    function getPotentialRatio(p) {
      
      if(p != null && p.PotentialRatio > 0) {
        var ratio = Math.round(p.PotentialRatio/totalRatio*100*100)/100;
        if(ratio != 100) {
          return ratio + '%';
        }
      }

      return null;
    }
    
    // data and potential are used to initialise name and stats
    // this is only done when needed
    // they are then removed from the object
    return {
      data : d,
      potential : p,
      id: d.id,
      name : null,
      stats : null,
      itemTypeName : itemTypeName,
      levelLimit : d.LevelLimit,
      needJobClass : d.NeedJobClass,
      id : d.id,
      typeId : d.Type,
      potentialRatio : getPotentialRatio(p),
      typeName : getTypeName(d.Type),
      rank : hCodeValues.rankNames[d.Rank],
      enchantmentId : d.EnchantID,
    };
  }
}]);

m.factory('items',
['translations','dntData','hCodeValues','itemColumnsToLoad','createItem',
function(translations,dntData,hCodeValues,itemColumnsToLoad,createItem) {

  function loadItems(itemType) {
    var data = dntData.getData(itemType.mainDnt);

    itemType.items = [];
    var numRows = data.length;
    for(var r=0;r<numRows;++r) {
      var d = data[r];
      // skip certain types like pouches, res scrolls, etc
      if(d.Type != 8 &&
        d.Type != 29 &&
        d.Type != 114 &&
        d.Type != 79 &&
        d.Type != 174 &&
        d.Type != 130 &&
        d.Type != 24 &&
        d.Type != 182 &&
        d.Type != 78 &&
        d.Type != 20 &&
        d.Type != 46 &&
        d.Type != 9) {
          
        // skip items with no data
        if(d.State1_GenProb > 0 || d.StateValue1 > 0 || d.TypeParam1 > 0) {
          
          var potentials = [];
          if(d.TypeParam1 > 0 && 'potentialDnt' in itemType) {
            potentials = dntData.find(itemType.potentialDnt, 'PotentialID', d.TypeParam1);
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
        dntData.init(itemType.potentialDnt, null, progress, function() { doComplete(complete) });

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
    
      title : { mainDnt : 'appellationtable.dnt', type : 'titles' },
      wspr: { mainDnt: 'itemtable_source.dnt', type: 'wellspring' },
      
      tech: { 
        mainDnt: 'itemtable_skilllevelup.dnt', 
        potentialDnt: 'potentialtable.dnt', 
        type: 'techs' },
      
      tman: { 
        mainDnt: 'itemtable_talisman.dnt', 
        type: 'talisman', 
        potentialDnt: 'potentialtable_talismanitem.dnt' },
      
      gem: { 
        mainDnt: 'itemtable_dragonjewel.dnt', 
        potentialDnt: 'potentialtable_dragonjewel.dnt',
        type: 'gems' },
      
      plate: { 
        mainDnt : 'itemtable_glyph.dnt', 
        potentialDnt: 'potentialtable_glyph.dnt',
        type: 'plates' },

      eq: {
        mainDnt: 'itemtable_equipment.dnt', 
        partsDnt: 'partstable_equipment.dnt', 
        weaponDnt: 'weapontable_equipment.dnt', 
        enchantDnt: 'enchanttable.dnt', 
        potentialDnt: 'potentialtable.dnt',
        setDnt: 'setitemtable.dnt',
        type: 'equipment' },
      rbeq: { 
        mainDnt: 'itemtable_reboot.dnt', 
        partsDnt: 'partstable_reboot.dnt', 
        weaponDnt: 'weapontable_reboot.dnt', 
        enchantDnt: 'enchanttable_reboot.dnt', 
        potentialDnt: 'potentialtable_reboot.dnt',
        setDnt: 'setitemtable.dnt',
        type: 'equipment' },
      pvpeq: { 
        mainDnt: 'itemtable_pvp.dnt',
        partsDnt: 'partstable_pvp.dnt', 
        weaponDnt: 'weapontable_pvp.dnt', 
        enchantDnt: 'enchanttable.dnt', 
        setDnt: 'setitemtable.dnt',
        type: 'equipment' },
      c2015: { 
        mainDnt: 'itemtable_common2015.dnt', 
        partsDnt: 'partstable_common2015.dnt', 
        weaponDnt: 'weapontable_common2015.dnt', 
        setDnt: 'setitemtable_cash.dnt',
        type: 'cash' },
      c2014: { 
        mainDnt: 'itemtable_common2014.dnt', 
        partsDnt: 'partstable_common2014.dnt', 
        weaponDnt: 'weapontable_common2014.dnt', 
        setDnt: 'setitemtable_cash.dnt',
        type: 'cash' },
      cash: { 
        mainDnt: 'itemtable_cash.dnt', 
        partsDnt: 'partstable_cash.dnt', 
        weaponDnt: 'weapontable_cash.dnt', 
        setDnt: 'setitemtable_cash.dnt',
        type: 'cash' },
      event: {
        mainDnt: 'itemtable_event.dnt', 
        setDnt: 'setitemtable_cash.dnt',
        type: 'cash' },
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
