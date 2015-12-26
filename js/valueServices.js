var m = angular.module('valueServices', []);
m.factory('hCodeValues', [function() {
  
  function toOneDec(stat) {
    return Math.round(stat.max*10)/10;
  }
  function toPercent(stat) {
    return (Math.round(stat.max*1000)/10) + '%';
  }
  
  return {
    stats : {
      0  : {name: 'str', display: toOneDec },
      1  : {name: 'agi', display: toOneDec },
      2  : {name: 'int', display: toOneDec },
      3  : {name: 'vit', display: toOneDec },
      4  : {name: 'minPdmg', display: toOneDec },
      5  : {name: 'maxPdmg', display: toOneDec },
      6  : {name: 'minMdmg', display: toOneDec },
      7  : {name: 'maxMdmg', display: toOneDec },
      8  : {name: 'def', display: toOneDec },
      9  : {name: 'mdef', display: toOneDec },
      10 : {name: 'para', display: toOneDec },
      10 : {name: 'para resist', display: toOneDec },
      12 : {name: 'crit', display: toOneDec },
      13 : {name: 'crit resist', display: toOneDec },
      15 : {name: 'stun resist', display: toOneDec },
      16 : {name: 'fire%', display: toPercent },
      17 : {name: 'ice%', display: toPercent },
      18 : {name: 'light%', display: toPercent },
      19 : {name: 'dark%', display: toPercent },
      20 : {name: 'fire def%', display: toPercent },
      21 : {name: 'ice def%', display: toPercent },
      25 : {name: 'hp', display: toOneDec },
      29 : {name: 'fd', display: toOneDec },
      50 : {name: 'str%', display: toPercent },
      51 : {name: 'agi%', display: toPercent },
      52 : {name: 'int%', display: toPercent },
      53 : {name: 'vit%', display: toPercent },
      54 : {name: 'minPdmg%', display: toPercent },
      55 : {name: 'maxPdmg%', display: toPercent },
      56 : {name: 'minMdmg%', display: toPercent },
      57 : {name: 'maxMdmg%', display: toPercent },
      58 : {name: 'def%', display: toPercent },
      59 : {name: 'mdef%', display: toPercent },
      60 : {name: 'para%', display: toPercent },
      62 : {name: 'crit%', display: toPercent },
      74 : {name: 'move%', display: toPercent },
      75 : {name: 'hp%', display: toPercent },
      77 : {name: 'mp recover%', display: toPercent },
      81 : {name: 'safe move%', display: toPercent },
      103: {name: 'crit dmg', display: toOneDec },
      104: {name: 'crit dmg%', display: toPercent },
      107: {name: 'mp', display: toOneDec },
    },
  
    rankNames : {
      0 : { id: 0, name : 'normal', checked: true },
      1 : { id: 1, name : 'magic', checked: true },
      2 : { id: 2, name : 'rare', checked: true },
      3 : { id: 3, name : 'epic', checked: true },
      4 : { id: 4, name : 'unique', checked: true },
      5 : { id: 5, name : 'legendary', checked: true },
    },
    
    typeNames : {
      0 : 'weapon',
      1 : 'equipment',
      5 : 'plate',
      8 : 'pouch',
      38 : 'enhancement',
      90 : 'welspring',
      132 : 'talisman',
      139 : 'gem',
    },
  
    getStats : function(data) {
      var currentState = 1;
      var statVals = []
      for(;;) {
        
        var stateProp = 'State' + currentState;
        if(stateProp in data) {
          
          var stateId = data[stateProp];
          if(stateId == -1) {
            break;
          }
          
          var currentData = {};
          
          var prop;
        
          prop = 'State' + currentState + '_Max';
          if(prop in data) {
            currentData.max = data[prop];
          }
          
          prop = 'State' + currentState + 'Value';
          if(prop in data) {
            currentData.max = data[prop];
          }
          
          prop = 'StateValue' + currentState;
          if(prop in data) {
            currentData.max = Number(data[prop]);
          }
          
          prop = 'State' + currentState + '_Min';
          if(prop in data && currentData.max != data[prop]) {
            currentData.min = Number(data[prop]);
          }
          
          prop = 'State' + currentState + '_GenProb';
          if(prop in data) {
            currentData.genProb = data[prop];
          }
          
          prop = 'NeedSetNum' + currentState;
          if(prop in data) {
            if(data[prop] == 0) {
              break;
            }
            currentData.needSetNum = data[prop];
          }
          
          this.setupStat(currentData, stateId);

          currentState++;
          
          if(currentData.num != 0 ||
            currentData.max != 0 ||
            currentData.min != 0) {
              
            statVals.push(currentData);
          }
        }
        else {
          break;
        }
      }
      
      return statVals;
    },
    
    setupStat : function(stat, id) {
      stat.id = id;
      var statDef = this.stats[id];
      if(statDef != null) {
        stat.name = statDef.name;
        stat.displayValue = statDef.display(stat);
      }
      else {
        stat.name = id;
        stat.displayValue = stat.max;
      }
    },
    
    mergeStats : function(stats1, stats2) {
      var statMap = {};
      
      
      angular.forEach(stats1, function(value, key) {
        if(value.id in statMap) {
          statMap[value.id] += Number(value.max);
        }
        else {
          statMap[value.id] = Number(value.max);
        }
      });
      
      angular.forEach(stats2, function(value, key) {
        if(value.id in statMap) {
          statMap[value.id] += Number(value.max);
        }
        else {
          statMap[value.id] = Number(value.max);
        }
      });
      
      var newStats = [];
      
      for(var key in statMap) {
        var stat = { max : statMap[key] };
        this.setupStat(stat, key);
        newStats.push(stat);
      }
        
      return newStats;
    }
  }
}]);