(function () {
'use strict';

angular.module('dnsim').config(['$routeProvider', config]);

function config($routeProvider) {

  $routeProvider.
  
    when('/about', {
      template: require('./about/about.html'),
      controller: 'AboutCtrl as about'
    }).
    
    when('/setup', {
      template: require('./nav/setup.html'),
      controller: 'SetupCtrl'
    }).
    
    when('/items', {
      template: require('./search/everything-search.html'),
      controller: 'ItemsCtrl as items',
      reloadOnSearch: false,
    }).
    
    when('/', {
      template: require('./welcome.html'),
    }).
    when('/builds', {
      template: require('./builds/build-list.html'),
      controller: 'BuildListCtrl as buildList'
    }).
    when('/build', {
      template: require('./builds/build-list.html'),
      controller: 'BuildListCtrl as buildList'
    }).
    when('/view-group', {
      template: require('./builds/view-group.html'),
      controller: 'ViewGroupCtrl'
    }).
    when('/edit-build', {
      template: require('./builds/edit-build.html'),
      controller: 'EditBuildCtrl as editGroup',
      // reloadOnSearch: false,
    }).
    when('/new-build', {
      template: require('./builds/edit-build.html'),
      controller: 'EditBuildCtrl as editGroup',
      // reloadOnSearch: false,
    }).
    when('/delete-build', {
      template: require('./builds/delete-build.html'),
      controller: 'DeleteBuildCtrl as deleteBuild',
      // reloadOnSearch: false,
    }).
    when('/reload-build', {
      template: require('./builds/reload-build.html'),
      controller: 'ReloadBuildCtrl as ctrl',
      // reloadOnSearch: false,
    }).
    
    when('/search', {
      template: require('./search/search.html'),
      controller: 'ItemSearchCtrl as ctrl',
      reloadOnSearch: false,
    }).
    
    when('/item', {
      template: require('./item/item.html'),
      controller: 'ItemCtrl',
      // reloadOnSearch: false,
    }).
    when('/item', {
      template: require('./item/item.html'),
      controller: 'ItemCtrl',
      // reloadOnSearch: false,
    }).
    
    when('/export', {
      template: require('./nav/export.html'),
      controller: 'ExportCtrl',
    }).
    
    when('/talismans', {
      template: require('./builds/build-talismans.html'),
      controller: 'BuildTalismansCtrl as ctrl',
    }).
    
    when('/publish', {
      template: require('./online/publish.html'),
      controller: 'PublishCtrl as ctrl',
    }).
    
    when('/profile', {
      template: require('./online/profile.html'),
      controller: 'ProfileCtrl as ctrl',
    }).
    
    when('/published', {
      template: require('./online/published.html'),
      controller: 'PublishedCtrl as ctrl',
    }).
    
    when('/import', {
      template: require('./builds/build-import.html'),
      controller: 'BuildImportCtrl as ctrl',
    }).
    
    when('/published', {
      template: require('./online/published.html'),
      controller: 'PublishedCtrl as ctrl',
    }).
    
    when('/build-search', {
      template: require('./online/build-search.html'),
      controller: 'BuildSearchCtrl as ctrl',
    }).
    
    otherwise({
      redirectTo: '/'
    });
}

})();