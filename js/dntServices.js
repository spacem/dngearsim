var m = angular.module('dntServices', ['translationService','ngRoute','valueServices']);
m.factory('dntInit',
['equipment','plates','talisman','techs','rebootEquipment','wellspring','gems','cash','cash2014','cash2015','jobs','enchantment',
function(equipment,plates,talisman,techs,rebootEquipment,wellspring,gems,cash,cash2014,cash2015,jobs,enchantment) {
  return function(progress) {
    
    progress('starting init');
    
    var allFactories = [equipment,plates,talisman,techs,rebootEquipment,wellspring,gems,cash,cash2014,cash2015,jobs,enchantment];
    
    function initFactory(index) {
    
      if(index < allFactories.length) {
        allFactories[index].init(progress, function() { 
          if(allFactories[index].isLoaded()) {
            progress('dnt loaded: ' + allFactories[index].fileName);
            initFactory(index+1);
          }
        });
      }
      else {
        progress('All data initialised successfully');
      }
    }
    
    initFactory(0);
  }
}]);
m.factory('dntReset',
['equipment','plates','talisman','techs','rebootEquipment','jobs','enchantment','wellspring','gems','cash','cash2014','cash2015',
function(equipment,plates,talisman,techs,rebootEquipment,jobs,enchantment,wellspring,gems,cash,cash2014,cash2015) {
  return function(progress) {
    
    progress('resetting loaded data');
    var allFactories = [equipment,plates,talisman,techs,rebootEquipment,wellspring,gems,cash,cash2014,cash2015,jobs,enchantment];
    angular.forEach(allFactories, function(value, key) {
      value.resetLoader();
      });
  }
}]);
m.factory('getAllItems',
['equipment','plates','talisman','techs','rebootEquipment','wellspring','gems','cash','cash2014','cash2015',
function(equipment,plates,talisman,techs,rebootEquipment,wellspring,gems,cash,cash2014,cash2015) {
    
  return function(factories) {
    
    var allItems = [];
    
    angular.forEach(factories, function(value, key) {
      if(value.isLoaded()) {
        allItems = allItems.concat(value.getItems());
      }
      });
    return allItems;
  }
}]);
m.factory('dntLoader', ['$routeParams',function($routeParams) {
  
  var createdLoaders = [];
  
  return {
    create : function(file) {
      
      var completeCallback = null;
      var progressCallback = null;
      
      var loader = {
        reader : new DntReader(),
        
        loaded : false,
        startedLoading : false,
        
        file : file,
        
        init : function(progress, complete) {
          
          if(this.loaded) {
            complete();
          }
          else {
            progressCallback = progress;
            completeCallback = complete;
            
            if(!this.startedLoading) {
              this.startedLoading = true;
              var t = this;
              
              this.reader.loadDntFromServerFile(
                $routeParams['location'] + '/' + file,
                function(msg) { progressCallback(msg) }, 
                function() {
                  console.info('dnt loading complete : ' + file);
                  t.loaded = true;
                  completeCallback();
                },
                function(msg) { progressCallback(msg) }  );
            }
          }
        },
        
        findRowNumById : function(id) {
          for(var r=0;r<this.reader.numRows;++r) {
            if(this.reader.data[r]['id'] == id) {
              return r;
            }
          }
          
          return null;
        },
        
        reset : function() {
          this.reader = new DntReader();
          this.loaded = false;
          this.startedLoading = false;
        }
      }
    
      createdLoaders.push(loader);
      return loader;
    },
  
    resetAll : function() {
      angular.forEach(createdLoaders, function(value, key) {
        value.reset();
      });
    },
    
    initAll : function(progress) {
      this.resetAll();
      
      var allLoaders = 
      
      angular.forEach(createdLoaders, function(value, key) {
        progress('init: ' + value.file);
        value.init(progress, function() { 'completed loading ' + value.file });
      });
    }
  }
}]);
m.factory('buildItemFactory', 
['$routeParams','translations','dntLoader','hCodeValues',
function($routeParams,translations,dntLoader,hCodeValues) {

  function build(d) {    
    return {
      name : translations.translate(d['NameIDParam']).replace(/\{|\}/g,'').replace(/\,/g,' '),
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
      var equip = build(data[r]);
      items.push(equip);
    }
    
    return items;
  }
  
  return function(fileName, type) {
    return {

      type: type,

      loader : dntLoader.create(fileName),
      items : null,
      fileName : fileName,
      isLoaded : function() {
        return this.items != null || this.loader.loaded;
      },

      init : function(progress, complete) {
        if(this.items == null) {
          var t = this;
          this.loader.init(progress, function() {
            t.items = getItems(t.loader.reader.data);
            t.loader = dntLoader.create(fileName);
            complete();
          });
        }
        else {
          complete();
        }
      },
      
      resetLoader : function() {
        this.items = null;
        this.loader.reset();
        this.loader = dntLoader.create(fileName);
      },

      getItems : function () {
        return this.items;
      }
    }
  }
}]);
m.factory('plates', ['buildItemFactory', function(buildItemFactory) {
  return buildItemFactory('itemtable_glyph.dnt', 'plates');
}]);
m.factory('talisman', ['buildItemFactory', function(buildItemFactory) {
  return buildItemFactory('itemtable_talisman.dnt', 'talisman');
}]);
m.factory('techs', ['buildItemFactory', function(buildItemFactory) {
  return buildItemFactory('itemtable_skilllevelup.dnt', 'techs');
}]);
m.factory('rebootEquipment', ['buildItemFactory', function(buildItemFactory) {
  return buildItemFactory('itemtable_reboot.dnt', 'equipment');
}]);
m.factory('equipment', ['buildItemFactory', function(buildItemFactory) {
  return buildItemFactory('itemtable_equipment.dnt', 'equipment');
}]);



