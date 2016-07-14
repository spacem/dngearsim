describe('statHelper', function () {
  dnsimTestSetup();
  
  var statHelper;
  beforeEach(inject(function($injector) {
    statHelper = $injector.get('statHelper');
  }));
  
  var group = {
    conversions: {
      PhysicalDefense: 200,
      MagicDefense: 300,
      HP: 40,
      StrengthAttack: 0.2,
      AgilityAttack: 0.3,
      IntelligenceAttack: 0.4,
      Critical: 0.5,
      StrengthIntelligenceToCriticalDamage: 2,
    },
    enemyStatCaps: {
      Cdefense: 8000,
      Ccritical: 1234,
    }
  }
  
  it('calculates basic stats with percents', function() {
    
    var strStat = {id: 0, max: 12};
    var strPcStat = {id: 50, max: 0.7};
    var cStats = statHelper.getCalculatedStats(group, [strStat, strPcStat]);
    expect(cStats.length > 0).toBe(true);
    
    var cStrStat = null;
    var cAgiStat = null;
    angular.forEach(cStats, function(stat, index) {
      if(stat.id == 0) {
        cStrStat = stat;
      }
    });
    
    expect(cStrStat.id).toBe(0);
    expect(cStrStat.max).toBe(Math.floor(12 + (12 * 0.7)));
  });
  
  it('adds element even when not in group', function() {
    
    var lightStat = {id: 18, max: 1.2};
    group.element = { id: 0, name: 'not elemental' };
    var cStats = statHelper.getCalculatedStats(group, [lightStat]);
    expect(cStats.length > 0).toBe(true);
    
    var cFireStat = null;
    var cIceStat = null;
    var cLightStat = null;
    var cDarkStat = null;
    angular.forEach(cStats, function(stat, index) {
      if(stat.id == 16) {
        cFireStat = stat;
      }
      if(stat.id == 17) {
        cIceStat = stat;
      }
      if(stat.id == 18) {
        cLightStat = stat;
      }
      if(stat.id == 19) {
        cDarkStat = stat;
      }
    });
    
    expect(cFireStat).toBe(null);
    expect(cIceStat).toBe(null);
    expect(cDarkStat).toBe(null);
    
    expect(cLightStat.id).toBe(18);
    expect(cLightStat.max).toBe(1.2);
    
  });
  
  it('adds element when in group', function() {
    
    var lightStat = {id: 18, max: 1.2};
    group.element = { id: 3, name: 'light', dmgStat: 18 };
    var cStats = statHelper.getCalculatedStats(group, [lightStat]);
    expect(cStats.length > 0).toBe(true);
    
    var cFireStat = null;
    var cIceStat = null;
    var cLightStat = null;
    var cDarkStat = null;
    angular.forEach(cStats, function(stat, index) {
      if(stat.id == 16) {
        cFireStat = stat;
      }
      if(stat.id == 17) {
        cIceStat = stat;
      }
      if(stat.id == 18) {
        cLightStat = stat;
      }
      if(stat.id == 19) {
        cDarkStat = stat;
      }
    });
    
    group.element = 3;
    expect(cFireStat).toBe(null);
    expect(cIceStat).toBe(null);
    expect(cDarkStat).toBe(null);
    
    expect(cLightStat.id).toBe(18);
    expect(cLightStat.max).toBe(1.2);
  });
});
