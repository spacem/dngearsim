(function () {
'use strict';

angular.module('dnsim').factory('items',
['translations','dntData','hCodeValues','itemColumnsToLoad',items]);
function items(translations,dntData,hCodeValues,itemColumnsToLoad) {

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
            itemType.items.push(itemType.createItem(d, null, totalRatio));
          }
          else {
            for(var p=0;p<numPotentials;++p) {
              itemType.items.push(itemType.createItem(d, potentials[p], totalRatio));
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
    
    itemType.createItem = function(d, p, totalRatio) {
      
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
        itemSource : this.name,
        levelLimit : d.LevelLimit,
        needJobClass : d.NeedJobClass,
        typeId : d.Type,
        potentialRatio : null,
        typeName : null,
        rank : hCodeValues.rankNames[d.Rank],
        enchantmentId : null,
        sparkTypeId: null,
        sparkId: null,
      };
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
    
      title : {
        mainDnt: 'appellationtable.optimised.lzjson', 
        type: 'titles', 
        minLevel: 0, 
        minRank: 0 },
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
}

})();