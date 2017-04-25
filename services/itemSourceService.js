(function () {
'use strict';

angular.module('dnsim').factory('items',
['translations','dntData','itemColumnsToLoad',items]);
function items(translations,dntData,itemColumnsToLoad) {
  
  var itemSources = {
    
      title : {
        mainDnt: 'appellationtable.optimised.json', 
        type: 'titles', 
        minLevel: 0, 
        minRank: 0 },
      // wspr: { mainDnt: 'itemtable_source.dnt', type: 'wellspring', minLevel: 24 },
      
      tech: { 
        mainDnt: 'itemtable_skilllevelup.optimised.json', 
        potentialDnt: 'potentialtable.optimised.json',
        potentialDntEx: 'potentialtable_reboot.optimised.json',
        sparkDnt: 'potentialtable_potentialjewel.optimised.json',
        gemSlotDnt: 'dragonjewelslottable.lzjson',
        type: 'techs', 
        minLevel: 60,
        minRank: 0},
      
      tman: { 
        mainDnt: 'itemtable_talisman.optimised.json', 
        type: 'talisman', 
        potentialDnt: 'potentialtable_talismanitem.optimised.json',
        minLevel: 24,
        minRank: 0 },
      
      gem: { 
        mainDnt: 'itemtable_dragonjewel.optimised.json', 
        potentialDnt: 'potentialtable_dragonjewel.optimised.json',
        potentialDntEx: 'potentialtable_reboot.optimised.json',
        enchantDnt: 'enchanttable_dragonjewel.optimised.json', 
        gemDnt: 'dragonjeweltable.optimised.json',
        type: 'gems',
        minLevel: 24,
        minRank: 3},
      
      plate: { 
        mainDnt : 'itemtable_glyph.optimised.json', 
        potentialDnt: 'potentialtable_glyph.optimised.json',
        type: 'plates',
        minLevel: 16,
        minRank: 2 },

      items: {
        mainDnt: 'itemtable.optimised.json', 
        partsDnt: 'partstable.optimised.json', 
        weaponDnt: 'weapontable.optimised.json', 
        enchantDnt: 'enchanttable.optimised.json', 
        potentialDnt: 'potentialtable.optimised.json',
        setDnt: 'setitemtable.optimised.json',
        gemSlotDnt: 'dragonjewelslottable.lzjson',
        type: 'equipment',
        minLevel: 80,
        minRank: 3 },
      eq: {
        mainDnt: 'itemtable_equipment.optimised.json', 
        partsDnt: 'partstable_equipment.optimised.json', 
        weaponDnt: 'weapontable_equipment.optimised.json', 
        enchantDnt: 'enchanttable.optimised.json', 
        potentialDnt: 'potentialtable.optimised.json',
        sparkDnt: 'potentialtable_potentialjewel.optimised.json',
        setDnt: 'setitemtable.optimised.json',
        gemSlotDnt: 'dragonjewelslottable.lzjson',
        type: 'equipment',
        minLevel: 21,
        minRank: 3 },
      rbeq: { 
        mainDnt: 'itemtable_reboot.optimised.json', 
        partsDnt: 'partstable_reboot.optimised.json', 
        weaponDnt: 'weapontable_reboot.optimised.json', 
        enchantDnt: 'enchanttable_reboot.optimised.json', 
        potentialDnt: 'potentialtable_reboot.optimised.json',
        setDnt: 'setitemtable.optimised.json',
        gemSlotDnt: 'dragonjewelslottable.lzjson',
        type: 'equipment',
        minLevel: 24,
        minRank: 3 },
      pvpeq: { 
        mainDnt: 'itemtable_pvp.optimised.json',
        partsDnt: 'partstable_pvp.optimised.json', 
        weaponDnt: 'weapontable_pvp.optimised.json', 
        enchantDnt: 'enchanttable.optimised.json', 
        setDnt: 'setitemtable.optimised.json',
        type: 'equipment',
        gemSlotDnt: 'dragonjewelslottable.lzjson',
        minLevel: 24,
        minRank: 3 },

      cClone: {
        mainDnt: 'itemtable_cashclone.optimised.json',
        partsDnt: 'partstable_cashclone.optimised.json',
        type: 'cash',
        minLevel: 0,
        ignoreErrors: true,
        minRank: 4 },
      c2016: { 
        mainDnt: 'itemtable_common2016.optimised.json', 
        partsDnt: 'partstable_common2016.optimised.json', 
        weaponDnt: 'weapontable_common2016.optimised.json', 
        setDnt: 'setitemtable_cash.optimised.json',
        type: 'cash',
        minLevel: 0,
        minRank: 0 },
      c2017: { 
        mainDnt: 'itemtable_common2017.optimised.json', 
        partsDnt: 'partstable_common2017.optimised.json', 
        weaponDnt: 'weapontable_common2017.optimised.json', 
        setDnt: 'setitemtable_cash.optimised.json',
        type: 'cash',
        minLevel: 0,
        ignoreErrors: true,
        minRank: 0 },
      c2015: { 
        mainDnt: 'itemtable_common2015.optimised.json', 
        partsDnt: 'partstable_common2015.optimised.json', 
        weaponDnt: 'weapontable_common2015.optimised.json', 
        setDnt: 'setitemtable_cash.optimised.json',
        type: 'cash',
        minLevel: 0,
        minRank: 0 },
      c2014: { 
        mainDnt: 'itemtable_common2014.optimised.json', 
        partsDnt: 'partstable_common2014.optimised.json', 
        weaponDnt: 'weapontable_common2014.optimised.json', 
        setDnt: 'setitemtable_cash.optimised.json',
        type: 'cash',
        minLevel: 0,
        minRank: 0 },
      cash: { 
        mainDnt: 'itemtable_cash.optimised.json', 
        partsDnt: 'partstable_cash.optimised.json', 
        weaponDnt: 'weapontable_cash.optimised.json', 
        setDnt: 'setitemtable_cash.optimised.json',
        type: 'cash',
        minLevel: 0,
        minRank: 0 },
      event: {
        mainDnt: 'itemtable_event.optimised.json',
        partsDnt: 'partstable_event.optimised.json',
        weaponDnt: 'weapontable_event.optimised.json',
        setDnt: 'setitemtable_cash.optimised.json',
        type: 'cash',
        minLevel: 0,
        minRank: 0 },
      xtras: {
        mainDnt: 'itemtable_vehicle.optimised.json',
        partsDnt: 'vehiclepartstable.optimised.json',
        setDnt: 'setitemtable_cash.optimised.json',
        petDnt: 'vehicletable.lzjson',
        petLevelDnt: 'petleveltable.lzjson', 
        type: 'xtras',
        minLevel: 0,
        minRank: 0 },
      imprint: {
        mainDnt: 'itemtable_imprinting.optimised.json',
        type: 'imprint',
        minLevel: 0,
        minRank: 0 },
    };
    
    // now that the sources are set up add some methods on them for initialisation
    // each source will store the items from that source for reuse by searches
    angular.forEach(itemSources, function(itemSource, key) {
      itemSource.name = key;
      itemSource.loading = false;
      itemSource.items = null;
      itemSource.init = init; // decalared below
      itemSource.reset = function() {
        itemSource.items = null;
        itemSource.loading = false;
      };
    });

    return itemSources;
  
  
    function init(progress, complete) {
      var itemSource = this;
      itemSource.loading = true;
  
      if(itemSource.items) {
        complete();
      }
      else {
        
        translations.init(progress, function() {
          doComplete(itemSource, complete)
        });
        dntData.init(itemSource.mainDnt, itemColumnsToLoad.mainDnt, progress, function() {
          doComplete(itemSource, complete)
        }, itemSource.ignoreErrors);
        if('potentialDnt' in itemSource) {
          dntData.init(itemSource.potentialDnt, itemColumnsToLoad.potentialDnt, progress, function() {
            doComplete(itemSource, complete)
          }, itemSource.ignoreErrors);
        }
        if('potentialDntEx' in itemSource) {
          dntData.init(itemSource.potentialDntEx, itemColumnsToLoad.potentialDnt, progress, function() {
            doComplete(itemSource, complete)
          }, itemSource.ignoreErrors);
        }
        if('gemDnt' in itemSource) {
          dntData.init(itemSource.gemDnt, itemColumnsToLoad.gemDnt, progress, function() {
            doComplete(itemSource, complete)
          }, itemSource.ignoreErrors);
        }
  
        doComplete(itemSource, complete);
      }
    }
    
    function doComplete(itemSource, complete) {
      if(translations.isLoaded() && 
      dntData.isLoaded(itemSource.mainDnt) && 
      (!('potentialDnt' in itemSource) || dntData.isLoaded(itemSource.potentialDnt) || dntData.hasFailed(itemSource.potentialDnt)) &&
      (!('potentialDntEx' in itemSource) || dntData.isLoaded(itemSource.potentialDntEx) || dntData.hasFailed(itemSource.potentialDntEx)) &&
      (!('gemDnt' in itemSource) || dntData.isLoaded(itemSource.gemDnt) || dntData.hasFailed(itemSource.gemDnt))
      ) {
        complete();
        itemSource.loading = false;
      }
    }
  };
})();