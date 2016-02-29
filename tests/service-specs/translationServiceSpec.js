describe('translations', function () {
  dnsimTestSetup();
  
  var translations;
  beforeEach(inject(function($injector) {
    translations = $injector.get('translations');
  }));
  
  it('', function() {
    expect(translations).toBe(true);
  });
});
