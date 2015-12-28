var m = angular.module('dntServices', ['translationService','ngRoute','valueServices','itemService']);

m.factory('dntInit',
['items','jobs','dntData','initItem',
function(items,jobs,dntData,initItem) {
  return function(progress) {
    
    progress('starting init');
    
    var allFactories = [jobs].concat(items.all);
    
    var dntFiles = {};
    angular.forEach(items, function(item, key) {
      if(key != 'all') {
        angular.forEach(item, function(value, prop) {
          if(prop.indexOf('Dnt') == prop.length-3) {
            dntFiles[value] = { 
              init: function(progress, complete) {
                dntData.init(value, null, progress, complete);
              },
              isLoaded: function() {
                return dntData.isLoaded(value);
              },
              fileName: value,
            };
          }
        });
      }
    });
    
    angular.forEach(dntFiles, function(value, key) {
      allFactories.push(value);
    });
    
    function initFactory(index) {
    
      if(index < allFactories.length) {
        allFactories[index].init(progress, function() { 
          if(allFactories[index].isLoaded()) {
            if('fileName' in allFactories[index]) {
              progress('dnt loaded: ' + allFactories[index].fileName);
            }
            else {
              
              var loadedItems = allFactories[index].getItems();
              angular.forEach(loadedItems, function(value, key) {
                initItem(value);
              });
              
              progress('initialised ' + loadedItems.length + ' items from: ' + allFactories[index].mainDnt);
            }
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
['items','jobs','dntData',
function(items, jobs,dntData) {
  return function(progress) {
    
    progress('resetting loaded data');
    var allFactories = [jobs].concat(items.all);
    angular.forEach(allFactories, function(value, key) {
      value.resetLoader();
      });
      
      dntData.resetAll();
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
  
  function createLoader(file, colsToLoad) {
      
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
            
            this.reader.colsToLoad = colsToLoad;
            this.reader.loadDntFromServerFile(
              $routeParams['location'] + '/' + file,
              function(msg) { if(progressCallback != null) progressCallback(msg) }, 
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
    findIndexes : {},
    
    init : function (fileName, colsToLoad, progress, complete) {
      if(!(fileName in this.loaders)) {
        this.loaders[fileName] = createLoader(fileName, colsToLoad);
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
    find : function(fileName, column, value) {
      if(this.isLoaded(fileName)) {
        if(!(fileName in this.findIndexes)){
          this.findIndexes[fileName] = {};
        }
        
        if(!(column in this.findIndexes[fileName])) {
          var index = {}
          this.findIndexes[fileName][column] = index;
          
          var results = [];
          
          var data = this.loaders[fileName].reader.data;
          var len = data.length;
          for(var r=0;r<len;++r) {
            var d = data[r];
            var val = d[column];

            if(!(val in index)) {
              index[val] = [d];
            }
            else {
              index[val].push(d);
            }
          }
        }
        
        if(value in this.findIndexes[fileName][column]) {
          return this.findIndexes[fileName][column][value];
        }
        else {
          return [];
        }
      }
      
      return [];
    },
    isLoaded : function(fileName) {
      return fileName in this.loaders && this.loaders[fileName].loaded;
    },
    hasStartedLoading : function(fileName) {
      return this.isLoaded(fileName) || (fileName in this.loaders && this.loaders[fileName].startedLoading);
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


m.factory('jobs', ['dntData', 'translations', function(dntData, translations) {
  
  var fileName ='jobtable.dnt';
  var colsToLoad = {
        JobName: true,JobNumber: true,BaseClass: true,ParentJob: true
  };
  
  return {
    fileName : fileName,
    
    isLoaded : function() {
      return dntData.isLoaded(fileName);
    },
    
    init : function(progress, complete) {
      dntData.init(fileName, colsToLoad, progress, function() {
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