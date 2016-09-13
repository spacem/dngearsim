(function () {
'use strict';

angular.module('dnsim').factory('items',
['translations','dntData','itemColumnsToLoad',items]);
function items(translations,dntData,itemColumnsToLoad) {
  
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
        potentialDntEx: 'potentialtable_reboot.optimised.lzjson',
        sparkDnt: 'potentialtable_potentialjewel.optimised.lzjson',
        type: 'techs', 
        minLevel: 24,
        minRank: 0},
      
      tman: { 
        mainDnt: 'itemtable_talisman.optimised.lzjson', 
        type: 'talisman', 
        potentialDnt: 'potentialtable_talismanitem.optimised.lzjson',
        minLevel: 24,
        minRank: 0 },
      
      gem: { 
        mainDnt: 'itemtable_dragonjewel.optimised.lzjson', 
        potentialDnt: 'potentialtable_dragonjewel.optimised.lzjson',
        potentialDntEx: 'potentialtable_reboot.optimised.lzjson',
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

      c2016: { 
        mainDnt: 'itemtable_common2016.optimised.lzjson', 
        partsDnt: 'partstable_common2016.optimised.lzjson', 
        weaponDnt: 'weapontable_common2016.optimised.lzjson', 
        setDnt: 'setitemtable_cash.optimised.lzjson',
        type: 'cash',
        minLevel: 0,
        minRank: 0 },
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
        mainDnt: 'itemtable_event.optimised.lzjson',
        partsDnt: 'partstable_event.optimised.lzjson',
        weaponDnt: 'weapontable_event.optimised.lzjson',
        setDnt: 'setitemtable_cash.optimised.lzjson',
        type: 'cash',
        minLevel: 0,
        minRank: 0 },
      xtras: {
        mainDnt: 'itemtable_vehicle.optimised.lzjson',
        partsDnt: 'vehiclepartstable.optimised.lzjson',
        setDnt: 'setitemtable_cash.optimised.lzjson',
        type: 'xtras',
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
        
        translations.init(progress, function() { doComplete(itemSource, complete) });
        dntData.init(itemSource.mainDnt, itemColumnsToLoad.mainDnt, progress, function() { doComplete(itemSource, complete) });
        if('potentialDnt' in itemSource) {
          dntData.init(itemSource.potentialDnt, itemColumnsToLoad.potentialDnt, progress, function() { doComplete(itemSource, complete) });
        }
        if('potentialDntEx' in itemSource) {
          dntData.init(itemSource.potentialDntEx, itemColumnsToLoad.potentialDnt, progress, function() { doComplete(itemSource, complete) });
        }
        if('gemDnt' in itemSource) {
          dntData.init(itemSource.gemDnt, itemColumnsToLoad.gemDnt, progress, function() { doComplete(itemSource, complete) });
        }
  
        doComplete(itemSource, complete);
      }
    }
    
    function doComplete(itemSource, complete) {
      if(translations.isLoaded() && 
      dntData.isLoaded(itemSource.mainDnt) && 
      (!('potentialDnt' in itemSource) || dntData.isLoaded(itemSource.potentialDnt)) &&
      (!('potentialDntEx' in itemSource) || dntData.isLoaded(itemSource.potentialDntEx)) &&
      (!('gemDnt' in itemSource) || dntData.isLoaded(itemSource.gemDnt))
      ) {
        complete();
        itemSource.loading = false;
      }
    }
  };
})();