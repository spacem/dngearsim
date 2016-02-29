describe('statHelper', function () {
  dnsimTestSetup();
  
  var statHelper;
  beforeEach(inject(function($injector) {
    statHelper = $injector.get('statHelper');
  }));
  
  it('', function() {
    expect(statHelper).toBe(true);
  });
});