m.factory('cash2015', ['buildItemFactory', function(buildItemFactory) {
  return buildItemFactory('itemtable_common2015.dnt', 'cash');
}]);
m.factory('cash2014', ['buildItemFactory', function(buildItemFactory) {
  return buildItemFactory('itemtable_common2014.dnt', 'cash');
}]);
m.factory('cash', ['buildItemFactory', function(buildItemFactory) {
  return buildItemFactory('itemtable_cash.dnt', 'cash');
}]);
m.factory('gems', ['buildItemFactory', function(buildItemFactory) {
  return buildItemFactory('itemtable_dragonjewel.dnt', 'gems');
}]);
m.factory('wellspring', ['buildItemFactory', function(buildItemFactory) {
  return buildItemFactory('itemtable_source.dnt', 'wellspring');
}]);


m.factory('enchantment', ['dntLoader', 'hCodeValues', function(dntLoader, hCodeValues) {
  var fileName ='enchanttable.dnt'; 
  var rFileName ='enchanttable_reboot.dnt'; 

  
  function initEnchantments(data) {
    var enhancements = [];
    var numRows = data.length;
    for(var r=0;r<numRows;++r) {
      var d = data[r];
      
      var enchantId = d['EnchantID'];
      
      if(enhancements[enchantId] == null) {
        enhancements[enchantId] = [];
      }
      
      enhancements[enchantId].push({
        data : d,
        stats : null,
        initStats : function() {
          if(this.stats == null) {
            this.stats = hCodeValues.getStats(d);
          }
        }
      });
    }
    
    return enhancements;
  }
  
  function loaderComplete(item, complete) {
    if(item.isLoaded()) {
      item.values = initEnchantments(item.loader.reader.data);
      item.rValues = initEnchantments(item.rLoader.reader.data);
      item.loader = dntLoader.create(fileName);
      item.rLoader = dntLoader.create(rFileName);
      complete();
    }
  }

  return {
    
    fileName : fileName,
    rFileName : rFileName,
  
    loader : dntLoader.create(fileName),
    rLoader : dntLoader.create(rFileName),
    
    values : null,
    rValues : null,
    
    isLoaded : function() {
      return (this.loader.loaded && this.rLoader.loaded) || this.values != null || this.rValues != null;
    },
    
    init : function(progress, complete) {
      if(!this.isLoaded()) {
        var t = this;
        if(!this.loader.startedLoading) {
          this.loader.init(progress, function() { loaderComplete(t, complete) });
        }
        if(!this.rLoader.startedLoading) {
          this.rLoader.init(progress, function() { loaderComplete(t, complete) });
        }
      }
      else {
        complete();
      }
    },
      
    resetLoader : function() {
      this.values = null;
      this.rValues = null;
      this.loader.reset();
      this.loader = dntLoader.create(fileName);
      this.rLoader.reset();
      this.rLoader = dntLoader.create(rFileName);
    },
  }
}
]);
m.factory('jobs', ['dntLoader', 'translations', function(dntLoader, translations) {
  
  var fileName ='jobtable.dnt'; 
  return {
    fileName : fileName,
  
    loader : dntLoader.create(fileName),
    
    isLoaded : function() {
      return this.loader.loaded;
    },
    
    init : function(progress, complete) {
      this.loader.init(progress, function() {
        complete();
        });
    },
      
    resetLoader : function() {
      this.loader.reset();
    },
    
    getFinalJobs : function () {
      var jobs = [];
      var numRows = this.loader.reader.numRows;
      for(var r=0;r<numRows;++r) {
        var d = this.loader.reader.data[r];
        if(d['JobNumber'] == 2) {
          jobs[jobs.length] = this.createJob(r);
        }
      }
      
      return jobs;
    },
    
    getAllJobs : function () {
      var jobs = [];
      var numRows = this.loader.reader.numRows;
      for(var r=0;r<numRows;++r) {
        jobs[jobs.length] = this.createJob(r);
      }
      
      return jobs;
    },
    
    createJob : function(r) {
      
      var d = this.loader.reader.data[r];
      var t = this;
      return {
          id : this.getJobId(r),
          name : translations.translate(this.getJobName(r)),
          isClassJob : function(c) {
            return t.isClassJob2(r, c);
          }
        };
    },
    
    getJobId : function (r) {
      return this.loader.reader.data[r]['id'];
    },
    
    getJobName : function (r) {
      return this.loader.reader.data[r]['JobName'];
    },
    
    isClassJob2 : function (r, c) {
      if(this.loader.reader.data[r]['id'] == c) {
        return true;
      }
      
      var parentJob = this.loader.reader.data[r]['ParentJob'];
      
      if(parentJob == c) return true;
      if(c == 0) return true;

      var numRows = this.loader.reader.numRows;
      for(var r2=0;r2<numRows;++r2) {
        var d = this.loader.reader.data[r2];
        if(d.id == parentJob) {
          return this.isClassJob2(r2, c);
        }
      }
    }
  }
  
}]);