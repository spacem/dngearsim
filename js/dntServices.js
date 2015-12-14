var m = angular.module('dntServices', ['translationService','ngRoute']);
m.factory('dntInit',
['equipment','plates','talisman','techs','rebootEquipment','jobs',
function(equipment,plates,talisman,techs,rebootEquipment,jobs) {
  return function(progress) {
    
    progress('starting init');
    
    var allFactories = [equipment,plates,talisman,techs,rebootEquipment,jobs];
    
    function initFactory(index) {
    
      if(index < allFactories.length) {
        allFactories[index].resetLoader();
        allFactories[index].init(progress, function() { 
          if(allFactories[index].isLoaded()) {
            progress('dnt loaded');
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
m.factory('getAllItems',
['equipment','plates','talisman','techs','rebootEquipment',
function(equipment,plates,talisman,techs,rebootEquipment) {
    
  return function() {
    
    var factories = [
      equipment,
      plates,
      talisman,
      techs,
      rebootEquipment
      ];

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
m.factory('buildItemFactory', ['$routeParams','translations','dntLoader',function($routeParams,translations,dntLoader) {
  var statNums = [];
  statNums[0] = 'str';
  statNums[1] = 'agi';
  statNums[2] = 'int';
  statNums[3] = 'vit';
  statNums[4] = 'minPhys';
  statNums[5] = 'maxPhys';
  statNums[6] = 'minMag';
  statNums[7] = 'maxMag';
  statNums[10] = 'para';
  statNums[12] = 'crit';
  statNums[18] = 'light%';
  statNums[19] = 'dark%';
  statNums[29] = 'fd';
  statNums[51] = 'agi%';
  statNums[52] = 'int%';
  statNums[53] = 'vit%';
  statNums[103] = 'cdmg';
  statNums[104] = 'cdmg%';
  
  function getStats(data) {
    var currentState = 1;
    var minValue = 0;
    var currentData = {};
    var statVals = []
    for(var prop in data) {
      if(prop == 'State' + (currentState-1) + '_Min') {
        currentData.min = data[prop];
      }
      else if(prop == 'State' + (currentState-1) + '_Max') {
        currentData.max = data[prop];
      }
      else if(prop == 'State' + (currentState-1) + '_GenProb') {
        currentData.genProb = data[prop];
      }
      else if(prop == 'State' + currentState) {
        currentState++;
        
        var stateId = data[prop];
        if(stateId == -1) {
          break;
        }
        
        currentData = {name: statNums[stateId],num: stateId};
        if(currentData.name == null) {
          currentData.name = stateId;
        }
        
        statVals.push(currentData);
      }
    }
    
    return statVals;
  }
  
  var rankNames = {
    1 : 'normal',
    2 : 'magic',
    3 : 'epic',
    4 : 'unique',
    5 : 'legendary',
  };
  
  var typeNames = {
    0 : 'weapon',
    1 : 'equipment',
    5 : 'plate',
    38 : 'enhancement',
    132 : 'talisman',
  }
  
  function build(d) {    
    return {
      name : translations.translate(d['NameIDParam']).replace(/\{|\}/g,'').replace(/\,/g,' '),
      levelLimit : d['LevelLimit'],
      needJobClass : d['NeedJobClass'],
      rank : d['Rank'],
      id : d['id'],
      type : d['Type'],
      getRankName : function() { return rankNames[this.rank] },
      getTypeName : function() {
        var typeName = typeNames[this.type];
        if(typeName == null) {
          return this.type;
        }
        else {
          return typeName;
        }
      },
      getEnchantments : function() {
        // TODO: lookup values in other dnt
        return d['EnchantId'];
      },
      stats : null,
      initStats : function() {
        if(this.stats == null) {
          this.stats = getStats(d);
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
  
  return function(fileName) {
    var loader = dntLoader.create(fileName);
    return {
      isLoaded : function() {
        return loader.loaded;
      },

      init : function(progress, complete) {
        loader.init(progress, complete);
      },
      
      resetLoader : function() {
        loader.reset();
      },

      getItems : function () {
        return getItems(loader.reader.data);
      }
    }
  }
}]);
m.factory('plates', ['buildItemFactory', function(buildItemFactory) {
  return buildItemFactory('itemtable_glyph.dnt');
}]);
m.factory('talisman', ['buildItemFactory', function(buildItemFactory) {
  return buildItemFactory('itemtable_talisman.dnt');
}]);
m.factory('techs', ['buildItemFactory', function(buildItemFactory) {
  return buildItemFactory('itemtable_skilllevelup.dnt');
}]);
m.factory('rebootEquipment', ['buildItemFactory', function(buildItemFactory) {
  return buildItemFactory('itemtable_reboot.dnt');
}]);
m.factory('equipment', ['buildItemFactory', function(buildItemFactory) {
  return buildItemFactory('itemtable_equipment.dnt');
}]);

m.factory('jobs', ['dntLoader', 'translations', function(dntLoader, translations) {
  var file = 'jobtable.dnt';
  
  return {
    loader : dntLoader.create(file),
    
    isLoaded : function() {
      return this.loader.loaded;
    },
    
    init : function(progress, complete) {
      translations.init(progress, complete);
      this.loader.init(progress, complete);
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