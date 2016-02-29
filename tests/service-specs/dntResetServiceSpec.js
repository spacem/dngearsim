describe('dntReset', function () {
  dnsimTestSetup();
  
  var c = 0;
  var fakeJob = { reset: function() { c++; } };
  var fakeItem1 = { reset: function() { c++; } };
  var fakeItem2 = { reset: function() { c++; } };
  
  var dntReset;
  beforeEach(inject(function($injector) {
    dntReset = $injector.get('dntReset', {
      'items': [fakeItem1, fakeItem2],
      'jobs': fakeJob
    });
  }));
  
  it('calls reset', function() {
    dntReset();
    expect(c).toBe(3);
  });
});
