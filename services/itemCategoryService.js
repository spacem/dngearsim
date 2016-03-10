(function () {
'use strict';

angular.module('dnsim').factory('itemCategory',
['itemFactory','items',itemCategory]);
function itemCategory(itemFactory,items) {

  return {
    categories: [
      {path: 'search/titles', name:'titles', sourceType: 'titles', hideRank: true, hideJob: true, hideLevel: true, numItemText: '1', maxCat: 1},
      {path: 'search/weapons', name:'weapons', sourceType: 'equipment', numItemText: '2', maxExchange: 1, maxCat: 2},
      {path: 'search/armour', name:'armour', sourceType: 'equipment', numItemText: '5', maxExchange: 1, maxCat: 5},
      {path: 'search/accessories', name:'accessories', sourceType: 'equipment', hideJob: true, maxCat: 4, maxExchange: 2},
      {path: 'search/techs', name:'techs', sourceType: 'techs', maxCat: 4, maxExchange: 2},
      {path: 'search/offensive-gems', name:'offensive gems', sourceType: 'gems', hideJob: true, maxCat: 4, maxExchange: 4},
      {path: 'search/increasing-gems', name:'increasing gems', sourceType: 'gems', hideJob: true, maxCat: 14, maxExchange: 14},
      {path: 'search/enhancement-plates', name:'enhancement plates', sourceType: 'plates', hideJob: true, numItemText: '8+3', maxCat: 11, maxExchange: 15},
      {path: 'search/expedition-plates', name:'expedition plates', sourceType: 'plates', hideRank: true, hideJob: true, numItemText: '4', maxCat: 4, maxExchange: 15},
      {path: 'search/talisman', name:'talisman', sourceType: 'talisman', hideJob: true, numItemText: '8+4', maxExchange: 1, maxCat: 12, maxExchange: 12},
      {path: 'search/cash', name:'cash', sourceType: 'cash', numItemText: '15', maxCat: 15, maxExchange: 2},
      {path: 'search/skills', name:'skills'},
      {path: 'search/custom', name:'custom'},
      ],
      
    byName: function(name) {
      var retVal = null;
      angular.forEach(this.categories, function(category, index) {
        if(category.name == name) {
          retVal = category;
        }
      });
      
      return retVal;
    },
      
    byPath: function(name) {
      var retVal = null;
      angular.forEach(this.categories, function(category, index) {
        if(category.path == name) {
          retVal = category;
        }
      });
      
      return retVal;
    },
    
    getItems: function(name) {
      var cat = this.byName(name);
      if(cat && 'sourceType' in cat) {
        var retVal = [];
        angular.forEach(items, function(source, sourceName) {
          if(source.type == cat.sourceType && retVal != null) {
            if(source.items == null && !source.loading) {
              itemFactory.loadItems(source);
            }
            
            if(source.items != null) {
              retVal = retVal.concat(source.items);
            }
            else {
              retVal = null; // if any are null just return null
            }
          }
        });
        
        return retVal;
      }
      else {
        return null;
      }
    },
    
    init: function(name, complete) {
      var cat = this.byName(name);
      if(cat && 'sourceType' in cat) {
        angular.forEach(items, function(source, sourceName) {
          if(source.type == cat.sourceType) {
            source.init(function() {}, complete);
          }
        });
      }
    },
  }
}

})();