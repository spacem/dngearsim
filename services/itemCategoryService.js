(function () {
'use strict';

angular.module('dnsim').factory('itemCategory',
['translations','dntData','hCodeValues','itemColumnsToLoad',itemCategory]);
function itemCategory(translations,dntData,hCodeValues,itemColumnsToLoad) {

  return {
    categories: [
      {path: 'search/titles', name:'titles'},
      {path: 'search/weapons', name:'weapons'},
      {path: 'search/armour', name:'armour'},
      {path: 'search/accessories', name:'accessories'},
      {path: 'search/techs', name:'techs'},
      {path: 'search/offensive gems', name:'offensive gems'},
      {path: 'search/increasing gems', name:'increasing gems'},
      {path: 'search/plates', name:'plates'},
      {path: 'search/talisman', name:'talisman'},
      {path: 'search/cash', name:'cash'},
      {path: 'search/skills', name:'skills'},
      {path: 'search/custom', name:'custom'},
      ],
  }
}

})();