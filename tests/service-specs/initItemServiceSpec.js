describe('initItem', function () {
  dnsimTestSetup();
  
  var initItem;
  beforeEach(inject(function($injector) {
    initItem = $injector.get('initItem');
  }));
  
  it('', function() {
    expect(initItem).toBe(true);
  });
});
