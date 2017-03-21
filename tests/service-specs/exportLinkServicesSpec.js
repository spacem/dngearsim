describe('exportLinkHelper', function () {
  dnsimTestSetup();
  
  var exportLinkHelper;
  beforeEach(function() {
    module(function($provide) {
      $provide.value('region', {dntLocation: {region: 'na'}});
    });
  
    inject(function($injector) {
      exportLinkHelper = $injector.get('exportLinkHelper');
    });
  });
  
  var testItem = {
    id: 4,
    name : 'test',
    stats : { id: 2, max: 4 },
    itemSource : 'source',
    levelLimit : 42,
    needJobClass : 4,
    typeId : 7,
    typeName : 'typeName',
    rank : { id: 2, name : 'rare' },
    enchantmentId : 12345,
    enchantmentNum: 6,
    sparkTypeId: 3,
    sparkId: 1,
    pid: 2,
  };

  it('encodes item with all parts', function() {
    var itemString = exportLinkHelper.encodeItem(testItem, false);
    expect(itemString).toBe('I4:_source:E6:P2:H1:.test');
  });
  
  it('decodes item with all parts', function() {
    var decodedItem = exportLinkHelper.decodeItem('I4:_source:E6:P2:H1:.test');
    expect(decodedItem.id).toEqual(testItem.id);
    expect(decodedItem.pid).toEqual(testItem.pid);
    expect(decodedItem.enchantmentNum).toEqual(testItem.enchantmentNum);
    expect(decodedItem.sparkId).toEqual(testItem.sparkId);
    expect(decodedItem.name).toEqual(testItem.name);
    expect(decodedItem.itemSource).toEqual(testItem.itemSource);
  });

  it('encodes group with all parts', function() {
    
    var testGroup = { items: [testItem]}
    
    var groupString = exportLinkHelper.createGroupLink('groupname', testGroup);
    expect(groupString).toBe('view-group?region=na&g=groupname&i=I4:_source:E6:P2:H1');
  });
});
