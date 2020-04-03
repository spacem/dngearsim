import { DntFiles } from 'src/values/dnt-files';
import { StatLookup } from 'src/values/stat-values';

angular.module('dnsim').component('dngearsimHeroTitles', {
  scope: {},
  bindToController: {
  },
  controller: ['dntData', 'saveHelper', 'statHelper', 'itemCategory', 'itemFactory', 'translations', 'hCodeValues', skillSearchCtrl],
  template: require('!raw-loader!./hero-titles.html').default
});

function skillSearchCtrl(dntData, saveHelper, statHelper, itemCategory, itemFactory, translations, hCodeValues) {

  this.assigned = true;
  this.unassigned = true;
  this.hideIgnored = true;
  this.sortByName = true;

  this.selected = [];
  this.hidden = [];
  this.stats = [];

  this.$onInit = async () => {
    this.load();
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
    }

    this.useStats = Object.values(StatLookup).filter(s =>
      s.summaryDisplay && this.currentStats && this.currentStats.find(cs => cs.id === s.id) != null);

    this.titles = allTitles.filter(t => t.heroStats && t.heroStats.length);
    if (this.build) {
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
    }
    this.sort();
    this.setupStats();
  };

  this.switchSortStat = (stat) => {
    this.sortByName = false;
    this.sortStat = stat;
    this.sort();
  };

  this.sort = () => {
    this.titles = this.titles.sort((t1, t2) => {
      if (this.sortByName) {
        return t1.name.localeCompare(t2.name);
      } else {
        return t2.affectAmounts[this.sortStat.id] - t1.affectAmounts[this.sortStat.id];
      }
    });
    this.displayTitles = [];
    this.showMoreResults();
  };

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
      this.changeSearch();
    }
  };

  this.calcStatPercent = (newVal, origVal) => {
    if (newVal && origVal) {
      return Math.round(10000 * ((newVal - origVal) / origVal)) / 100;
    } else {
      return 0;
    }
  };

  this.isHidden = (id) => {
    return this.hidden.indexOf(id) !== -1;
  };

  this.isSelected = (id) => {
    return this.selected.indexOf(id) !== -1;
  };

  this.hide = (id) => {
    if (this.isHidden(id)) {
      this.hidden = this.hidden.filter(h => h !== id);
    } else {
      this.hidden.push(id);
      if (this.isSelected(id)) {
        this.selected = this.selected.filter(h => h !== id);
      }
    }
    this.changeSearch();
    this.setupStats();
    this.save();
  };

  this.select = (id) => {
    if (this.isSelected(id)) {
      this.selected = this.selected.filter(h => h !== id);
    } else {
      this.selected.push(id);
      if (this.isHidden(id)) {
        this.hidden = this.hidden.filter(h => h !== id);
      }
    }
    this.changeSearch();
    this.setupStats();
    this.save();
  };

  this.changeSearch = () => {
    this.displayTitles = this.filterTitles().splice(0, this.maxDisplay);
  };

  this.setupStats = () => {
    const allStats = [];
    for (const id of this.selected) {
      const title = this.titles.find(t => t.id === id);
      if (title) {
        allStats.push(...title.heroStats);
      }
    }

    this.stats = hCodeValues.mergeStats(allStats);
  };

  this.filterTitles = () => {
    return this.titles.filter(t => {
      if (this.hideIgnored && this.isHidden(t.id)) {
        return false;
      }
      if (!this.assigned && this.isSelected(t.id)) {
        return false;
      }
      if (!this.unassigned && !this.isSelected(t.id)) {
        return false;
      }
      if (this.nameSearch) {
        let nameSearches = this.nameSearch.split(' ');
        if (nameSearches.length == 0) {
          nameSearches = [this.nameSearch];
        }
        for (let ns = 0; ns < nameSearches.length; ++ns) {
          if (t.name && t.name.toString().toUpperCase().indexOf(nameSearches[ns].toUpperCase()) === -1) {
            return false;
          }
        }
      }
      return true;
    });
  };

  this.save = () => {
    localStorage.setItem('dnsim-hero-title-stats', JSON.stringify(this.stats));
    localStorage.setItem('dnsim-hero-titles', JSON.stringify(this.selected));
    localStorage.setItem('dnsim-hidden-hero-titles', JSON.stringify(this.hidden));
  };

  this.load = () => {
    const selected = localStorage.getItem('dnsim-hero-titles');
    if (selected) {
      this.selected = JSON.parse(selected);
    }
    const hidden = localStorage.getItem('dnsim-hidden-hero-titles');
    if (hidden) {
      this.hidden = JSON.parse(hidden);
    }
  };
}
