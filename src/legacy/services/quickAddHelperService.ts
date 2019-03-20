import * as angular from 'angular';

angular.module('dnsim').factory('quickAddHelper',
['itemCategory','itemFactory','jobs', quickAddHelper]);

function quickAddHelper(itemCategory,itemFactory,jobs) {

  return {
    getItem: getItem,
    findData: findData,
    filterDuplicates: filterDuplicates
  };
  
  function getItem(datas) {
    var item = null;
    for(var d=0;d<datas.length;++d) {
      if(datas[d].def.isItemStep) {
        item = datas[d].value;
      }
    }
    
    for(var d=0;d<datas.length;++d) {
      if(datas[d].def.alterItem) {
        datas[d].def.alterItem(datas[d].value.id, item);
      }
    }
    
    return item;
  }
  
  function findData(category, build, datas, maxItems) {
    if(!maxItems) {
      maxItems = 9999;
    }
    
    var allItems = itemCategory.getItems(category.name);
    var retVal = [];
    var numItems = allItems.length;

    var sortFunc = null;
    var sortId = null;
    
    for(var i=0;i<numItems;++i) {
      
      var item = allItems[i];
      
      if(!category.hideJob && build.job.id > 0 && item.needJobClass > 0 && !jobs.isClassJob(build.job.d, item.needJobClass)) {
        continue;
      }
      itemFactory.initItem(item);
      
      var addItem = true;
      for(var d=0;d<datas.length;++d) {
        if(!datas[d].def.matchesItem || datas[d].def.matchesItem(datas[d].value.id, item)) {
          if('sortFunc' in datas[d].def) {
            sortFunc = datas[d].def.sortFunc;
            sortId = datas[d].value.id;
          }
        }
        else {
          addItem = false;
          break;
        }
      }
      
      if(addItem) {
        retVal.push(item);
      }
      
      if(retVal.length >= maxItems) {
        break;
      }
    }

    retVal = retVal.sort(function(item1, item2) {
      if(sortFunc) {
        return sortFunc(sortId, item1, item2);
      }
      else {
        return item1.name.localeCompare(item2.name);
      }
    });
    
    return retVal;
  }

  function filterDuplicates(items) {

    var retVal = [];
    for(var i=0;i<items.length;++i) {
        var found = false;
        for(var j=0;j<retVal.length;++j) {
            if(areSameItem(items[i], retVal[j])) {
                found = true;
                break;
            }
        }

        if(!found) {
            retVal.push(items[i]);
        }
    }

    return retVal;
  }

  function areSameItem(item1, item2) {
      if(item1.stats.length !== item2.stats.length || item1.rank != item2.rank || item1.levelLimit != item1.levelLimit || item1.name !== item2.name) {
          return false;
      }

      for(var i=0;i<item1.stats.length;++i) {
        if(item1.stats[i].id != item2.stats[i].id) {
          return false;
        }
        if(item1.stats[i].max != item2.stats[i].max) {
          return false;
        }
      }
      return true;
  }
}
