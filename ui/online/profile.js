(function () {
'use strict';
angular.module('dnsim').controller('ProfileCtrl', ['$timeout', 'saveHelper', login]);

function login($timeout, saveHelper) {
  'use strict';
  
  var vm = this;
  
  vm.builds = saveHelper.getSavedItems();
  
  var config = {
    apiKey: "AIzaSyC-Mckgho1xAI2SQzsKnpsr2ObDKOhdSrE",
    authDomain: "dngearsim.firebaseapp.com",
    databaseURL: "https://dngearsim.firebaseio.com",
    storageBucket: "dngearsim.appspot.com",
  };
  firebase.initializeApp(config);
  
  var auth = firebase.auth();
  
  auth.onAuthStateChanged(function(user) {
    vm.user = user;
    $timeout();
    
    firebase.database().ref('builds/' + vm.user.uid).on('value', function(storedBuilds) {
      vm.storedBuilds = storedBuilds.val();
      $timeout();
    });
    
    console.log('got user: ', user);
  });
  
  this.save = function(buildName, build) {
    firebase.database().ref('builds/' + vm.user.uid + '/' + buildName).set(angular.copy(build));
  }
  
  this.load = function(buildName, build) {

    var newGroupName = saveHelper.importGroup(buildName, build.items);
    
    saveHelper.renameSavedGroup(
      newGroupName, 
      newGroupName,
      build.enemyLevel,
      build.playerLevel,
      build.heroLevel,
      build.job,
      build.damageType,
      build.element,
      build.secondaryElement,
      build.enemyStatCaps, 
      build.playerStatCaps, 
      build.conversions, 
      build.baseStats, 
      build.heroStats);
      
    vm.builds = saveHelper.getSavedItems();
  }
  
  this.signOut = function() {
    auth.signOut().then(function() {
      // Sign-out successful.
    }, function(error) {
      // An error happened.
    });
  }
  
  this.resetPassword = function() {
    auth.sendPasswordResetEmail(vm.user.email).then(function() {
      // Email sent.
    }, function(error) {
      // An error happened.
    });
  }
  
}

})();