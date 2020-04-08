import { Item } from "src/models/item";

angular.module('dnsim').directive('dngearsimSkillSearch', function () {
  return {
    scope: {},
    bindToController: {
      job: '=job',
      jobs: '=jobs',
    },
    controller: ['$timeout', 'region', 'jobs', 'translations', 'dntData', 'hCodeValues', 'itemCategory', '$location', 'exportLinkHelper', skillSearchCtrl],
    controllerAs: 'skillSearch',
    template: require('!raw-loader!./skill-search.html').default
  };
});

function skillSearchCtrl($timeout, region, jobs, translations, dntData, hCodeValues, itemCategory, $location, exportLinkHelper) {

  var vm = this;

  vm.allJobs = [];
  vm.dntName = '';
  vm.loadedJobId = -1;
  vm.maxResults = 30;
  vm.showMoreResults = function() {
    vm.maxResults += 20;
  };

  vm.itemCategory = itemCategory.byName('skills');

  vm.nameSearch = localStorage.getItem('nameSearch');
  if (!vm.nameSearch) {
    vm.nameSearch = '';
  }

  vm.firstInit = async function() {
    region.init();
    await jobs.init();
    jobInit();
    vm.init();
  };

  vm.init = async function() {
    vm.skills = [];
    await initSkills();
    $timeout();
  };

  if(translations.isLoaded()) {
    vm.firstInit();
  } else {
    translations.init(reportProgress, function() { vm.firstInit(); } );
  }

  vm.navigate = function () {
    $timeout(function () {
      if (vm.itemCategory) {
        $location.path(vm.itemCategory.path);
      }
    });
  }

  function getDntName(baseClassName) {
    // console.log('got base class :' + baseClassName);
    if (baseClassName != null) {
      return 'skilltable_character' + baseClassName.toLowerCase() + '.json';
    }
    else {
      return null;
    }
  }

  function getLevelDntName(baseClassName) {
    // console.log('got base class :' + baseClassName);
    if (baseClassName != null) {
      return 'skillleveltable_character' + baseClassName.toLowerCase() + 'pve.json';
    }
    else {
      return null;
    }
  }

  async function initSkills() {
    var baseJobNames = [];
    // console.log('init skills for ', vm.job.id);
    if (vm.job.id >= 0) {
      var baseName = jobs.getBaseJobName(vm.job);
      baseJobNames.push(baseName);

      for (const baseName of baseJobNames) {
        var dntName = getDntName(baseName);
        var levelDntName = getLevelDntName(baseName);
        await dntData.init(dntName, null);
        await dntData.init(levelDntName, null);
      }
      setupSkills(baseJobNames, vm.job);
    }
  }

  function getSkills() {
    return vm.skills;
  }

  function setupSkills(baseJobNames, job) {
    vm.skills = [];

    for (const baseName of baseJobNames) {
      var dntName = getDntName(baseName);

      const numSkills = dntData.getNumRows(dntName);
      for (var s = 0; s < numSkills; ++s) {
        const nameId = dntData.getValue(dntName, s, 'NameID');
        if (!nameId) {
          continue;
        }

        if (
          dntData.getValue(dntName, s, 'EffectClass1') > 0 ||
          dntData.getValue(dntName, s, 'EffectClass2') > 0 ||
          dntData.getValue(dntName, s, 'EffectClass3') > 0 ||
          dntData.getValue(dntName, s, 'EffectClass4') > 0 ||
          dntData.getValue(dntName, s, 'EffectClass5') > 0 ||
          dntData.getValue(dntName, s, 'EffectClass6') > 0) {

          var newItem: any = {};

          newItem.id = dntData.getValue(dntName, s, 'id');
          newItem.typeName = 'skills';
          newItem.itemSource = 'skills';
          newItem.name = translations.translate(nameId, dntData.getValue(dntName, s, 'NameIDParam'));
          newItem.needJobClass = dntData.getValue(dntName, s, 'NeedJob');
          newItem.rank = hCodeValues.rankNames[0];
          newItem.baseJobName = baseName.toLowerCase();
          newItem.icon = dntData.getValue(dntName, s, 'IconImageIndex');

          vm.skills.push(exportLinkHelper.reloadSkill(newItem));
        }
      }
      vm.loadedJobId = job.id;
    }
  }

  vm.getResults = function () {

    var skills = getSkills();
    if (skills == null) {
      return [];
    }

    if (vm.job && vm.job.id >= 0) {
      localStorage.setItem('jobNumber', vm.job.id);
    }
    localStorage.setItem('nameSearch', vm.nameSearch);

    var newResults = [];
    var numSkills = skills.length;
    for (var i = 0; i < numSkills; ++i) {
      var e = skills[i];

      if (vm.nameSearch != '') {
        var nameSearches = vm.nameSearch.split(' ');
        if (!nameSearches.length) {
          nameSearches = [vm.nameSearch];
        }
        var allMatch = true;
        for (var ns = 0; ns < nameSearches.length; ++ns) {
          if (e.name && e.name.toString().toUpperCase().indexOf(nameSearches[ns].toUpperCase()) == -1) {
            allMatch = false;
            break;
          }
        }

        if (!allMatch) {
          continue;
        }
      }

      if (vm.job.id >= 0 && !vm.job.isClassJob(e.needJobClass)) {
        continue;
      }

      newResults.push(e);
      if (newResults.length > this.maxResults) {
        break;
      }
    }
    return newResults;
  }

  function reportProgress(msg) {
    // console.log('progress: ' + msg);
  }

  function jobInit() {
    var newJobs = jobs.getFinalJobs();

    if (vm.jobs && vm.jobs.length) {
      newJobs.splice(0, 0, vm.jobs[0]);
    }
    vm.jobs = newJobs;
    vm.allJobs = jobs.getAllJobs();

    var lastJobNumber = Number(localStorage.getItem('jobNumber'));
    // console.log('using job', lastJobNumber);
    if (lastJobNumber != null) {
      angular.forEach(newJobs, function (value, key) {
        if (value.id == lastJobNumber) {
          vm.job = value;
          // console.log('using job', value);
          return;
        }
      });
    }
  }
}
