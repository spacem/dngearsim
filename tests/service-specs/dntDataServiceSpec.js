describe('dntData', function () {
  dnsimTestSetup();
  
  var dntData;
  beforeEach(inject(function($injector) {
    dntData = $injector.get('dntData');
  }));
  
  describe('getData', function () {
    it('gives empty list from getData when none loaded', function() {
      expect(dntData.getData('test123')).toEqual([]);
    });
  });
  
  describe('find', function () {
    it('gives empty list when none loaded', function() {
      expect(dntData.find('test123',1,1)).toEqual([]);
    });
  });
  
  describe('findFast', function () {
    it('gives empty list when none loaded', function() {
      expect(dntData.findFast('test123',1,1)).toEqual([]);
    });
  });
  
  describe('isLoaded', function () {
    it('gives false when bad file', function() {
      expect(dntData.isLoaded('test123')).toBe(false);
    });
  });
  
  describe('hasStartedLoading', function () {
    it('gives false when bad file', function() {
      expect(dntData.hasStartedLoading('test123',1,1)).toBe(false);
    });
  });
  
  describe('getNumRows', function () {
    it('gives 0 when bad file', function() {
      expect(dntData.getNumRows('test123')).toBe(0);
    });
  });
  
  describe('getRow', function () {
    it('gives empty when bad file', function() {
      expect(dntData.getRow('test123',1)).toEqual({});
    });
  });
  
  describe('lookupValue', function () {
    it('gives null bad file', function() {
      expect(dntData.lookupValue('test123',{},'colvaltest')).toBe(null);
    });
  });
  
  describe('convertData', function () {
    it('gives null bad file', function() {
      expect(dntData.lookupValue('test123',{})).toBe(null);
    });
  });
  
  describe('getValue', function () {
    it('gives null when bad file', function() {
      expect(dntData.lookupValue('test123',1,'testcol')).toBe(null);
    });
  });
  
  
});
