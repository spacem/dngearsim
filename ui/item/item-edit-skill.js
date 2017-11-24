angular.module('dnsim').controller('itemEditSkillCtrl',

['$timeout','dntData','statHelper',
function($timeout,dntData,statHelper) {
  'use strict';
  
  if(this.item == null) return;
  if(this.item.itemSource != 'skills') {
    return;
  }
  
  if(!this.item.enchantmentNum) {
    this.item.enchantmentNum = 1;
  }
  
  var vm = this;
  
  function getDntFile() {
    return 'skillleveltable_character' + vm.item.baseJobName + vm.item.pve + '.lzjson';
  }
  
  this.initSkills = function() {
    var dntFile = getDntFile();
    dntData.init(dntFile, null, reportProgress, function() { $timeout(function() {
      vm.skillData = dntData.find(dntFile, 'SkillIndex', vm.item.id);
    })});
  }
  
  this.nextEnchantment = function() {
    if(this.skillData && this.item.enchantmentNum < this.skillData.length) {
      this.item.enchantmentNum++;
      vm.onChange();
    }
  }
  
  this.isMaxSkillLevel = function() {
    return this.skillData && this.item && this.item.enchantmentNum >= this.skillData.length;
  }
  
  this.prevEnchantment = function() {
    if(this.item.enchantmentNum > 0) {
      this.item.enchantmentNum--;
    }
    else {
      this.item.enchantmentNum = 0;
    }

    vm.onChange();
  }
  
  function reportProgress(msg) {
    // console.log('progress: ' + msg);
  }
  
  dntData.init(getDntFile(), null, null, vm.initSkills);

}])
.directive('dngearsimItemEditSkill', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
      onChange: '&onChange',
    },
    controller: 'itemEditSkillCtrl',
    controllerAs: 'editCtrl',
    template: require('./item-edit-skill.html')
  };
});