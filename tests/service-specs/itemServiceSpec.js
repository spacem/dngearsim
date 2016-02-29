describe('items', function () {
  dnsimTestSetup();
  
  var items;
  beforeEach(inject(function($injector) {
    items = $injector.get('items');
  }));
  
  it('', function() {
    expect(items).toBe(true);
  });
});
