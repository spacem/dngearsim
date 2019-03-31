import { DntFiles } from 'src/values/dnt-files';
import { Stat } from 'src/models/stat';

export class CharacterService {
  constructor(private dntData, private itemColumnsToLoad, private jobs, private hCodeValues, private statHelper) {
  }

  async init(complete) {
    await this.jobs.init();
    await this.dntData.init(DntFiles.jobConversions, this.itemColumnsToLoad.jobConversionColsToLoad, null, null, false);
    await this.dntData.init(DntFiles.statCaps, this.itemColumnsToLoad.statCapColsToLoad, null, null, false);
    await this.dntData.init(DntFiles.jobBaseStats, this.itemColumnsToLoad.jobBaseStatColsToLoad, null, null, false);
    await this.dntData.init(DntFiles.heroLevels, null, null, null, false);
    await this.dntData.init(DntFiles.heroLevelPotentials, null, null, null, false);
    await this.dntData.init(DntFiles.totalSkills, null, null, null, false);
    await this.dntData.init(DntFiles.totalSkillLevels, null, null, null, false);
    await this.dntData.init(DntFiles.totalSkillHeroLevels, null, null, null, false);
    complete();
  }

  getHeroStats(heroLevel: number) {
    const heroStats: Stat[] = [];
    if (heroLevel > 0) {

      const heroLevelData = this.getHeroLevelData(heroLevel);
      if (heroLevelData) {
        const p = this.getHeroLevelPotential(heroLevelData);
        if (p) {
          heroStats.push(...this.hCodeValues.getStats(p));
        }
      }

      const heroSkillStats = this.getHeroSkillStats(heroLevel);
      heroStats.push(...heroSkillStats);
    }
    return heroStats;
  }

  private getHeroSkillStats(heroLevel: number) {
    const stats: Stat[] = [];
    const totalDatas = this.dntData.getData(DntFiles.totalSkillHeroLevels);
    for (const t of totalDatas) {
      if (t.HeroLevelLimit) {
        const heroLevelLimits = t.HeroLevelLimit.split(';').map(l => Number(l));
        const datas = this.dntData.find(DntFiles.totalSkills, 'id', t.SkillTableID);
        for (const d of datas) {
          const levels = this.dntData.find(DntFiles.totalSkillLevels, 'SkillIndex', d.id);
          let skillLevel;
          for (let i = 0; i < heroLevelLimits.length; ++i) {
            if (heroLevel >= heroLevelLimits[i]) {
              skillLevel = i + 1;
            }
          }
          if (skillLevel) {
            const levelData = levels.find(l => l.SkillLevel === skillLevel && l.ApplyType === 0);
            if (levelData) {
              stats.push(...this.statHelper.getSkillStatValues(d, levelData));
            }
          }
        }
      }
    }

    return stats;
  }

  private getHeroLevelData(heroLevel) {
    const indexes = this.dntData.findFast(DntFiles.heroLevels, 'id', heroLevel);
    if (indexes.length === 1) {
      return this.dntData.getRow(DntFiles.heroLevels, indexes[0]);
    }
  }

  private getHeroLevelPotential(heroLevelRow) {
    const pIndex = this.dntData.findFast(DntFiles.heroLevelPotentials, 'PotentialID', heroLevelRow.HeroLevelAbilityID);
    if (pIndex.length === 1) {
      return this.dntData.getRow(DntFiles.heroLevelPotentials, pIndex[0]);
    }
  }

  getStatCaps(level) {
    if (level > 0) {
      const index = this.dntData.findFast(DntFiles.statCaps, 'id', level);
      if (index.length === 1) {
        return this.dntData.getRow(DntFiles.statCaps, index[0]);
      }
    }

    return {};
  }

  getConversions(jobId) {
    if (jobId > 0) {
      const index = this.dntData.findFast(DntFiles.jobConversions, 'id', jobId);
      if (index.length === 1) {
        return this.dntData.getRow(DntFiles.jobConversions, index[0]);
      }
    }

    return {};
  }

  getBaseStats(level, jobId) {
    if (level > 0 && jobId > 0) {
      const index = this.dntData.findFast(DntFiles.jobBaseStats, 'id', (Number(jobId) * 100) + Number(level) - 100);
      if (index.length === 1) {
        return this.dntData.getRow(DntFiles.jobBaseStats, index[0]);
      }
    }

    return {};
  }
}