angular.module('dnsim').controller('ViewGroupCtrl', 
  ['$scope','$window','region','$location','$routeParams','saveHelper','dntData','$timeout','translations','dntReset','exportLinkHelper','groupHelper','jobs','character','statHelper','hCodeValues',
  function($scope,$window,region,$location,$routeParams,saveHelper,dntData,$timeout,translations,dntReset,exportLinkHelper,groupHelper,jobs,character,statHelper,hCodeValues) {
    'use strict';
  
    document.body.className = 'saved-back';
    $window.document.title = 'DN Gear Sim';
    
    region.setLocationByName($routeParams.region);
    
    $scope.buildName = '';
    $scope.build = {};
    

    if('g' in $routeParams && 'i' in $routeParams) {
      $scope.buildName = $routeParams.g;
      
      $scope.enemyLevel = $routeParams.e;
      $scope.playerLevel = $routeParams.p;
      $scope.heroLevel = $routeParams.h;
      $scope.job = { id: $routeParams.j };
      $scope.damageType = hCodeValues.damageTypes[$routeParams.d];
      $scope.element = hCodeValues.elements[$routeParams.t];
        
      var items = [];
      
      var itemString = $routeParams.i;
      
      angular.forEach(itemString.split(','), function(itemStr, index) {
        var item = exportLinkHelper.decodeItem(itemStr);
        
        if(item.id > 0) {
          items.push(item);
        }
      });

      $scope.build = {};
      $scope.savedItems = {};
      $scope.savedItems[$scope.buildName] = $scope.build;
      $scope.build.items = items;
      $scope.isLoading = true;
      
      angular.forEach(groupHelper.getDntFiles($scope.build), function(columns, fileName) {
        dntData.init(fileName, columns, progress, tryInit);
      });
      
      translations.init(progress, tryInit);
      jobs.init(progress, tryInit);
      character.init(tryInit);
      
      $timeout();
    }
    
    $scope.anyItems = Object.keys($scope.savedItems).length > 0;
    
    function tryInit() {
      
      if(dntData.anyLoading() || !translations.isLoaded() || !jobs.isLoaded()) {
        return;
      }
      
      $timeout(function() {
        var groupName = $scope.buildName;
        var group = $scope.build;
        
        $scope.job = jobs.getById($scope.job.id);
        
        $scope.enemyStatCaps = character.getStatCaps($scope.enemyLevel);
        $scope.playerStatCaps = character.getStatCaps($scope.playerLevel);
        if($scope.job) {
          $scope.conversions = character.getConversions($scope.job.id);
          $scope.baseStats = character.getBaseStats($scope.playerLevel, $scope.job.id);
        }
        $scope.heroStats = character.getHeroStats($scope.heroLevel);
        
        var newItems = groupHelper.reloadGroup(groupName, group);
        dntReset();
      
        $scope.savedItems = {};
        $scope.build = {
          items: newItems,
          lastUpdate: group.lastUpdate,

          enemyLevel: $scope.enemyLevel,
          playerLevel: $scope.playerLevel,
          heroLevel: $scope.heroLevel,
          job: $scope.job,
          damageType: $scope.damageType,
          element: $scope.element,
          enemyStatCaps: $scope.enemyStatCaps,
          playerStatCaps: $scope.playerStatCaps,
          conversions: $scope.conversions,
          baseStats: $scope.baseStats,
          heroStats: $scope.heroStats,
        };
        $scope.savedItems[groupName] = $scope.build;
        $scope.stats = statHelper.getBuildStats($scope.build);
        
        var longUrl = exportLinkHelper.createGroupLink($scope.buildName, $scope.build);
        $scope.build.shortUrl = sessionStorage.getItem(longUrl);
      });
    }
    
    function progress() {
    }
    
    $scope.copyGroup = function() {
      var newBuildName = saveHelper.importGroup($scope.buildName, $scope.build.items);
      console.log('copying in as ' + newBuildName);
      
      saveHelper.renameSavedGroup(
        newBuildName, 
        newBuildName,
        $scope.enemyLevel,
        $scope.playerLevel,
        $scope.heroLevel,
        $scope.job,
        $scope.damageType,
        $scope.element,
        $scope.enemyStatCaps, $scope.playerStatCaps, $scope.conversions, $scope.baseStats, $scope.heroStats);
      
      $location.url('/builds/' + newBuildName);
    }
  }]
);
