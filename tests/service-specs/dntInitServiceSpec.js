describe('dntInit', function () {
  dnsimTestSetup();
  
  var dntData;
  beforeEach(inject(function($injector) {
    dntInit = $injector.get('dntInit', { 'items': [], 'jobs': {} });
  }));
  
  var dntInit;
  beforeEach(inject(function($injector) {
    dntInit = $injector.get('dntInit', { 'items': [], 'jobs': {} });
  }));
  
  it('runs when nothing to do', function() {
    dntInit(function(msg) {
      expect(msg).toBe('starting init');
    });
  });
});
