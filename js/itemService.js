var m = angular.module('itemService', ['translationService','ngRoute','valueServices','dntServices']);

m.factory('items',
['translations','dntData','hCodeValues',
function(translations,dntData,hCodeValues) {

  function createItem(d, p) {
    var nameId = d.NameIDParam;
    if(nameId == null) {
      nameId = d.NameID;
    }
    
    return {
      name : null,
      getName : function() {
        if(this.name == null) {
          this.name = translations.translate(nameId).replace(/\{|\}/g,'').replace(/\,/g,' ');
        }
        return this.name;
      },
      levelLimit : d['LevelLimit'],
      needJobClass : d['NeedJobClass'],
      rank : d['Rank'],
      id : d['id'],
      type : d['Type'],
      getPotentialRatio : function() {
        if(p != null && p.PotentialRatio > 0 && p.PotentialRatio != 1 && p.PotentialRatio != 100) {
          return Math.round(p.PotentialRatio*10)/10 + '%';
        }
        else {
          return null;
        }
      },
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
          var stats = hCodeValues.getStats(d); 
          if(p != null) {
            var potentialStats = hCodeValues.getStats(p);
            angular.forEach(potentialStats, function(pValue, pKey) {
              var added = false;
              angular.forEach(stats, function(sValue, sKey) {
                if(pValue.num == sValue.num) {
                  sValue.min = Number(sValue.min) + Number(pValue.min);
                  sValue.max = Number(sValue.max) +  Number(pValue.max);
                  added = true;
                }
              });
            
              if(!added) {
                stats.push(pValue);
              }
            });
          }
          
          this.stats = stats;
        }
      }
    };
  }
  
  function loadItems(item) {
    var data = dntData.getData(item.mainDnt);

    item.items = [];
    var numRows = data.length;
    for(var r=0;r<numRows;++r) {
      var d = data[r];
      if(d.State1_GenProb > 0 || d.StateValue1 > 0 || d.TypeParam1 > 0) {
        
        var potentials = [];
        if(d.TypeParam1 > 0 && 'potentialDnt' in item) {
          potentials = dntData.find(item.potentialDnt, 'PotentialID', d.TypeParam1);
        }
        
        var numPotentials = potentials.length;
        if(numPotentials == 0) {
          item.items.push(createItem(d, null));
        }
        else {
          for(var p=0;p<numPotentials;++p) {
            item.items.push(createItem(d, potentials[p]));
          }
        }
      }
    }
  }
  
  function addMethods(item) {

    item.items = null;
    item.isLoaded = function() {
      return item.items != null || dntData.isLoaded(item.mainDnt);
    };

    item.init = function(progress, complete) {

      if(item.items != null) {
        complete();
      }
      else {
        
        if(!translations.startedLoading) {
          translations.init(progress, function() { item.init(progress, complete) });
        }
        
        if(!dntData.hasStartedLoading(item.mainDnt)) {
          dntData.init(item.mainDnt, progress, function() { item.init(progress, complete) });
        }
        
        if('potentialDnt' in item && !dntData.hasStartedLoading(item.potentialDnt)) {
          dntData.init(item.potentialDnt, progress, function() { item.init(progress, complete) });
        }
        
        if(translations.loaded && dntData.isLoaded(item.mainDnt) && (!('potentialDnt' in item) || dntData.isLoaded(item.potentialDnt))) {
          loadItems(item);
          complete();
        }
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
        partsDnt: 'partstable.dnt', 
        weaponDnt: 'weapontable.dnt', 
        enchantDnt: 'enchanttable.dnt', 
        potentialDnt: 'potentialtable.dnt',
        type: 'equipment' },
      rebootEquipment: { 
        mainDnt: 'itemtable_reboot.dnt', 
        partsDnt: 'partstable_reboot.dnt', 
        weaponDnt: 'weapontable_reboot.dnt', 
        enchantDnt: 'enchanttable_reboot.dnt', 
        potentialDnt: 'potentialtable_reboot.dnt',
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
