describe('saveHelper', function () {
  dnsimTestSetup();
  
  var saveHelper;
  beforeEach(inject(function($injector) {
    saveHelper = $injector.get('saveHelper');
  }));
  
  it('', function() {
    expect(saveHelper).toBe(true);
  });
});
