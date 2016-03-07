describe('saveHelper', function () {
  dnsimTestSetup();
  
  var saveHelper;
  beforeEach(inject(function($injector) {
    saveHelper = $injector.get('saveHelper');
  }));

  describe('getUniqueGroupName', function () {
    
    it('gets same name when no existing', function() {
      var name = saveHelper.getUniqueGroupName('test', {});
      expect(name).toBe('test');
    });
    
    it('gets same name when existing does not match', function() {
      var test = {};
      test['other'] = {};
      var name = saveHelper.getUniqueGroupName('test', test);
      expect(name).toBe('test');
    });
    
    it('adds (1) when name exists', function() {
      var test = {};
      test['test'] = {};
      var name = saveHelper.getUniqueGroupName('test', test);
      expect(name).toBe('test (1)');
    });
    
    it('increments (1) when it exists', function() {
      var test = {};
      test['test'] = {};
      test['test (1)'] = {};
      var name = saveHelper.getUniqueGroupName('test', test);
      expect(name).toBe('test (2)');
    });
    
    it('increments (1) when it exists with (1)', function() {
      var test = {};
      test['test'] = {};
      test['test (1)'] = {};
      var name = saveHelper.getUniqueGroupName('test (1)', test);
      expect(name).toBe('test (2)');
    });
    
    it('doesnt go back to no brackets when has brackets', function() {
      var test = {};
      test['test (1)'] = {};
      var name = saveHelper.getUniqueGroupName('test (1)', test);
      expect(name).toBe('test (2)');
    });
    
    it('starts (x) at current selection', function() {
      var test = {};
      test['test (123)'] = {};
      test['test (124)'] = {};
      test['test (125)'] = {};
      var name = saveHelper.getUniqueGroupName('test (124)', test);
      expect(name).toBe('test (126)');
    });
  });
});
