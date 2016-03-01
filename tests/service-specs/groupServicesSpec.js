describe('groupHelper', function () {
  dnsimTestSetup();
  
  var mockItem1 = {
    files: {test1: null}
  };
  
  var mockItem2 = {
    files: {test2: null}
  };
  
  var mockItem3 = {
    files: {test1: null}
  };
  
  var mockItem4 = {
    files: []
  };
  
  var mockGroup = {
    items: [
      mockItem1,
      mockItem2,
      mockItem3,
      mockItem4,
    ]
  }
  
  var groupHelper;
  beforeEach(function() {
    module(function($provide) {
      $provide.value('exportLinkHelper', {getDntFiles: function(item) { return item.files; }});
    });
  
    inject(function($injector) {
      groupHelper = $injector.get('groupHelper');
    });
  });
  
  it('gives all files with getDntFiles', function() {
    var files = groupHelper.getDntFiles(mockGroup);
    expect(files).toEqual({test1:null, test2:null});
  });
});
