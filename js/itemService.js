var m = angular.module('itemService', ['translationService','ngRoute','valueServices','dntServices']);

m.factory('items',
['translations','dntData','hCodeValues',
function(translations,dntData,hCodeValues) {

  function build(d) {
    var nameId = d.NameIDParam;
    if(nameId == null) {
      nameId = d.NameID;
    }
    return {
      name : translations.translate(nameId).replace(/\{|\}/g,'').replace(/\,/g,' '),
      levelLimit : d['LevelLimit'],
      needJobClass : d['NeedJobClass'],
      rank : d['Rank'],
      id : d['id'],
      type : d['Type'],
      getRankName : function() { return hCodeValues.rankNames[this.rank] },
      getTypeName : function() {
        var typeName = hCodeValues.typeNames[this.type];
        if(typeName == null) {
          return this.type;
        }
        else {
          return typeName;
        }
      },
      getEnchantmentId : function() {
        // TODO: lookup values in other dnt
        return d['EnchantID'];
      },
      stats : null,
      initStats : function() {
        if(this.stats == null) {
          this.stats = hCodeValues.getStats(d);
        }
      }
    };
  }
  
  function getItems(data) {
    var items = [];
    var numRows = data.length;
    for(var r=0;r<numRows;++r) {
      var d = data[r];
      if(d.State1_GenProb > 0 || d.StateValue1 > 0) {
        var equip = build(data[r]);
        items.push(equip);
      }
    }
    
    return items;
  }
  
  function addMethods(item) {

    item.items = null;
    item.isLoaded = function() {
      return item.items != null || dntData.isLoaded(item.mainDnt);
    };

    item.init = function(progress, complete) {
      if(item.items == null) {
          dntData.init(item.mainDnt, progress, function() {
          if(translations.loaded) {
            item.items = getItems(dntData.getData(item.mainDnt));
            dntData.reset(item.mainDnt);
            complete();
          }
          else {
            translations.init(progress, function() {
              item.items = getItems(dntData.getData(item.mainDnt));
              dntData.reset(item.mainDnt);
              complete();
            });
          }
        });
      }
      else {
        complete();
      }
    };
    
    item.resetLoader = function() {
      item.items = null;
      dntData.reset(item.mainDnt);
    };

    item.getItems = function () {
      return item.items;
    }
  }
  
  var items = {
    
      titles : { mainDnt : 'appellationtable.dnt', type : 'titles' },
      plates: { mainDnt : 'itemtable_glyph.dnt', type: 'plates' },
      talisman: { mainDnt: 'itemtable_talisman.dnt', type: 'talisman' },
      techs: { mainDnt: 'itemtable_skilllevelup.dnt', type: 'techs' },
      gems: { mainDnt: 'itemtable_dragonjewel.dnt', type: 'gems' },
      wellspring: { mainDnt: 'itemtable_source.dnt', type: 'wellspring' },

      equipment: {
        mainDnt: 'itemtable_equipment.dnt', 
        partsDnt: 'partstable.dnt', 
        weaponDnt: 'weapontable.dnt', 
        enchantDnt: 'enchanttable.dnt', 
        type: 'equipment' },
      rebootEquipment: { 
        mainDnt: 'itemtable_reboot.dnt', 
        partsDnt: 'partstable_reboot.dnt', 
        weaponDnt: 'weapontable_reboot.dnt', 
        enchantDnt: 'enchanttable_reboot.dnt', 
        type: 'equipment' },
      pvpEquipment: { 
        mainDnt: 'itemtable_pvp.dnt',
        partsDnt: 'partstable_pvp.dnt', 
        weaponDnt: 'weapontable_pvp.dnt', 
        enchantDnt: 'enchanttable.dnt', 
        type: 'equipment' },
      cash2015: { 
        mainDnt: 'itemtable_common2015.dnt', 
        partsDnt: 'partstable_common2015.dnt', 
        weaponDnt: 'weapontable_common2015.dnt', 
        type: 'cash' },
      cash2014: { 
        mainDnt: 'itemtable_common2014.dnt', 
        partsDnt: 'partstable_common2014.dnt', 
        weaponDnt: 'weapontable_common2014.dnt', 
        type: 'cash' },
      cash: { 
        mainDnt: 'itemtable_cash.dnt', 
        partsDnt: 'partstable_cash.dnt', 
        weaponDnt: 'weapontable_cash.dnt', 
        type: 'cash' },
    };
    
    items.all = [];
    
    angular.forEach(items, function(value, key) {
      addMethods(value);
      items.all.push(value);
    });
    
    
  return items;
  
}]);
