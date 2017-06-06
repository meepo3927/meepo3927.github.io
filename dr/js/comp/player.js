var Resource = require('global/resource.js');
var config = require('global/config.js');
var Msg = require('comp/msg.js');
var tool = require('util/tool');
const TYPES_MAP = Resource.TYPES_MAP;
const COLOR = config.color;
const classNameMap = {
    warrior: '战士',
    warlock: '术士',
    shaman: '萨满',
    rogue: '盗贼',
    priest: '牧师',
    paladin: '圣骑士',
    mage: '法师',
    hunter: '猎人',
    druid: '德鲁伊',
    dk: '死亡骑士',
    dh: '恶魔猎手'
};

function Player(options = {}) {
    let classId = options.classId;
    this.data = {
        classId,
        className: classNameMap[classId],
        level: 1,
        hp: 100,
        maxHp: 100,
        gold: 0,
        mana: 0,
        exp: 0
    };
    this.options = {};
    this.setOption(options);
}
let proto = Player.prototype;
proto.setOption = function (options) {
    this.options = tool.extend(this.options, options);
    if (this.options.id) {
        this.id = this.options.id;
    }
    if (this.options.enemy) {
        this.enemy = this.options.enemy;
    }
};
/**
 * 收集
 */
proto.collect = function (list) {
    let countMap = {};
    list.forEach((cell) => {
        let type = cell.type;
        countMap[type] = countMap[type] ? (countMap[type] + 1) : 1;
    });

    var allCount = 0;
    for (let type in countMap) {
        let num = countMap[type];
        allCount += num;
        // 获得金币
        if (type === 'coin') {
            this.addGold(num);
        }
        // 刀
        if (type === 'sword') {
            this.attack(num);
        }
    }
    this.addExp(allCount);
};
/**
 * 增加金币
 */
proto.addGold = function (num) {
    this.data.gold += num;
    let text = Resource.TYPES_TEXT_MAP.coin;
    this.showMyMsg(`+${num}${text}`, {
        color: COLOR.gold
    });
};
/**
 * 增加经验
 */
proto.addExp = function (num) {
    this.data.exp += num;
};
/**
 * 进行攻击
 */
proto.attack = function (num) {
    var damage = num * 1; // 攻击力
    this.enemy.beAttacked(damage);
};
/**
 * 被攻击
 */
proto.beAttacked = function (damage) {
    // 减伤.
    this.minusHP(damage);
};
/**
 * 减少HP
 */
proto.minusHP = function (val) {
    if (val < 0) {
        return false;
    }
    this.data.hp -= val;
    this.showMyMsg(`-${val}hp`, {
        color: COLOR.hp
    });
};
proto.showMyMsg = function (msg, options) {
    let position = this.id === 1 ? 'left' : 'right';
    let mOptions = tool.extend({position}, options);
    Msg.pop(msg, mOptions)
};

module.exports = Player;