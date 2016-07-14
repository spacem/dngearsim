describe('jobs', function () {
  dnsimTestSetup();
  
  var mockDntData = {
    isLoaded: function(file) { return true; },
    getData: function(file) {
      return [
        {id: 1, JobName: 'test0', JobNumber: 0, JobIcon: 22, BaseClass: 0, EnglishName: 'test0'},
        {id: 2, JobName: 'test1', JobNumber: 1, JobIcon: 23, BaseClass: 0, EnglishName: 'test1'},
        {id: 3, JobName: 'test2', JobNumber: 2, JobIcon: 24, BaseClass: 0, EnglishName: 'test2'},
        {id: 4, JobName: 'test3', JobNumber: 2, JobIcon: 25, BaseClass: 0, EnglishName: 'test3'},
        ];
    },
    find: function(file, column, value) {
      if(column == 'id') {
        return this.getData(file)[value];
      }
      else {
        throw 'unknown methd for ' + column;
      }
    }
  };
  
  var mockTranslations = {
    isLoaded: function() { return true; },
    translate: function(id, param) { return 'test' + id; }
  }
  
  var jobs;
  beforeEach(function() {
    module(function($provide) {
      $provide.value('dntData', mockDntData);
      $provide.value('translations', mockTranslations);
    });
  
    inject(function($injector) {
      jobs = $injector.get('jobs');
    });
  });
  
  it('gives all when getting all', function() {
    var allJobs = jobs.getAllJobs();
    expect(allJobs.length).toBe(4);
    expect(allJobs[0].id).toBe(1);
    expect(allJobs[1].id).toBe(2);
    expect(allJobs[2].id).toBe(3);
    expect(allJobs[3].id).toBe(4);
  });
  
  it('gives final only when getting final', function() {
    var allJobs = jobs.getFinalJobs();
    expect(allJobs.length).toBe(2);
    expect(allJobs[0].id).toBe(3);
    expect(allJobs[1].id).toBe(4);
  });
  
  it('gets base job names', function() {
    var allJobs = jobs.getBaseJobs();
    expect(allJobs.length).toBe(1);
    expect(allJobs[0]).toBe('test0');
  });
  
  it('gets base job names from job', function() {
    var allJobs = jobs.getAllJobs();
    angular.forEach(allJobs, function(job, index) {
      var baseJobName = jobs.getBaseJobName(job);
      expect(baseJobName).toBe('test0');
    });
  });
});
