describe('itemCategory', function () {
  dnsimTestSetup();
  
  var itemCategory;
  beforeEach(function() {
    module(function($provide) {
      $provide.value('itemFactory', {loadItems: function(itemSource) { itemSource.items = [{id: 123}] }});
    });
  
    inject(function($injector) {
      itemCategory = $injector.get('itemCategory');
    });
  });
  
  it('gets items when items not set', function() {
    var items = itemCategory.getItems('titles');
    expect(items).toEqual([{id: 123}]);
  });
  
  it('gets category by path', function() {
    var cat = itemCategory.byPath('search/titles');
    expect(cat.name).toEqual('titles');
  });
  
  it('gets category by name', function() {
    var cat = itemCategory.byName('titles');
    expect(cat.path).toEqual('search/titles');
  });
});
