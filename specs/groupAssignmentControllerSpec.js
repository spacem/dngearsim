describe('GroupAssignmentController', function() {
  beforeEach(module('groupAssignmentController'));

  beforeEach(function() {
    module('valueServices');
    module('saveService');
  });
  
  var hCodeValues;
  beforeEach(inject(function($injector) {
    hCodeValues = $injector.get('hCodeValues');
  }));
  
  var statHelper;
  beforeEach(inject(function($injector) {
    statHelper = $injector.get('statHelper');
  }));
  
  var $controller;
  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));
  
  var noSavedItemsMock = {
    getSavedItems: function() {
      return {};
    }
  };
  
  var savedItemsWithoutItemsMock = {
    getSavedItems: function() {
      return {
        groupName: {
          items: []
        }
      };
    }
  };
  
  var savedItemsWithoutStatsMock = {
    getSavedItems: function() {
      return {
        groupName: {
          items: [{
            id:1,
            stats: []
          }]
        }
      };
    }
  };
  
  var savedItemsMock = {
    getSavedItems: function() {
      return {
        groupName: {
          items: [{
            id:1,
            stats: [{id: 25, max: 100 }],
          }]
        }
      };
    }
  };
  
  var statHelperMock = {
    getSetStats: function(groupItems) {
      return [];
    },
    getCombinedStats: function(groupItems) {
      return [];
    },
    getCalculatedStats: function(group, combinedStats) {
      return [
        { id: 3008, max: 100 },
        { id: 1004, max: 100 },
        { id: 1006, max: 100 },
        { id: 1001, max: 100 },
        ];
    },
    getNakedStats: function(group) {
      return [];
    },
  }

  it('no groups, no group name', function () {
    var controller = $controller('groupAssignmentCtrl', { 'saveHelper': noSavedItemsMock });
    expect(controller.groupNames.length).toBe(0);
    expect(controller.groupName).toBe(null);
  });

  it('picks up first groupname', function () {
    var controller = $controller('groupAssignmentCtrl', { 'saveHelper': savedItemsMock });
    expect(controller.groupName).toBe('groupName');
  });

  it('gives empty calc when no stats', function () {
    var controller = $controller('groupAssignmentCtrl', { 'saveHelper': savedItemsWithoutStatsMock });
    expect(controller.getGroupCalcStats().length).toBe(0);
  });

  it('gives empty calc when no items', function () {
    var controller = $controller('groupAssignmentCtrl', { 'saveHelper': savedItemsWithoutItemsMock });
    expect(controller.getGroupCalcStats().length).toBe(0);
  });

  it('gives all calculated stats when using mock', function () {
    var controller = $controller('groupAssignmentCtrl', { 'saveHelper': savedItemsMock, 'statHelper': statHelperMock });
    expect(controller.getGroupCalcStats().length).toBe(4);
  });
  
  it('looks up avg dmg', function () {
    var controller = $controller('groupAssignmentCtrl', { 'saveHelper': savedItemsMock, 'statHelper': statHelperMock });
    var stat = controller.getAvgDmgStat(controller.getGroupCalcStats());
    expect(stat.id).toBeDefined();
    expect(stat.max).toBeDefined();
    expect(hCodeValues.stats[stat.id].name).toBe('avg dmg');
  });
  
  it('looks up avg pdmg', function () {
    var controller = $controller('groupAssignmentCtrl', { 'saveHelper': savedItemsMock, 'statHelper': statHelperMock });
    var stat = controller.getPDmgStat(controller.getGroupCalcStats());
    expect(stat.id).toBeDefined();
    expect(stat.max).toBeDefined();
    expect(hCodeValues.stats[stat.id].name).toBe('avg pdmg');
  });
  
  it('looks up avg mdmg', function () {
    var controller = $controller('groupAssignmentCtrl', { 'saveHelper': savedItemsMock, 'statHelper': statHelperMock });
    var stat = controller.getMDmgStat(controller.getGroupCalcStats());
    expect(stat.id).toBeDefined();
    expect(stat.max).toBeDefined();
    expect(hCodeValues.stats[stat.id].name).toBe('avg mdmg');
  });
  
  it('looks up eq hp', function () {
    var controller = $controller('groupAssignmentCtrl', { 'saveHelper': savedItemsMock, 'statHelper': statHelperMock });
    var stat = controller.getHpStat(controller.getGroupCalcStats());
    expect(stat.id).toBeDefined();
    expect(stat.max).toBeDefined();
    expect(hCodeValues.stats[stat.id].name).toBe('avg eqhp');
  });
});