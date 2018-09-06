(function () {
'use strict';

angular.module('dnsim').factory('uiTranslations', uiTranslations);

// translations for each region go in here
// the key is the english text
var uiTranslationLookup = {
    na: {
        1000128908: 'Tier 3',
        1000128979: 't4?'
    },
    cdn: {
        'dragon nest gear simulator': '龙之谷配装模拟器',
        'enemy lvl': '敌人等级',
        'damage type': '伤害类型',
        'player lvl': '玩家等级',
        'hero level stats': '英雄等级状态',
        'naked stats': '裸装状态',
        'stat affects': '状态影响',
        'str': '力量',
        'agi': '敏捷',
        'int': '智力',
        'builds': '方案',
        'search': '搜索',
        'select region': '选择地区',
        'create a new build': '创建一个新方案',
        'import': '输入',
        'publish': '发布',
        'find a build': '寻找一个新方案',
        'about': '关于',
        'import a build from a json build file': '从一个json文件导入方案',
        'log in and publish your builds online': '登录并发布您的方案',
        'vit': '体质',
        'fd': '最终伤害',
        'pdmg': '物理攻击力',
        'mdmg': '魔法攻击力',
        'crit': '致命一击',
        'cdmg': '致命一击伤害',
        'fire%': '火攻击',
        'ice%': '水攻击',
        'light%': '光攻击',
        'dark%': '暗攻击',
        'pdef': '物理防御力',
        'mdef': '魔法防御力',
        'weapons': '武器',
        'armour': '防具',
        'techs': '技巧饰品',
        'titles': '称号',
        'expedition plates': '远征队纹章',
        'enhancement plates': '强化纹章',
        'increasing gems': '强化龙玉',
        'offensive gems': '属性龙玉',
        'back': '返回',
        'cancel': '取消',
        'epic': 'A级',
        'unique': 'S级',
        'legendary': 'L级',
        'quick add': '快速添加',
        'hero lvl': '英雄等级'
    },
    sea: {
        'offensive gems':  'offensive jades',
        'increasing gems':  'increasing jades',
        'expedition plates': 'unique heraldry',
        'enhancement plates': 'normal heraldry',
        'techs': 'skill accessory',
    },
};

// this function gets called on language change to add the translations to the main list
function uiTranslations($routeParams, $rootScope) {
    return {
        addTranslations: function(region, data) {
            if(region && data && region in uiTranslationLookup) {
                var regionData = uiTranslationLookup[region];
                for(var key in regionData) {
                    data[key] = regionData[key];
                }
            }
        }
    }
}

})();
