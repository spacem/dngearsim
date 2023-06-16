module.exports = [

  {
    mainDnt: 'appellationtable',
    type: 'titles',
    minLevel: 0,
    minRank: 0
  },
  // wspr: { mainDnt: 'itemtable_source', type: 'wellspring', minLevel: 24 },

  {
    mainDnt: 'itemtable_skilllevelup',
    potentialDnt: 'potentialtable',
    type: 'techs',
    minLevel: 70,
    minRank: 0
  },

  {
    mainDnt: 'itemtable_talisman',
    type: 'talisman',
    potentialDnt: 'potentialtable_talismanitem',
    minLevel: 70,
    minRank: 0
  },

  {
    mainDnt: 'itemtable_dragonjewel',
    potentialDnt: 'potentialtable_dragonjewel',
    enchantDnt: 'enchanttable_dragonjewel',
    gemDnt: 'dragonjeweltable',
    type: 'gems',
    minLevel: 70,
    minRank: 0
  },

  {
    mainDnt: 'itemtable_glyph',
    potentialDnt: 'potentialtable_glyph',
    type: 'plates',
    minLevel: 60,
    minRank: 2
  },

  {
    mainDnt: 'itemtable_glyph95',
    potentialDnt: 'potentialtable_glyph95',
    type: 'plates',
    minLevel: 60,
    minRank: 1,
  },

  {
    mainDnt: 'itemtable',
    partsDnt: 'partstable',
    weaponDnt: 'weapontable',
    enchantDnt: 'enchanttable',
    potentialDnt: 'potentialtable',
    setDnt: 'setitemtable',
    type: 'equipment',
    minLevel: 70,
    minRank: 3
  },

  {
    mainDnt: 'itemtable_equipment',
    partsDnt: 'partstable_equipment',
    weaponDnt: 'weapontable_equipment',
    enchantDnt: 'enchanttable',
    potentialDnt: 'potentialtable',
    setDnt: 'setitemtable',
    type: 'equipment',
    minLevel: 70,
    minRank: 3
  },
  {
    mainDnt: 'itemtable_reboot',
    partsDnt: 'partstable_reboot',
    weaponDnt: 'weapontable_reboot',
    enchantDnt: 'enchanttable_reboot',
    enchantDnt2: 'enchanttable_95',
    potentialDnt: 'potentialtable_reboot',
    setDnt: 'setitemtable',
    type: 'equipment',
    minLevel: 70,
    minRank: 3
  },
  {
    mainDnt: 'itemtable_pvp',
    partsDnt: 'partstable_pvp',
    weaponDnt: 'weapontable_pvp',
    enchantDnt: 'enchanttable',
    setDnt: 'setitemtable',
    type: 'equipment',
    minLevel: 70,
    minRank: 3
  },
  {
    mainDnt: 'itemtable_cashclone',
    partsDnt: 'partstable_cashclone',
    type: 'cash',
    minLevel: 0,
    minRank: 4
  },
  {
    mainDnt: 'itemtable_common2019',
    partsDnt: 'partstable_common2019',
    weaponDnt: 'weapontable_common2019',
    setDnt: 'setitemtable_cash',
    type: 'cash',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_common2018',
    partsDnt: 'partstable_common2018',
    weaponDnt: 'weapontable_common2018',
    setDnt: 'setitemtable_cash',
    type: 'cash',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_common2017',
    partsDnt: 'partstable_common2017',
    weaponDnt: 'weapontable_common2017',
    setDnt: 'setitemtable_cash',
    type: 'cash',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_common2016',
    partsDnt: 'partstable_common2016',
    weaponDnt: 'weapontable_common2016',
    setDnt: 'setitemtable_cash',
    type: 'cash',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_common2015',
    partsDnt: 'partstable_common2015',
    weaponDnt: 'weapontable_common2015',
    setDnt: 'setitemtable_cash',
    type: 'cash',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_common2014',
    partsDnt: 'partstable_common2014',
    weaponDnt: 'weapontable_common2014',
    setDnt: 'setitemtable_cash',
    type: 'cash',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_cash',
    partsDnt: 'partstable_cash',
    weaponDnt: 'weapontable_cash',
    setDnt: 'setitemtable_cash',
    type: 'cash',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_event',
    partsDnt: 'partstable_event',
    weaponDnt: 'weapontable_event',
    setDnt: 'setitemtable_cash',
    type: 'cash',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_vehicle',
    partsDnt: 'vehiclepartstable',
    setDnt: 'setitemtable_cash',
    type: 'xtras',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_imprinting',
    type: 'imprint',
    minLevel: 0,
    minRank: 0
  },
  // project duck specific files
  {
    mainDnt: 'itemtable_pdcashevent',
    type: 'cash',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_pdcashitems',
    type: 'cash',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_pdcostumes',
    partsDnt: 'partstable_pdcostumes',
    type: 'cash',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_pddragongem',
    type: 'gems',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_pdequipetc',
    enchantDnt: 'enchanttable_pdequip',
    gemSlotDnt: 'dragonjewelslottable',
    type: 'equipment',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_pdglyph',
    potentialDnt: 'potentialtable_pdglyph',
    type: 'plates',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_pdtalisman',
    potentialDnt: 'potentialtable_pdtalisman',
    type: 'talisman',
    minLevel: 0,
    minRank: 0
  },
  {
    mainDnt: 'itemtable_pdcapes',
    potentialDnt: 'partstable_pdcapes',
    type: 'cash',
    minLevel: 0,
    minRank: 0
  }
];
