import * as LZString from 'lz-string';
import * as angular from 'angular';

angular.module('dnsim').factory('saveHelper', ['itemCategory', saveHelper]);
function saveHelper(itemCategory) {
  return {
    saveItem: function (groupName, item) {
      var groups = this.getSavedItems();
      if (groupName in groups && Array.isArray(groups[groupName].items)) {

        groups[groupName].items.push(item);
        groups[groupName].lastUpdate = (new Date()).getTime();
        this.updatedSavedItems(groupName, groups[groupName].items);
      }
      else {
        this.updatedSavedItems(groupName, [item]);
      }
    },

    saveBuildSelection: function (buildName, builds) {
      this.setCurrentBuild(buildName);
      if (builds && buildName in builds && builds[buildName].job && builds[buildName].job.id) {
        localStorage.setItem('jobNumber', builds[buildName].job.id);
      }
    },

    importGroup: function (groupName, updatedItems) {
      var items = this.getSavedItems();
      groupName = this.getUniqueGroupName(groupName, items);
      this.updatedSavedItems(groupName, updatedItems);
      return groupName;
    },

    getUniqueGroupName: function (groupName, existingGroups) {
      var groupNameIndex = 0;
      if (groupName.lastIndexOf(')') == groupName.length - 1) {
        var startIndex = groupName.lastIndexOf('(');
        if (startIndex > 0) {
          var foundIndex = Number(groupName.substr(startIndex + 1, groupName.length - startIndex - 2));
          if (foundIndex > 0) {
            groupNameIndex = foundIndex + 1;
            groupName = groupName.substr(0, startIndex - 1);
          }
        }
      }

      var originalName = groupName;
      for (; ;) {
        var groupName = originalName;
        if (groupNameIndex > 0) {
          groupName = originalName + ' (' + groupNameIndex + ')';
        }

        if (groupName in existingGroups) {
          groupNameIndex++;
        }
        else {
          break;
        }
      }

      return groupName;
    },

    deleteBuild: function (buildName) {
      var builds = this.getSavedItems();
      if (buildName in builds) {
        delete builds[buildName];
        this.setCurrentBuild(null);
        this.saveBuilds(builds);
      }
    },

    updatedSavedItems: function (groupName, updatedItems) {
      var items = this.getSavedItems();
      if (groupName in items) {
        items[groupName].items = updatedItems;
        items[groupName].lastUpdate = (new Date()).getTime();
      }
      else {
        items[groupName] = { items: updatedItems, lastUpdate: (new Date()).getTime() };
        // console.log('created group');
      }

      this.saveBuilds(items);
    },

    saveBuilds: function (builds) {
      var stringifiedData = JSON.stringify(builds);
      localStorage.setItem('savedItems', LZString.compressToUTF16(stringifiedData));
    },

    saveBuild: function (oldGroupName, newGroupName, build) {
      this.updateBuild(
        oldGroupName,
        newGroupName,
        build.enemyLevel,
        build.playerLevel,
        build.heroLevel,
        build.job,
        build.damageType,
        build.element,
        build.secondaryElement,
        build.critResist,
        build.eleResist,
        build.enemyStatCaps,
        build.playerStatCaps,
        build.conversions,
        build.baseStats,
        build.heroStats);
    },

    updateBuild: function (
      oldGroupName, newGroupName, enemyLevel, playerLevel, heroLevel, job, damageType, element, secondaryElement, critResist, eleResist,
      enemyStatCaps, playerStatCaps, conversions, baseStats, heroStats) {

      var savedItems = this.getSavedItems();

      if (newGroupName in savedItems || oldGroupName == newGroupName) {
        // console.log('not changing name');
        newGroupName = oldGroupName;
      }
      else if (oldGroupName in savedItems) {
        var group = savedItems[oldGroupName];
        savedItems[newGroupName] = group;
        delete savedItems[oldGroupName];
      }

      savedItems[newGroupName].enemyLevel = enemyLevel;
      savedItems[newGroupName].playerLevel = playerLevel;
      savedItems[newGroupName].heroLevel = heroLevel;
      savedItems[newGroupName].job = job;
      savedItems[newGroupName].damageType = damageType;
      savedItems[newGroupName].element = element;
      savedItems[newGroupName].secondaryElement = secondaryElement;
      savedItems[newGroupName].critResist = critResist;
      savedItems[newGroupName].eleResist = eleResist;
      savedItems[newGroupName].enemyStatCaps = enemyStatCaps;
      savedItems[newGroupName].playerStatCaps = playerStatCaps;
      savedItems[newGroupName].conversions = conversions;
      savedItems[newGroupName].baseStats = baseStats;
      savedItems[newGroupName].heroStats = heroStats;

      this.saveBuilds(savedItems);
    },

    getSavedItems: function () {
      try {
        var stringifiedData = LZString.decompressFromUTF16(localStorage.getItem('savedItems'));
        if(stringifiedData) {
          var savedItems = JSON.parse(stringifiedData);
          const heroTitleStats = localStorage.getItem('dnsim-hero-title-stats');
          if (heroTitleStats) {
            try {
              const heroTitleStatArray = JSON.parse(heroTitleStats);
              for (const build of Object.values(savedItems)) {
                (build as any).heroTitleStats = heroTitleStatArray;
              }
            } catch (err) {
              console.error('could not load hero stats', err);
            }
          }
          return savedItems;
        }
      } catch (ex) {
        console.error('could not load builds', ex);
      }

      return {};
    },

    currentBuild: null,
    getCurrentBuild: function () {
      if (!this.currentBuild) {
        this.currentBuild = localStorage.getItem('currentGroup');
        if (this.currentBuild) {
          var savedItems = this.getSavedItems();
          if (!(this.currentBuild in savedItems)) {
            localStorage.removeItem('currentGroup');
            this.currentBuild = null;
          }
        }
      }

      return this.currentBuild;
    },

    setCurrentBuild: function (buildName) {
      this.currentBuild = buildName;
      if (!buildName) {
        localStorage.removeItem('currentGroup');
      }
      else {
        localStorage.setItem('currentGroup', buildName);
      }
    }
  };
}
