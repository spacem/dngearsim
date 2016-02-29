describe('region', function () {
  dnsimTestSetup();
  
  var region;
  beforeEach(inject(function($injector) {
    region = $injector.get('region');
  }));
  
  it('', function() {
    expect(region).toBe(true);
  });
});
