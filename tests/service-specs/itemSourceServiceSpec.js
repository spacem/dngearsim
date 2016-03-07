describe('items', function () {
  dnsimTestSetup();
  
  var mockTranslation = {
    initCalled: false,
    isLoaded: function() {
      return false;
    },
    init: function(progress, complete) {
      this.initCalled = true;
    }
  };
  
  var mockDntData = {
    initCalled: {},
    isLoaded: function(dntName) {
      return false;
    },
    init: function(dntName, colsToLoad, progress, complete) {
      console.log('init: ' + dntName);
      this.initCalled[dntName] = true;
    }
  };
  
  var items;
  beforeEach(function() {
    mockTranslation.initCalled = false;
    mockDntData.initCalled = {};

    module(function($provide) {
      $provide.value('translations', mockTranslation);
      $provide.value('dntData', mockDntData);
    });
  
    inject(function($injector) {
      items = $injector.get('items');
    });
  });
  
  it('contains eq source with eq name', function() {
    expect(items.eq.name).toBe('eq');
  });
  
  it('contains eq source with expected dnts', function() {
    expect(items.eq.mainDnt).toBe('itemtable_equipment.optimised.lzjson');
    expect(items.eq.partsDnt).toBe('partstable_equipment.optimised.lzjson');
    expect(items.eq.weaponDnt).toBe('weapontable_equipment.optimised.lzjson');
    expect(items.eq.enchantDnt).toBe('enchanttable.optimised.lzjson');
    expect(items.eq.potentialDnt).toBe('potentialtable.optimised.lzjson');
    expect(items.eq.sparkDnt).toBe('potentialtable_potentialjewel.optimised.lzjson');
    expect(items.eq.setDnt).toBe('setitemtable.optimised.lzjson');
  });
  
  it('initialises translations', function() {
    items.eq.init(function() {}, function() {});
    expect(mockTranslation.initCalled).toBe(true);
  });
  
  it('initialises item dnts', function() {
    items.eq.init(function() {}, function() {});
    expect(mockDntData.initCalled['itemtable_equipment.optimised.lzjson']).toBe(true);
    expect(mockDntData.initCalled['potentialtable.optimised.lzjson']).toBe(true);
  });
  
  it('does not initialise other dnts', function() {
    expect('partstable_equipment.optimised.lzjson' in mockDntData.initCalled).toEqual(false);
    expect('weapontable_equipment.optimised.lzjson' in mockDntData.initCalled).toEqual(false);
    expect('enchanttable.optimised.lzjson' in mockDntData.initCalled).toEqual(false);
    expect('potentialtable_potentialjewel.optimised.lzjson' in mockDntData.initCalled).toEqual(false);
    expect('setitemtable.optimised.lzjson' in mockDntData.initCalled).toEqual(false);
  });
});
