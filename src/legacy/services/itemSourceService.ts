import { ItemSource } from 'src/models/item-source';
import { Item } from 'src/models/item';
import { DntFiles } from 'src/values/dnt-files';

class ItemSourceImpl implements ItemSource {
  items: Item[];
  loading: boolean;
  mainDnt: string;
  potentialDnt: string;
  potentialDntEx: string;
  sparkDnt: string;
  gemSlotDnt: string;
  enchantDnt: string;
  enchantDnt2: string;
  gemDnt: string;
  partsDnt: string;
  petDnt: string;
  petLevelDnt: string;
  type: string;
  weaponDnt: string;
  setDnt: string;
  minLevel: number;
  minRank: number;
  ignoreErrors: boolean;

  constructor(public name: string, private dntData: any, private translations: any, private itemColumnsToLoad: any) {
  }

  reset() {
    this.items = null;
    this.loading = false;
  }

  init(progress, complete) {
    this.loading = true;

    if (this.items) {
      complete();
    } else {

      this.translations.init(progress, () => {
        this.doComplete(complete);
      });
      this.dntData.init(this.mainDnt, this.itemColumnsToLoad.mainDnt, progress, () => {
        this.doComplete(complete);
      }, this.ignoreErrors);
      if ('potentialDnt' in this) {
        this.dntData.init(this.potentialDnt, this.itemColumnsToLoad.potentialDnt, progress, () => {
          this.doComplete(complete);
        }, this.ignoreErrors);
      }
      if ('potentialDntEx' in this) {
        this.dntData.init(this.potentialDntEx, this.itemColumnsToLoad.potentialDnt, progress, () => {
          this.doComplete(complete);
        }, this.ignoreErrors);
      }
      if ('gemDnt' in this) {
        this.dntData.init(this.gemDnt, this.itemColumnsToLoad.gemDnt, progress, () => {
          this.doComplete(complete);
        }, this.ignoreErrors);
      }

      this.doComplete(complete);
    }
  }

  doComplete(complete) {
    if (this.translations.isLoaded() &&
      this.dntData.isLoaded(this.mainDnt) &&
      (!('potentialDnt' in this) || this.dntData.isLoaded(this.potentialDnt) || this.dntData.hasFailed(this.potentialDnt)) &&
      (!('potentialDntEx' in this) || this.dntData.isLoaded(this.potentialDntEx) || this.dntData.hasFailed(this.potentialDntEx)) &&
      (!('gemDnt' in this) || this.dntData.isLoaded(this.gemDnt) || this.dntData.hasFailed(this.gemDnt))
    ) {
      complete();
      this.loading = false;
    }
  }
}

angular.module('dnsim').factory('items',
  ['translations', 'dntData', 'itemColumnsToLoad', items]);
