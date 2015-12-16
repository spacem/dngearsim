var m = angular.module('valueServices', []);
m.factory('hCodeValues', [function() {
  
  return {
    stats : {
      0  : 'str',
      1  : 'agi',
      2  : 'int',
      3  : 'vit',
      4  : 'minPdmg',
      5  : 'maxPdmg',
      6  : 'minMdmg',
      7  : 'maxMdmg',
      8  : 'def',
      9  : 'mdef',
      10 : 'para',
      12 : 'crit',
      13 : 'crit resist',
      16 : 'fire%',
      18 : 'light%',
      19 : 'dark%',
      29 : 'fd',
      51 : 'agi%',
      52 : 'int%',
      53 : 'vit%',
      54 : 'minPdmg%',
      55 : 'maxPdmg%',
      56 : 'minMdmg%',
      57 : 'maxMdmg%',
      58 : 'def%',
      103: 'cdmg',
      104: 'cdmg%'
    },
  
    rankNames : {
      1 : 'normal',
      2 : 'magic',
      3 : 'epic',
      4 : 'unique',
      5 : 'legendary',
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
        else if(prop == 'State' + (currentState-1) + 'Value') {
          currentData.min = data[prop];
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
          
          currentData = {name: this.stats[stateId],num: stateId};
          if(currentData.name == null) {
            currentData.name = stateId;
          }
          
          statVals.push(currentData);
        }
      }
      
      return statVals;
    }
  }
}]);