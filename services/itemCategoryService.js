(function () {
'use strict';

angular.module('dnsim').factory('itemCategory',
['itemFactory','items',itemCategory]);
function itemCategory(itemFactory,items) {

  return {
    categories: [
      {path: 'search/titles', name:'titles', sourceType: 'titles', hideRank: true, hideJob: true, hideLevel: true},
      {path: 'search/weapons', name:'weapons', sourceType: 'equipment'},
      {path: 'search/armour', name:'armour', sourceType: 'equipment'},
      {path: 'search/accessories', name:'accessories', sourceType: 'equipment', hideJob: true},
      {path: 'search/techs', name:'techs', sourceType: 'techs'},
      {path: 'search/offensive-gems', name:'offensive gems', sourceType: 'gems', hideJob: true},
      {path: 'search/increasing-gems', name:'increasing gems', sourceType: 'gems', hideJob: true},
      {path: 'search/enhancement-plates', name:'enhancement plates', sourceType: 'plates', hideJob: true},
      {path: 'search/expedition-plates', name:'expedition plates', sourceType: 'plates', hideRank: true, hideJob: true},
      {path: 'search/talisman', name:'talisman', sourceType: 'talisman', hideJob: true},
      {path: 'search/cash', name:'cash', sourceType: 'cash'},
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