// tests for value service
//
describe('valueServices', function () {
    
  var hCodeValues;
  beforeEach(function() {
    module('valueServices');
  });
  
  beforeEach(inject(function($injector) {
    hCodeValues = $injector.get('hCodeValues');
  }));
  
  beforeEach(function() {
    jasmine.addMatchers({
      
      equalsStat: function( util, customEqualityTesters) {
        return {
          compare: function(actual, expected) {
            return {
              pass: actual !== null && expected !== null &&
              expected.id === actual.id && expected.max === actual.max,
              message: 'expected: ' + JSON.stringify(expected) + ' got: ' + JSON.stringify(actual)
            };
          }
  
        }
      }
    });
  });
  
  // helper methods
  //
  
  function createStat() {
    return { id: 1, max: 42 };
  }
  
  function createStat2() {
    return { id: 2, max: 11 };
  }
  
  // tests
  //


  it('gives empty stats from empty stats', function() {
    var mergedStats = hCodeValues.mergeStats([], []);
    expect(mergedStats.length).toBe(0);
  });
  
  it('gives single stat from one on lhs', function() {
    var mergedStats = hCodeValues.mergeStats([createStat()], []);
    expect(mergedStats.length).toBe(1);
    expect(mergedStats[0]).equalsStat(createStat());
  });
  
  it('gives single stat from one on rhs', function() {
    var mergedStats = hCodeValues.mergeStats([], [createStat()]);
    expect(mergedStats.length).toBe(1);
    expect(mergedStats[0]).equalsStat(createStat());
  });
  
  it('adds same stats together', function() {
    var mergedStats = hCodeValues.mergeStats([createStat()], [createStat()]);
    expect(mergedStats.length).toBe(1);
    expect(mergedStats[0]).equalsStat({ id: createStat().id, max: createStat().max * 2 });
  });
  
  it('adds different stats to the list', function() {
    var mergedStats = hCodeValues.mergeStats([createStat()], [createStat2()]);
    
    expect(mergedStats.length).toBe(2, 'length');
    
    var stat1Found = false;
    var stat2Found = false;
    angular.forEach(mergedStats, function(stat, index) {
      if(stat.id == createStat().id) {
        expect(stat).equalsStat(createStat());
        stat1Found = true;
      }
      else if(stat.id == createStat2().id) {
        expect(stat).equalsStat(createStat2());
        stat2Found = true;
      }
    });
      
    console.log(JSON.stringify(mergedStats));
    
    expect(stat1Found).toBe(true, 'stat one found');
    expect(stat2Found).toBe(true, 'stat two found');
  });
});