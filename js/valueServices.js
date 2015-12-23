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
      0 : { name : 'normal', checked: true },
      1 : { name : 'magic', checked: true },
      2 : { name : 'rare', checked: true },
      3 : { name : 'epic', checked: true },
      4 : { name : 'unique', checked: true },
      5 : { name : 'legendary', checked: true },
    },
    
    typeNames : {
      0 : 'weapon',
      1 : 'equipment',
      5 : 'plate',
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

          var stat =this.stats[stateId];
          var name = stateId;
          if(stat != null) {
            name = stat.name;
          }
          var currentData = {
            stat : stat,
            name: name,
            num: stateId,
            getDisplay : function() {
              if(this.stat != null && this.stat.display != null) {
                return this.stat.display(this);
              }
              else {
                return this.max;
              }
            }
          };

          if(currentData.name == null) {
            currentData.name = stateId;
          }
        
          var prop;
          prop = 'State' + currentState + '_Min';
          if(prop in data) {
            currentData.min = data[prop];
          }
        
          prop = 'State' + currentState + '_Max';
          if(prop in data) {
            currentData.max = data[prop];
          }
          
          prop = 'State' + currentState + 'Value';
          if(prop in data) {
            currentData.min = data[prop];
            currentData.max = data[prop];
          }
          
          prop = 'StateValue' + currentState;
          if(prop in data) {
            currentData.min = data[prop];
            currentData.max = data[prop];
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

          currentState++;
          statVals.push(currentData);
        }
        else {
          break;
        }
      }
      
      return statVals;
    }
  }
}]);