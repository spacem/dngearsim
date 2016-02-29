describe('exportLinkHelper', function () {
  dnsimTestSetup();
  
  var exportLinkHelper;
  beforeEach(inject(function($injector) {
    exportLinkHelper = $injector.get('exportLinkHelper');
  }));
  
  it('', function() {
    expect(exportLinkHelper).toBe(true);
  });
});
