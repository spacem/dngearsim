describe('groupHelper', function () {
  dnsimTestSetup();
  
  var groupHelper;
  beforeEach(inject(function($injector) {
    groupHelper = $injector.get('groupHelper');
  }));
  
  it('', function() {
    expect(groupHelper).toBe(true);
  });
});
