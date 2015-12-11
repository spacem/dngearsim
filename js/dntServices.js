var m = angular.module('dntServices', ['translationService']);
m.factory('dntLoader', [function() {
  return {
    create : function(file) {
      var location = localStorage.getItem('location');
      
      var completeCallback = null;
      var progressCallback = null;
      
      return {
        reader : new DntReader(),
        
        loaded : false,
        startedLoading : false,
        
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
                location + '/' + file,
                function(msg) { progressCallback(msg) }, 
                function() {
                  console.info('dnt loading complete : ' + file);
                  t.loaded = true;
                  completeCallback();
                } );
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
        }
    }
  }
}
}]);
m.factory('equipment', ['dntLoader', 'translations', function(dntLoader, translations) {
  var file = 'itemtable_equipment.dnt';
  
  return {
    loader : dntLoader.create(file),
    
    isLoaded : function() {
      return this.loader.loaded;
    },
    
    init : function(progress, complete) {
      translations.init(progress, complete);
      this.loader.init(progress, complete);
    },
    
    getEquipment : function () {
      var equips = [];
      
      var numRows = this.loader.reader.numRows;
      for(var r=0;r<numRows;++r) {
        var d = this.loader.reader.data[r];
        var equip = {
          name : translations.translate(d['NameIDParam']).replace(/\{|\}/g,'').replace(/\,/g,' '),
          levelLimit : d['LevelLimit'],
          enchantId : d['EnchantId'],
          needJobClass : d['NeedJobClass'],
          rank : d['Rank'],
        };
        equips.push(equip);
      }
      
      return equips;
    }
  }
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