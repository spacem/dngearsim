describe('itemCategory', function () {
  dnsimTestSetup();
  
  var itemCategory;
  beforeEach(function() {
    module(function($provide) {
      $provide.value('itemFactory', {loadItems: function(itemSource) { itemSource.items = [{id: 123, itemSource: 'title', typeName: 'titles'}] }});
    });
  
    inject(function($injector) {
      itemCategory = $injector.get('itemCategory');
    });
  });
  
  it('gets items when items not set', function() {
    var items = itemCategory.getItems('titles');
    expect(items).toEqual([{id: 123, itemSource: 'title', typeName: 'titles'}]);
  });
  
  it('gets category by path', function() {
    var cat = itemCategory.byPath('offensive-gems');
    expect(cat.name).toEqual('offensive gems');
  });
  
  it('gets category by name', function() {
    var cat = itemCategory.byName('offensive gems');
    expect(cat.path).toEqual('offensive-gems');
  });
  
  describe('getItemsByCategory', function () {
    it('gives equipment in order', function() {
      var items = [
        {
          id: 1,
          itemSource: 'eq',
          exchangeType: 2,
          rank: { id: 1 },
          levelLimit: 2,
          typeName: 'armour',
        },
        {
          id: 2,
          itemSource: 'eq',
          exchangeType: 1,
          rank: { id: 2 },
          levelLimit: 2,
          typeName: 'armour',
        }
        ];

      var byType = itemCategory.getItemsByCategory(items);
      expect(byType.armour.length).toBe(2);
      expect(byType.armour[0].id).toBe(2);
      expect(byType.armour[1].id).toBe(1);
    });
  });
  
  describe('setIteCategory', function() {
    it('populates title type', function() {
      var d = { };
      var item = { itemSource: 'title', data: d };
      itemCategory.setItemCategory(item);
      expect(item.typeName).toBe('titles');
    });
    
    it('populates cash type', function() {
      var d = { };
      var item = { itemSource: 'cash', data: d, exchangeType: 23 };
      itemCategory.setItemCategory(item);
      expect(item.typeName).toBe('cash');
    });
    
    it('populates c2014 type', function() {
      var d = { };
      var item = { itemSource: 'c2014', data: d, exchangeType: 23 };
      itemCategory.setItemCategory(item);
      expect(item.typeName).toBe('cash');
    });
    
    it('populates c2015 type', function() {
      var d = { Type: 0, NameIDParam:'1234' };
      var item = { itemSource: 'c2015', data: d, exchangeType: 23 };
      itemCategory.setItemCategory(item);
      expect(item.typeName).toBe('cash');
    });
    
    it('populates weapons', function() {
      var d = { Type: 0, NameIDParam:'1234' };
      var item = { itemSource: 'rbeq', data: d, exchangeType: 2 };
      itemCategory.setItemCategory(item);
      expect(item.typeName).toBe('weapons');
    });
    
    it('populates armours', function() {
      var d = { Type: 1, NameIDParam:'1234' };
      var item = { itemSource: 'rbeq', data: d, exchangeType: 3 };
      itemCategory.setItemCategory(item);
      expect(item.typeName).toBe('armour');
    });
    
    it('populates accessories', function() {
      var d = { Type: 1, NameIDParam:'{1234},{5678},{2227}' };
      var item = { itemSource: 'rbeq', data: d, exchangeType: 10 };
      itemCategory.setItemCategory(item);
      expect(item.typeName).toBe('accessories');
    });
  });
});
