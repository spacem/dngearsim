import { DntFiles } from 'src/values/dnt-files';

angular.module('dnsim').factory('character',
  ['dntData', 'itemColumnsToLoad', 'jobs', 'hCodeValues', 'statHelper',
    character]);
function character(dntData, itemColumnsToLoad, jobs, hCodeValues, statHelper) {

  function reportProgress(msg) {
    // console.log('progress: ' + msg);
  }

  return {
    init: function (complete) {
      jobs.init(reportProgress, complete);
      dntData.init(DntFiles.jobConversions, itemColumnsToLoad.jobConversionColsToLoad, reportProgress, complete, false);
      dntData.init(DntFiles.statCaps, itemColumnsToLoad.statCapColsToLoad, reportProgress, complete, false);
      dntData.init(DntFiles.jobBaseStats, itemColumnsToLoad.jobBaseStatColsToLoad, reportProgress, complete, false);
      dntData.init(DntFiles.heroLevels, null, reportProgress, complete, false);
      dntData.init(DntFiles.heroLevelPotentials, null, reportProgress, complete, false);
      dntData.init(DntFiles.totalSkills, null, reportProgress, complete, false);
      dntData.init(DntFiles.totalSkillLevels, null, reportProgress, complete, false);
      dntData.init(DntFiles.totalSkillHeroLevels, null, reportProgress, complete, false);
    },

    getHeroStats: function (heroLevel) {
      let heroStats = [];
      if (heroLevel > 0) {
        const index = dntData.findFast(DntFiles.heroLevels, 'id', heroLevel);
        if (index.length === 1) {
          const h = dntData.getRow(DntFiles.heroLevels, index[0]);
          if (h) {
            const pIndex = dntData.findFast(DntFiles.heroLevelPotentials, 'PotentialID', h.HeroLevelAbilityID);
            if (pIndex.length === 1) {
              const p = dntData.getRow(DntFiles.heroLevelPotentials, pIndex[0]);
              if (p) {
                heroStats = hCodeValues.getStats(p);
              }
            }
          }
        }
      }

      const totalDatas = dntData.getData(DntFiles.totalSkillHeroLevels);
      for (const t of totalDatas) {

        const heroLevelLimits = t.HeroLevelLimit.split(';').map(l => Number(l));
        const datas = dntData.find(DntFiles.totalSkills, 'id', t.SkillTableID);
        for (const d of datas) {
          const levels = dntData.find(DntFiles.totalSkillLevels, 'SkillIndex', d.id);
          let skillLevel;
          for (let i = 0; i < heroLevelLimits.length; ++i) {
            if (Number(heroLevel) >= heroLevelLimits[i]) {
              skillLevel = i + 1;
            }
          }
          if (skillLevel) {
            const levelData = levels.find(l => l.SkillLevel === skillLevel && l.ApplyType === 0);
            if (levelData) {
              heroStats.push(...statHelper.getSkillStatValues(d, levelData));
            }
          }
        }
      }

      return heroStats;
    },

    getStatCaps: function (level) {
      if (level > 0) {
        const index = dntData.findFast(DntFiles.statCaps, 'id', level);
        if (index.length === 1) {
          return dntData.getRow(DntFiles.statCaps, index[0]);
        }
      }

      return {};
    },

    getConversions: function (jobId) {
      if (jobId > 0) {
        const index = dntData.findFast(DntFiles.jobConversions, 'id', jobId);
        if (index.length === 1) {
          return dntData.getRow(DntFiles.jobConversions, index[0]);
        }
      }

      return {};
    },

    getBaseStats: function (level, jobId) {
      if (level > 0 && jobId > 0) {
        const index = dntData.findFast(DntFiles.jobBaseStats, 'id', (Number(jobId) * 100) + Number(level) - 100);
        if (index.length === 1) {
          return dntData.getRow(DntFiles.jobBaseStats, index[0]);
        }
      }

      return {};
    },
  };
}
