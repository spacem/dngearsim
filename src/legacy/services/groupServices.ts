import * as angular from 'angular';

angular.module('dnsim').factory('groupHelper', ['exportLinkHelper', groupHelper]);
function groupHelper(exportLinkHelper) {
  'use strict';

  return {
    reloadGroup: function (groupName, group) {
      var newItems = [];
      angular.forEach(group.items, function (item, key) {
        var newItem = exportLinkHelper.reloadItem(item);
        if (newItem) {
          newItems.push(newItem);
        }
      });

      return newItems;
    },

    getDntFiles: function (group) {

      var allDntFiles = {};
      angular.forEach(group.items, function (item, key1) {

        var dntFiles = exportLinkHelper.getDntFiles(item);

        angular.forEach(dntFiles, function (value, key) {
          allDntFiles[key] = value;
        });
      });

      return allDntFiles;
    }
  }
}
