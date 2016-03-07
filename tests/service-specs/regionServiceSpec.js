describe('region', function () {
  dnsimTestSetup();
  
  var region;
  var dntData;
  var jobs;
  var items;
  beforeEach(inject(function($injector) {
    region = $injector.get('region');
  }));
  beforeEach(inject(function($injector) {
    dntData = $injector.get('dntData');
  }));
  beforeEach(inject(function($injector) {
    jobs = $injector.get('jobs');
  }));
  beforeEach(inject(function($injector) {
    items = $injector.get('items');
  }));
  
  it('resets jobs when setting location', function() {
    jobs.allJobs = [{id: 1}];
    region.setLocation('test');
    expect(jobs.allJobs).toBe(null);
  });
  
  it('resets items when setting location', function() {
    angular.forEach(items, function(source, sourceName) {
      source.items = [{id:1}];
    });
    
    region.setLocation('test');
    
    angular.forEach(items, function(source, sourceName) {
      expect(source.items).toBe(null);
    });
  });
});
