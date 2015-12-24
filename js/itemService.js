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
    
    delete item.data;
    delete item.potential;
  }
}]);

m.factory('items',
['translations','dntData','hCodeValues',
function(translations,dntData,hCodeValues) {

  function createItem(itemTypeName, d, p) {
    
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
      if(p != null && p.PotentialRatio > 0 && p.PotentialRatio != 1 && p.PotentialRatio != 100) {
        return Math.round(p.PotentialRatio*10)/10 + '%';
      }
      else {
        return null;
      }
    }
    
    // data and potential are used to initialise name and stats
    // this is only done when needed
    // they are then removed from the object
    return {
      data : d,
      potential : p,
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
          
          var numPotentials = potentials.length;
          if(numPotentials == 0) {
            itemType.items.push(createItem(itemType.name, d, null));
          }
          else {
            for(var p=0;p<numPotentials;++p) {
              itemType.items.push(createItem(itemType.name, d, potentials[p]));
            }
          }
        }
      }
    }
  }
  
  function addMethods(itemType) {

    itemType.items = null;
    itemType.isLoaded = function() {
      return itemType.items != null || dntData.isLoaded(itemType.mainDnt);
    };

    itemType.init = function(progress, complete) {

      if(itemType.items != null) {
        complete();
      }
      else {
        
        if(!translations.startedLoading) {
          translations.init(progress, function() { itemType.init(progress, complete) });
        }
        
        if(!dntData.hasStartedLoading(itemType.mainDnt)) {
          dntData.init(itemType.mainDnt, progress, function() { itemType.init(progress, complete) });
        }
        
        if('potentialDnt' in itemType && !dntData.hasStartedLoading(itemType.potentialDnt)) {
          dntData.init(itemType.potentialDnt, progress, function() { itemType.init(progress, complete) });
        }
        
        if(translations.loaded && dntData.isLoaded(itemType.mainDnt) && (!('potentialDnt' in itemType) || dntData.isLoaded(itemType.potentialDnt))) {
          loadItems(itemType);
          complete();
        }
      }
    };
    
    itemType.resetLoader = function() {
      itemType.items = null;
      dntData.reset(itemType.mainDnt);
    };

    itemType.getItems = function () {
      return itemType.items;
    }
  }
  
  var itemTypes = {
    
      titles : { mainDnt : 'appellationtable.dnt', type : 'titles' },
      wellspring: { mainDnt: 'itemtable_source.dnt', type: 'wellspring' },
      
      techs: { 
        mainDnt: 'itemtable_skilllevelup.dnt', 
        potentialDnt: 'potentialtable.dnt', 
        type: 'techs' },
      
      talisman: { 
        mainDnt: 'itemtable_talisman.dnt', 
        type: 'talisman', 
        potentialDnt: 'potentialtable_talismanitem.dnt' },
      
      gems: { 
        mainDnt: 'itemtable_dragonjewel.dnt', 
        potentialDnt: 'potentialtable_dragonjewel.dnt',
        type: 'gems' },
      
      plates: { 
        mainDnt : 'itemtable_glyph.dnt', 
        potentialDnt: 'potentialtable_glyph.dnt',
        type: 'plates' },

      equipment: {
        mainDnt: 'itemtable_equipment.dnt', 
        partsDnt: 'partstable_equipment.dnt', 
        weaponDnt: 'weapontable_equipment.dnt', 
        enchantDnt: 'enchanttable.dnt', 
        potentialDnt: 'potentialtable.dnt',
        setDnt: 'setitemtable.dnt',
        type: 'equipment' },
      rebootEquipment: { 
        mainDnt: 'itemtable_reboot.dnt', 
        partsDnt: 'partstable_reboot.dnt', 
        weaponDnt: 'weapontable_reboot.dnt', 
        enchantDnt: 'enchanttable_reboot.dnt', 
        potentialDnt: 'potentialtable_reboot.dnt',
        setDnt: 'setitemtable.dnt',
        type: 'equipment' },
      pvpEquipment: { 
        mainDnt: 'itemtable_pvp.dnt',
        partsDnt: 'partstable_pvp.dnt', 
        weaponDnt: 'weapontable_pvp.dnt', 
        enchantDnt: 'enchanttable.dnt', 
        setDnt: 'setitemtable.dnt',
        type: 'equipment' },
      cash2015: { 
        mainDnt: 'itemtable_common2015.dnt', 
        partsDnt: 'partstable_common2015.dnt', 
        weaponDnt: 'weapontable_common2015.dnt', 
        setDnt: 'setitemtable_cash.dnt',
        type: 'cash' },
      cash2014: { 
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
    
    var allItems = []
    
    angular.forEach(itemTypes, function(value, key) {
      value.name = key;
      addMethods(value);
      allItems.push(value);
    });

    itemTypes.all = allItems;
    
  return itemTypes;
  
}]);
