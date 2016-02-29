(function () {
'use strict';

angular.module('dnsim').factory('initItem',
['translations','hCodeValues','items','dntData',initItem]);
function initItem(translations,hCodeValues,items,dntData) {

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
}

})();