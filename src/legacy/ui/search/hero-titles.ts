import { DntFiles } from 'src/values/dnt-files';
import { StatLookup } from 'src/values/stat-values';

angular.module('dnsim').component('dngearsimHeroTitles', {
  scope: {},
  bindToController: {
  },
  controller: ['dntData', 'saveHelper', 'statHelper', 'itemCategory', 'itemFactory', 'translations', skillSearchCtrl],
  template: require('./hero-titles.html')
});

function skillSearchCtrl(dntData, saveHelper, statHelper, itemCategory, itemFactory, translations) {

  this.$onInit = async () => {
    this.maxDisplay = 30;
    await itemCategory.init('titles');

    this.savedItems = saveHelper.getSavedItems();
    this.buildNames = Object.keys(this.savedItems);
    if (!this.buildNames) {
      this.buildNames = [];
    }

    if (this.buildNames.length > 0) {
      this.setBuild(saveHelper.getCurrentBuild());
    } else {
      this.setBuild();
    }

    const allTitles = itemCategory.getItems('titles');
    for (const t of allTitles) {
      itemFactory.initItem(t);
      t.stats = t.heroStats;
    }

    this.useStats = Object.values(StatLookup).filter(s => s.summaryDisplay && this.currentStats.find(cs => cs.id === s.id) != null);

    this.titles = allTitles.filter(t => t.heroStats && t.heroStats.length);
    for (const t of this.titles) {
      const newItems = [t, ...this.build.items];
      const newStats = statHelper.getCalculatedStatsFromItems(this.build, newItems);
      t.affectAmounts = {};
      for (const s of this.useStats) {
        t.affectAmounts[s.id] =
          this.calcStatPercent(
            this.getStat(s.id, newStats).max,
            this.getStat(s.id, this.currentStats).max);
      }
    }
    this.sortStat = this.useStats[0];
    this.sort();
  };

  this.switchSortStat = () => {
    const index = this.useStats.indexOf(this.sortStat);
    if (index + 1 >= this.useStats.length) {
      this.sortStat = this.useStats[0];
    } else {
      this.sortStat = this.useStats[index + 1];
    }
    this.sort();
  };

  this.sort = () => {
    this.titles = this.titles.sort((t1, t2) => {
      return t2.affectAmounts[this.sortStat.id] - t1.affectAmounts[this.sortStat.id];
    });
    this.displayTitles = [];
    this.showMoreResults();
  }

  this.getStat = (id, stats) => {
    var len = stats.length;
    for (var i = 0; i < len; ++i) {
      if (stats[i].id == id) {
        return stats[i];
      }
    }
    return { id: id, max: 0 };
  };

  this.setBuild = (buildName) => {
    this.buildName = buildName;
    this.build = this.savedItems[buildName];
    if (this.build) {
      this.currentStats = statHelper.getCalculatedStatsFromItems(this.build, this.build.items);
    }
  };

  this.showMoreResults = () => {
    if (this.titles) {
      this.maxDisplay += 18;
      this.displayTitles = [...this.titles].splice(0, this.maxDisplay);
    }
  };


  this.calcStatPercent = (newVal, origVal) => {
    if (newVal && origVal) {
      return Math.round(10000 * ((newVal - origVal) / origVal)) / 100;
    } else {
      return 0;
    }
  };
}
