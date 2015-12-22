var m = angular.module('dntServices', ['translationService','ngRoute','valueServices','itemService']);

m.factory('dntInit',
['items','jobs','enchantment',
function(items,jobs,enchantment) {
  return function(progress) {
    
    progress('starting init');
    
    var allFactories = [jobs,enchantment].concat(items.all);
    
    function initFactory(index) {
    
      if(index < allFactories.length) {
        allFactories[index].init(progress, function() { 
          if(allFactories[index].isLoaded()) {
            progress('dnt loaded: ' + allFactories[index].mainDnt);
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
['items','jobs','enchantment',
function(items, jobs,enchantment) {
  return function(progress) {
    
    progress('resetting loaded data');
    var allFactories = [jobs,enchantment].concat(items.all);
    angular.forEach(allFactories, function(value, key) {
      value.resetLoader();
      });
  }
}]);
m.factory('getAllItems',
[
function() {
    
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

m.factory('dntData', ['$routeParams', function($routeParams) {
  
  function createLoader(file) {
      
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
  
    return loader;
  };
  
  return {
    loaders : {},
    
    init : function (fileName, progress, complete) {
      if(!(fileName in this.loaders)) {
        this.loaders[fileName] = createLoader(fileName);
      }
      this.loaders[fileName].init(progress, complete)
    },
    getData : function (fileName) {
      if(this.isLoaded(fileName)) {
        return this.loaders[fileName].reader.data;
      }
      else {
        return [];
      }
    },
    isLoaded : function(fileName) {
      return fileName in this.loaders && this.loaders[fileName].loaded;
    },
    reset : function(fileName) {
      if(fileName in this.loaders) {
        this.loaders[fileName].reset();
      }
    },
    resetAll : function() {
      angular.forEach(this.loaders, function(value, key) {
        value.reset();
      });
    }
  };
}]);


m.factory('enchantment', ['dntData', 'hCodeValues', function(dntData, hCodeValues) {
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
          this.stats = hCodeValues.getStats(this.data);
        }
      });
    }
    
    return enhancements;
  }
  
  function loaderComplete(item, complete) {
    if(item.isLoaded()) {
      item.values = initEnchantments(dntData.getData(fileName));
      item.rValues = initEnchantments(dntData.getData(rFileName));
      complete();
    }
  }

  return {
    
    fileName : fileName,
    rFileName : rFileName,
    
    values : null,
    rValues : null,
    
    isLoaded : function() {
      return (dntData.isLoaded(fileName) && dntData.isLoaded(rFileName)) || this.values != null || this.rValues != null;
    },
    
    init : function(progress, complete) {
      if(!this.isLoaded()) {
        var t = this;
        dntData.init(fileName, progress, function() { loaderComplete(t, complete) });
        dntData.init(rFileName, progress, function() { loaderComplete(t, complete) });
      }
      else {
        complete();
      }
    },
      
    resetLoader : function() {
      this.values = null;
      this.rValues = null;
      dntData.reset(fileName);
      dntData.reset(rFileName);
    },
  }
}
]);
m.factory('jobs', ['dntData', 'translations', function(dntData, translations) {
  
  var fileName ='jobtable.dnt'; 
  return {
    fileName : fileName,
    
    isLoaded : function() {
      return dntData.isLoaded(fileName);
    },
    
    init : function(progress, complete) {
      dntData.init(fileName, progress, function() {
        complete();
        });
    },
      
    resetLoader : function() {
      dntData.reset(fileName);
    },
    
    getFinalJobs : function () {
      var jobs = [];
      var data = dntData.getData(fileName);
      var numRows = data.length;
      for(var r=0;r<numRows;++r) {
        var d = data[r];
        if(d.JobNumber == 2) {
          jobs[jobs.length] = this.createJob(d);
        }
      }
      
      return jobs;
    },
    
    getAllJobs : function () {
      var jobs = [];
      var data = dntData.getData(fileName);
      var numRows = data.length;
      for(var r=0;r<numRows;++r) {
        jobs[jobs.length] = this.createJob(data[r]);
      }
      
      return jobs;
    },
    
    createJob : function(d) {
      var t = this;
      return {
          id : d.id,
          name : translations.translate(d.JobName),
          isClassJob : function(c) {
            return t.isClassJob2(d, c);
          }
        };
    },
    
    isClassJob2 : function (d, c) {
      if(d.id == c) {
        return true;
      }
      
      var parentJob = d.ParentJob;
      
      if(parentJob == c) return true;
      if(c == 0) return true;

      var data = dntData.getData(fileName);
      var numRows = data.length;
      for(var r2=0;r2<numRows;++r2) {
        var d2 = data[r2];
        if(d2.id == parentJob) {
          return this.isClassJob2(d2, c);
        }
      }
    }
  }
  
}]);