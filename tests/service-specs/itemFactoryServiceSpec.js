describe('initItem', function () {
  dnsimTestSetup();
  
  var itemFactory;
  beforeEach(function() {
    module(function($provide) {
      $provide.value('translations', {translate: function(tId) { return 'test' + tId; }});
    });
  
    inject(function($injector) {
      itemFactory = $injector.get('itemFactory');
    });
  });
  
  it('doesnt error if item alread initialised', function() {
    var item = { id: 123 };
    itemFactory.initItem(item);
    
    expect(item.id).toBe(123);
  });
  
  it('populates null with basic info from data', function() {
    var d = {
      id: 123,
      NameIDParam: 44,
      TypeParam2: 55,
      EnchantID: 66,
      LevelLimit: 90,
    };
    var item = { data: d, itemSource: 'eq' };
    itemFactory.initItem(item);
    
    expect(item.id).toBe(123);
    expect(item.name).toBe('test44');
    expect(item.sparkTypeId).toBe(55);
    expect(item.enchantmentId).toBe(66);
    expect(item.stats).toEqual([]);
    expect(item.levelLimit).toEqual(90);
  });
  
  it('populates title type', function() {
    var d = { };
    var item = { itemSource: 'title', data: d };
    itemFactory.initItem(item);
    expect(item.typeName).toBe('titles');
  });
  
  it('populates cash type', function() {
    var d = { };
    var item = { itemSource: 'cash', data: d };
    itemFactory.initItem(item);
    expect(item.typeName).toBe('cash');
  });
  
  it('populates c2014 type', function() {
    var d = { };
    var item = { itemSource: 'c2014', data: d };
    itemFactory.initItem(item);
    expect(item.typeName).toBe('cash');
  });
  
  it('populates c2015 type', function() {
    var d = { Type: 0, NameIDParam:'1234' };
    var item = { itemSource: 'c2015', data: d };
    itemFactory.initItem(item);
    expect(item.typeName).toBe('cash');
  });
  
  it('populates weapons', function() {
    var d = { Type: 0, NameIDParam:'1234' };
    var item = { itemSource: 'rbeq', data: d };
    itemFactory.initItem(item);
    expect(item.typeName).toBe('weapons');
  });
  
  it('populates armours', function() {
    var d = { Type: 1, NameIDParam:'1234' };
    var item = { itemSource: 'rbeq', data: d };
    itemFactory.initItem(item);
    expect(item.typeName).toBe('armour');
  });
  
  it('populates accessories', function() {
    var d = { Type: 1, NameIDParam:'{1234},{5678},{2227}' };
    var item = { itemSource: 'rbeq', data: d };
    itemFactory.initItem(item);
    expect(item.typeName).toBe('accessories');
  });
});
