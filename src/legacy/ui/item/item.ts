angular.module('dnsim').controller('ItemCtrl',
['$scope','$window','dntData','hCodeValues','items','jobs','exportLinkHelper','$routeParams','translations','$location','region','itemFactory','$timeout','statHelper','saveHelper',
function($scope,$window,dntData,hCodeValues,items,jobs,exportLinkHelper,$routeParams,translations,$location,region,itemFactory,$timeout,statHelper,saveHelper) {
  'use strict';
  
  region.setLocationByName($routeParams.region);
  
  $window.scrollTo(0, 0);
  
  $scope.jobName = null;
  // console.log('search string: ', $routeParams.i);
  $scope.item = exportLinkHelper.decodeItem($routeParams.i);
  if('itemSource' in $scope.item) {
    $scope.itemType = items[$scope.item.itemSource];
  }
  
  $scope.item.setStats = null;
  $scope.item.setId = null;
  $scope.detail = null;
  
  $scope.getDescription = function() {
    if($scope.item.description) {
      return $scope.item.description;
    }
    else if($scope.itemType &&
      $scope.itemType.name == 'title' &&
      translations.isLoaded() &&
      dntData.isLoaded($scope.itemType.mainDnt)) {

      var itemData = dntData.find($scope.itemType.mainDnt, 'id', $scope.item.id);
      if(itemData && itemData.length > 0 && itemData[0].DescriptionID > 0) {
        return translations.translate(itemData[0].DescriptionID, itemData[0].DescriptionIDParam);
      }
    }
    else if($scope.item.fileName &&
      dntData.isLoaded($scope.item.fileName + '.json')) {
        
      var itemData = dntData.find($scope.item.fileName + '.json', 'id', $scope.item.id);
      if(itemData && itemData.length > 0 && itemData[0].DescriptionID > 0) {
        return translations.translate(itemData[0].DescriptionID, itemData[0].DescriptionIDParam);
      } 
    }
    return '';
  }
  
  $scope.getExchangeType = function() {
    // console.log('getting exchange');
    var exchangeDnt = 'exchange.json';
    if(translations.isLoaded() &&
      dntData.isLoaded(exchangeDnt) &&
      $scope.item.exchangeType > 0) {
        
      // console.log('finding exchange ' + $scope.item.exchangeType);

      var exchange = dntData.find(exchangeDnt, 'ExchangeType', $scope.item.exchangeType);
      // console.log('got ' + exchange.length);
      if(exchange && exchange.length > 0 && exchange[0].NameID > 0) {
        // console.log('exchange name: ' + exchange[0].NameID);
        return translations.translate(exchange[0].NameID).toLowerCase();
      }
    }
    return '';
  }
  
  $scope.setDetail = function(detail) {
    $scope.detail = detail;
  }
  
  $scope.getNumInSet = function() {
    
    var buildName = $scope.getBuildName();
    if(buildName && $scope.item && $scope.item.setId) {
      return statHelper.getNumItemsForSet($scope.builds[buildName].items, $scope.item.setId);
    }
    
    return 0;
  }
  
  $scope.getBuildName = function() {
    var buildName = saveHelper.getCurrentBuild();
    if($scope.builds) {
      if(!buildName || !(buildName in $scope.builds)) {
        var allBuildNames = Object.keys($scope.builds);
        if(allBuildNames.length) {
          buildName = allBuildNames[0];
        }
      }
    }
    
    return buildName;
  }

  $scope.getSellingPrice = function() {
    var itemData = itemFactory.getItemData($scope.item);
    var retVal = '';
    if('SellAmount' in itemData && itemData.SellAmount > 0) {

      var gold = Math.floor(itemData.SellAmount / 10000);
      if(gold) {
        retVal += gold + 'gold ';
      }

      var silver = Math.floor(itemData.SellAmount / 100) % 100;
      if(silver) {
        retVal += silver + 'silver ';
      }

      var copper = itemData.SellAmount % 100;
      if(copper) {
        retVal += copper + 'copper ';
      }
    }
    return retVal;
  }
  
  $scope.getServerStorage = function() {
    var itemData = itemFactory.getItemData($scope.item);
    var retVal = '';
    
    if(itemData && 'IsCash' in itemData && itemData.IsCash == 0) {
      if(itemData && 'AbleWStorage' in itemData) {
        if(itemData.AbleWStorage == 1) {
          retVal = 'can server storage';
        }
        else if(itemData.AbleWStorage == 0) {
          if(itemData && 'Reversion' in itemData && itemData.Reversion) {
            retVal = 'not transferable';
          }
        }
      }

      if(itemData && 'Reversion' in itemData) {
        if(retVal.length) {
          retVal += ', ';
        }
        
        if(itemData.Reversion == 0) {
          retVal += 'can trade';
        }
        else if(itemData.Reversion == 1) {
          retVal += 'not tradable ';
        }
      }
    }
    return retVal;
  }
  
  $scope.getMoreInfo = function() {
    var sealTimes = 0;
    var numStamps = 0;
    
    if($scope.moreInfoLoaded()) {
      var itemData = itemFactory.getItemData($scope.item);
      
      if(itemData && 'IsCash' in itemData && itemData.IsCash == 0) {
        if(itemData && 'SealID' in itemData && 'SealCount' in itemData) {
          sealTimes = itemData.SealCount;
            
          var sealData = dntData.find('sealcounttable.json', 'Type2', itemData.SealID);
          if(sealData && sealData.length > 0 && sealData[0].Type1 == 0) {
            
            var colName = 'Count0';
            if($scope.item.enchantmentNum) {
              colName = 'Count' + $scope.item.enchantmentNum;
            }
            
            if(colName in sealData[0]) {
              numStamps = sealData[0][colName];
            }
          }
        }
      }
      else if(itemData && 'IsCash' in itemData && 'CashTradeCount' in itemData && 'Reversion' in itemData && 'AbleWStorage' in itemData) {
        if(itemData.Reversion == 2) {
          if(itemData.CashTradeCount) {
            return 'can server storage, cash trade count: ' + itemData.CashTradeCount;
          }
          else {
            return 'can server storage, can use warranty';
          }
        }
        else if(itemData.AbleWStorage) {
          return 'can server storage';
        }
        else {
          return 'not tradable';
        }
      }
    }
    
    if(sealTimes && numStamps) {
      return 'can stamp ' + sealTimes + ' times using ' + numStamps + '  stamps';
    }
    else {
      return '';
    }
  }
  
  $scope.moreInfoLoaded = function() {
    return dntData.isLoaded($scope.item.fileName + '.json') &&
      dntData.isLoaded('sealcounttable.json');
  }
  
  $scope.loadMoreInfo = function() {
    dntData.init($scope.item.fileName + '.json', null, $timeout);
    dntData.init('sealcounttable.json', null, $timeout);
  }
  
  $scope.handleChange = function() {
    // console.log('changes');
    if($scope.item.itemSource != 'custom') {
      $location.search('i', exportLinkHelper.encodeItem($scope.item));
    }
    else {
      setFullStats();
      $scope.item = angular.copy($scope.item);
    }
    getBuilds();
  }
  
  function getJobName() {
    var allJobs = jobs.getAllJobs();
    angular.forEach(allJobs, function(job, index) {
      if(job.id == $scope.item.needJobClass) {
        $scope.jobName = job.name;
      }
    });
  }
  
  function init() {
    getBuilds();
    $scope.preInitItem = $scope.item;
    $scope.item = null;
  
    var anyToLoad = false;
    
    angular.forEach(exportLinkHelper.getDntFiles($scope.preInitItem), function(columns, fileName) {
      if(!dntData.isLoaded(fileName)) {
        dntData.init(fileName, columns, reportProgress, tryInit);
        anyToLoad = true;
      }
    });
    
    if(!translations.isLoaded()) {
      translations.init(reportProgress, tryInit);
      anyToLoad = true;
    }
    
    if(!jobs.isLoaded()) {
      jobs.init(reportProgress, tryInit);
      anyToLoad = true;
    }
    
    if(!anyToLoad) {
      tryInit();
    }
  }
  init();

  function isLoaded() {
    var anyDntToLoad = false;
    angular.forEach(exportLinkHelper.getDntFiles($scope.preInitItem), function(columns, fileName) {
      if(!dntData.isLoaded(fileName)) {
        anyDntToLoad = true;
      }
    });

    return !anyDntToLoad && translations.isLoaded() && jobs.isLoaded();
  }
  
  function tryInit() {
    if(isLoaded()) {
      $scope.item = exportLinkHelper.reloadItem($scope.preInitItem);
      if($scope.item == null) {
        return;
      }
      
      setFullStats();
      $window.document.title = 'dngearsim | ' + $scope.item.name;
      if($scope.item.itemSource != 'custom') {
      
        if($scope.item.typeName == 'skills') {
          if(!$scope.item.pve || $scope.item.pve != 'pvp') {
            $scope.item.pve = 'pve';
          }
          else {
            $scope.item.pve = 'pvp';
          }
        }
        else {
          if($scope.item.needJobClass > 0) {
            getJobName();
          }
        }
        
        setFileName();
      }

      setupTabs();
    }
  }

  function setupTabs() {
    var itemData = itemFactory.getItemData($scope.item);
    if(itemData.DisjointDrop1 > 0) {
      $scope.canExtract = true;
    }
    
    if((itemData.Type == 0 || itemData.Type == 1) && $scope.item.enchantmentNum > 0) {
      $scope.canTransfer = true;
    } 

    if(itemData.Type == 0 || itemData.Type == 1) {
      $scope.canTune = true;
    }
    
    if($scope.item.setId) {
      $scope.isInSet = true;
    }
    
    if($scope.item.typeId == 5) {
      $scope.isPlate = true;
    }
    
    if($scope.item.typeId == 46 || $scope.item.typeId == 8 || $scope.item.typeId == 112 || $scope.item.typeId == 122 || $scope.item.typeId == 142 || $scope.item.typeId == 160) {
      $scope.hasContents = true;
      $scope.detail = 'contents';
    }
    else if($scope.item.typeName != null) {
      $scope.canUse = true;
      $scope.detail = 'use';
    }
    else if($scope.canExtract) {
      $scope.detail = 'extract';
    }
    else if($scope.canTransfer) {
      $scope.detail = 'transfer';
    }
    else if($scope.canTune) {
      $scope.detail = 'tuning';
    }
    else if($scope.isPlate) {
      $scope.detail = 'plate';
    }
    else {
      $scope.detail = 'attainment';
    }
  }
  
  function setFileName() {
    if(!$scope.item.fileName) {
      if($scope.item.itemSource in items && items[$scope.item.itemSource].mainDnt) {
        $scope.item.fileName = items[$scope.item.itemSource].mainDnt.replace('.json', '').replace('.json', '').replace('.optimised', '');
      }
    }
  }
  
  function setFullStats() {
    // full stats are cleared when publishing builds
    $scope.item.fullStats = $scope.item.stats;
    
    if($scope.item.enchantmentStats != null && $scope.item.enchantmentStats.length > 0) {
      $scope.item.fullStats = hCodeValues.mergeStats($scope.item.enchantmentStats, $scope.item.fullStats);
    }
    
    if($scope.item.sparkStats != null && $scope.item.sparkStats.length > 0) {
      $scope.item.fullStats = hCodeValues.mergeStats($scope.item.sparkStats, $scope.item.fullStats);
    }
  }
  
  function reportProgress(msg) {
    // $scope.progress += '|' + msg;
    // console.log('progress: ' + msg);
  }
  
  function getBuilds() {
    var builds = saveHelper.getSavedItems();
    $scope.builds = builds;
  }
}]);