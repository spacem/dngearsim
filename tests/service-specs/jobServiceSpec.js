describe('jobs', function () {
  dnsimTestSetup();
  
  var jobs;
  beforeEach(inject(function($injector) {
    jobs = $injector.get('jobs');
  }));
  
  it('', function() {
    expect(jobs).toBe(true);
  });
});
