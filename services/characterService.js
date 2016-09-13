(function () {
'use strict';

angular.module('dnsim').factory('character',['dntData','itemColumnsToLoad','jobs','hCodeValues',character]);
function character(dntData,itemColumnsToLoad,jobs,hCodeValues) {

  var jobConversions = 'rebootplayerweighttable.lzjson';
  var statCaps = 'playercommonleveltable.lzjson';
  var jobBaseStats = 'playerleveltable.lzjson';

  var heroLevels = 'heroleveltable.lzjson';
  var heroLevelPotentials = 'potentialtable_herolevel.lzjson';
  
  function reportProgress(msg) {
    // console.log('progress: ' + msg);
  }

  return {
    init: function(complete) {
      jobs.init(reportProgress, complete);
      dntData.init(jobConversions, itemColumnsToLoad.jobConversionColsToLoad, reportProgress, complete);
      dntData.init(statCaps, itemColumnsToLoad.statCapColsToLoad, reportProgress, complete);
      dntData.init(jobBaseStats, itemColumnsToLoad.jobBaseStatColsToLoad, reportProgress, complete);
      dntData.init(heroLevels, null, reportProgress, complete);
      dntData.init(heroLevelPotentials, null, reportProgress, complete);
    },
    
    getHeroStats: function(heroLevel) {
      var heroStats = [];
      if(heroLevel > 0) {
        var index = dntData.findFast(heroLevels, 'id', heroLevel);
        if(index.length == 1) {
          var h = dntData.getRow(heroLevels, index[0]);
          if(h) {
            var pIndex = dntData.findFast(heroLevelPotentials, 'PotentialID', h.HeroLevelAbilityID);
            if(pIndex.length == 1) {
              var p = dntData.getRow(heroLevelPotentials, pIndex[0]);
              if(p) {
                heroStats = hCodeValues.getStats(p);
              }
            }
          }
        }
      }
      return heroStats;
    },
    
    getStatCaps: function(level) {
      if(level > 0) {
        var index = dntData.findFast(statCaps, 'id', level);
        if(index.length == 1) {
          return dntData.getRow(statCaps, index[0]);
        }
      }
      
      return {};
    },
    
    getConversions: function(jobId) {
      if(jobId > 0) {
        var index = dntData.findFast(jobConversions, 'id', jobId);
        if(index.length == 1) {
          return dntData.getRow(jobConversions, index[0]);
        }
      }
      
      return {};
    },
    
    getBaseStats: function(level, jobId) {
      if(level > 0 && jobId > 0) {
        var index = dntData.findFast(jobBaseStats, 'id', (Number(jobId) * 100) + Number(level) - 100);
        if(index.length == 1) {
          return dntData.getRow(jobBaseStats, index[0]);
        }
      }
      
      return {};
    }
  }
}

})();