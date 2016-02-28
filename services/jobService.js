var m = angular.module('jobService', ['translationService','ngRoute','valueServices','itemService','dntServices']);
'use strict';

m.factory('jobs', ['dntData', 'translations', 'itemColumnsToLoad', function(dntData, translations, itemColumnsToLoad) {
  
  var fileName ='jobtable.lzjson';
  var colsToLoad = itemColumnsToLoad.jobsDnt;
  
  return {
    fileName : fileName,
    allJobs : null,
    
    isLoaded : function() {
      return dntData.isLoaded(fileName);
    },
    
    hasStartedLoading: function() {
      return dntData.hasStartedLoading(fileName);
    },
    
    init : function(progress, complete) {
      dntData.init(fileName, colsToLoad, progress, function() {
        complete();
        });
    },

    reset : function() {
      this.allJobs = null;
      dntData.reset(fileName);
    },
    
    getFinalJobs : function () {
      var jobs = [];
      var alljobs = this.getAllJobs();
      var numRows = alljobs.length;
      for(var r=0;r<numRows;++r) {
        if(alljobs[r].d.JobNumber == 2 && alljobs[r].d.JobIcon > 0) {
          jobs.push(alljobs[r]);
        }
      }
      
      return jobs;
    },
    
    getBaseJobs : function () {
      var retVal=[];
      var baseJobs = {};

      var self = this;
      angular.forEach(this.getFinalJobs(), function(job, key) {
        baseJobs[self.getBaseJobName(job)] = job;
      });

      angular.forEach(baseJobs, function(job, jobName) {
        retVal.push(jobName);
      });

      return retVal;
    },
    
    getAllJobs : function () {
      if(this.allJobs == null && this.isLoaded()) {
        var jobs = [];
        var data = dntData.getData(fileName);
        var numRows = data.length;
        for(var r=0;r<numRows;++r) {
          jobs[jobs.length] = this.createJob(data[r]);
        }
        
        this.allJobs = jobs;
      }
      return this.allJobs;
    },
    
    createJob : function(d) {
      var t = this;
      return {
          d : d,
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

      var parentJobData = dntData.find(fileName, 'id', parentJob);
      var numRows = parentJobData.length;
      for(var r2=0;r2<numRows;++r2) {
        return this.isClassJob2(parentJobData[r2], c);
      }
    },
    
    getBaseJobName : function(job) {
      if(this.isLoaded()) {
        var alljobs = this.getAllJobs();
        if(alljobs != null) {
          var numRows = alljobs.length;
          for(var r=0;r<numRows;++r) {
            if(alljobs[r].id == (job.d.BaseClass+1) && alljobs[r].d.EnglishName) {
              return alljobs[r].d.EnglishName;
            }
          }
        }
      }
      
      return null;
    },
    
    findJobById : function(id) {
      var allJobs = this.getAllJobs();
      var foundJob = null;
      angular.forEach(allJobs, function(job, index) {
        if(job.id == id) {
          foundJob = job;
          return;
        }
      });
      
      return foundJob;
    }
  }
  
}]);