function items(translations, dntData, itemColumnsToLoad) {

  const itemSources = {
    title: null as ItemSource,
    tech: null as ItemSource,
    tman: null as ItemSource,
    gem: null as ItemSource,
    plate: null as ItemSource,
    plate95: null as ItemSource,
    items: null as ItemSource,
    eq: null as ItemSource,
    rbeq: null as ItemSource,
    pvpeq: null as ItemSource,
    cCommon: null as ItemSource,
    cClone: null as ItemSource,
    c2019: null as ItemSource,
    c2018: null as ItemSource,
    c2017: null as ItemSource,
    c2016: null as ItemSource,
    c2015: null as ItemSource,
    c2014: null as ItemSource,
    cash: null as ItemSource,
    event: null as ItemSource,
    xtras: null as ItemSource,
    imprint: null as ItemSource
  };

  for (const key of Object.keys(itemSources)) {
    itemSources[key] = new ItemSourceImpl(key, dntData, translations, itemColumnsToLoad);
  }

  Object.assign(itemSources.title, {
      mainDnt: DntFiles.optimisedTitles,
      type: 'titles',
      minLevel: 0,
      minRank: 0
  });
  Object.assign(itemSources.tech, {
      mainDnt: 'itemtable_skilllevelup.optimised.json',
      potentialDnt: 'potentialtable.optimised.json',
      potentialDntEx: 'potentialtable_reboot.optimised.json',
      gemSlotDnt: 'dragonjewelslottable.json',
      type: 'techs',
      minLevel: 60,
      minRank: 0
  });
  Object.assign(itemSources.tman, {
      mainDnt: 'itemtable_talisman.optimised.json',
      type: 'talisman',
      potentialDnt: 'potentialtable_talismanitem.optimised.json',
      minLevel: 24,
      minRank: 0
  });
  Object.assign(itemSources.gem, {
      mainDnt: 'itemtable_dragonjewel.optimised.json',
      potentialDnt: 'potentialtable_dragonjewel.optimised.json',
      potentialDntEx: 'potentialtable_reboot.optimised.json',
      enchantDnt: 'enchanttable_dragonjewel.optimised.json',
      gemDnt: 'dragonjeweltable.optimised.json',
      type: 'gems',
      minLevel: 24,
      minRank: 3
  });
  Object.assign(itemSources.plate, {
      mainDnt: 'itemtable_glyph.optimised.json',
      potentialDnt: 'potentialtable_glyph.optimised.json',
      type: 'plates',
      minLevel: 16,
      minRank: 2
  });
  Object.assign(itemSources.plate95, {
      mainDnt: 'itemtable_glyph95.json',
      potentialDnt: 'potentialtable_glyph95.json',
      type: 'plates',
      minLevel: 1,
      minRank: 1,
      ignoreErrors: true
  });
  Object.assign(itemSources.items, {
      mainDnt: 'itemtable.optimised.json',
      partsDnt: 'partstable.optimised.json',
      weaponDnt: 'weapontable.optimised.json',
      enchantDnt: 'enchanttable.optimised.json',
      potentialDnt: 'potentialtable.optimised.json',
      setDnt: 'setitemtable.optimised.json',
      gemSlotDnt: 'dragonjewelslottable.json',
      type: 'equipment',
      minLevel: 80,
      minRank: 3
  });
  Object.assign(itemSources.eq, {
      mainDnt: 'itemtable_equipment.optimised.json',
      partsDnt: 'partstable_equipment.optimised.json',
      weaponDnt: 'weapontable_equipment.optimised.json',
      enchantDnt: 'enchanttable.optimised.json',
      potentialDnt: 'potentialtable.optimised.json',
      setDnt: 'setitemtable.optimised.json',
      gemSlotDnt: 'dragonjewelslottable.json',
      type: 'equipment',
      minLevel: 21,
      minRank: 3
  });
  Object.assign(itemSources.rbeq, {
      mainDnt: 'itemtable_reboot.optimised.json',
      partsDnt: 'partstable_reboot.optimised.json',
      weaponDnt: 'weapontable_reboot.optimised.json',
      enchantDnt: 'enchanttable_reboot.optimised.json',
      enchantDnt2: 'enchanttable_95.json',
      potentialDnt: 'potentialtable_reboot.optimised.json',
      setDnt: 'setitemtable.optimised.json',
      gemSlotDnt: 'dragonjewelslottable.json',
      type: 'equipment',
      minLevel: 24,
      minRank: 3
  });
  Object.assign(itemSources.pvpeq, {
      mainDnt: 'itemtable_pvp.optimised.json',
      partsDnt: 'partstable_pvp.optimised.json',
      weaponDnt: 'weapontable_pvp.optimised.json',
      enchantDnt: 'enchanttable.optimised.json',
      setDnt: 'setitemtable.optimised.json',
      type: 'equipment',
      gemSlotDnt: 'dragonjewelslottable.json',
      minLevel: 24,
      minRank: 3
  });
  Object.assign(itemSources.cCommon, {
      mainDnt: 'itemtable_commoncash.json',
      partsDnt: 'partstable_commoncash.json',
      weaponDnt: 'weapontable_commoncash.json',
      setDnt: 'setitemtable_cash.json',
      type: 'cash',
      minLevel: 0,
      ignoreErrors: true,
      minRank: 4
  });
  Object.assign(itemSources.cClone, {
      mainDnt: 'itemtable_cashclone.optimised.json',
      partsDnt: 'partstable_cashclone.optimised.json',
      type: 'cash',
      minLevel: 0,
      ignoreErrors: true,
      minRank: 4
  });
  Object.assign(itemSources.c2019, {
      mainDnt: 'itemtable_common2019.optimised.json',
      partsDnt: 'partstable_common2019.optimised.json',
      weaponDnt: 'weapontable_common2019.optimised.json',
      setDnt: 'setitemtable_cash.optimised.json',
      type: 'cash',
      minLevel: 0,
      ignoreErrors: true,
      minRank: 0
  });
  Object.assign(itemSources.c2018, {
      mainDnt: 'itemtable_common2018.optimised.json',
      partsDnt: 'partstable_common2018.optimised.json',
      weaponDnt: 'weapontable_common2018.optimised.json',
      setDnt: 'setitemtable_cash.optimised.json',
      type: 'cash',
      minLevel: 0,
      ignoreErrors: true,
      minRank: 0
  });
  Object.assign(itemSources.c2017, {
      mainDnt: 'itemtable_common2017.optimised.json',
      partsDnt: 'partstable_common2017.optimised.json',
      weaponDnt: 'weapontable_common2017.optimised.json',
      setDnt: 'setitemtable_cash.optimised.json',
      type: 'cash',
      minLevel: 0,
      ignoreErrors: true,
      minRank: 0
  });
  Object.assign(itemSources.c2016, {
      mainDnt: 'itemtable_common2016.optimised.json',
      partsDnt: 'partstable_common2016.optimised.json',
      weaponDnt: 'weapontable_common2016.optimised.json',
      setDnt: 'setitemtable_cash.optimised.json',
      type: 'cash',
      minLevel: 0,
      minRank: 0
  });
  Object.assign(itemSources.c2015, {
      mainDnt: 'itemtable_common2015.optimised.json',
      partsDnt: 'partstable_common2015.optimised.json',
      weaponDnt: 'weapontable_common2015.optimised.json',
      setDnt: 'setitemtable_cash.optimised.json',
      type: 'cash',
      minLevel: 0,
      minRank: 0
  });
  Object.assign(itemSources.c2014, {
      mainDnt: 'itemtable_common2014.optimised.json',
      partsDnt: 'partstable_common2014.optimised.json',
      weaponDnt: 'weapontable_common2014.optimised.json',
      setDnt: 'setitemtable_cash.optimised.json',
      type: 'cash',
      minLevel: 0,
      minRank: 0
  });
  Object.assign(itemSources.cash, {
      mainDnt: 'itemtable_cash.optimised.json',
      partsDnt: 'partstable_cash.optimised.json',
      weaponDnt: 'weapontable_cash.optimised.json',
      setDnt: 'setitemtable_cash.optimised.json',
      type: 'cash',
      minLevel: 0,
      minRank: 0
  });
  Object.assign(itemSources.event, {
      mainDnt: 'itemtable_event.optimised.json',
      partsDnt: 'partstable_event.optimised.json',
      weaponDnt: 'weapontable_event.optimised.json',
      setDnt: 'setitemtable_cash.optimised.json',
      type: 'cash',
      minLevel: 0,
      minRank: 0
  });
  Object.assign(itemSources.xtras, {
      mainDnt: 'itemtable_vehicle.optimised.json',
      partsDnt: 'vehiclepartstable.optimised.json',
      setDnt: 'setitemtable_cash.optimised.json',
      petDnt: 'vehicletable.json',
      petLevelDnt: 'petleveltable.json',
      type: 'xtras',
      minLevel: 0,
      minRank: 0
  });
  Object.assign(itemSources.imprint, {
      mainDnt: 'itemtable_imprinting.optimised.json',
      type: 'imprint',
      minLevel: 0,
      minRank: 0
  });

  return itemSources;
}
