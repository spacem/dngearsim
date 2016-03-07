describe('dntReset', function () {
  dnsimTestSetup();
  
  var c = 0;
  var fakeJob = { reset: function() { c++; } };
  var fakeItem1 = { reset: function() { c++; } };
  var fakeItem2 = { reset: function() { c++; } };
  
  var d = 0;
  var dntData = { resetAll: function() { d++; } };
  
  var dntReset;
  beforeEach(function() {
    module(function($provide) {
      $provide.value('items', { fakeItem1: fakeItem1, fakeItem2:fakeItem2});
      $provide.value('jobs', fakeJob);
      $provide.value('dntData', dntData);
    });
  
    inject(function($injector) {
      dntReset = $injector.get('dntReset');
    });
  });
  
  it('calls reset', function() {
    dntReset();
    expect(c).toBe(3);
    expect(d).toBe(1);
  });
});
