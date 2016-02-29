describe('itemColumnsToLoad', function () {
  dnsimTestSetup();
  
  var itemColumnsToLoad;
  beforeEach(inject(function($injector) {
    itemColumnsToLoad = $injector.get('itemColumnsToLoad');
  }));
  
  it('has parts columns', function() {
    expect('partsDnt' in itemColumnsToLoad).toBe(true);
  });
  
  it('has SetItemID under parts', function() {
    expect('SetItemID' in itemColumnsToLoad.partsDnt).toBe(true);
    expect(itemColumnsToLoad.partsDnt.SetItemID).toBe(true);
  });
});
