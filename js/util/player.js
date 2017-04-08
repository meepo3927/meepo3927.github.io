
var Resource = require('global/resource.js');
var Msg = require('comp/msg.js');
var TYPES_MAP = Resource.TYPES_MAP;

exports.getDefaultProperty = () => {
    return {
        level: 1,
        hp: 100,
        gold: 0,
        mana: 0,
        exp: 0
    };
};

exports.collect = function (p, list) {
    let countMap = {};
    list.forEach((cell) => {
        let type = cell.type;
        countMap[type] = countMap[type] ? (countMap[type] + 1) : 1;
    });

    for (let type in countMap) {
        let num = countMap[type];
        // 获得金币
        if (type === 'coin') {
            let text = Resource.TYPES_TEXT_MAP[type];
            p.gold += num;
            Msg.pop(`获得${num}${text}`);
        }
    }
};