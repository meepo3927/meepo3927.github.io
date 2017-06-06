var config = require('global/config');
var canvasComp = require('comp/canvas.js');
var canvasUtil = require('util/canvas.js');
let TYPES = [
    'coin',
    'sword',
    'hp'
];

let TYPES_TEXT_MAP = {
    coin: '金币',
    sword: '刀',
    hp: '血瓶'
};

let imageCanvasHolder = {};
let randtype = function () {
    let n = (Math.random() * TYPES.length) | 0;
    return TYPES[n] || TYPES[TYPES.length - 1];
};
let getItemSrc = (type) => {
    return config.imgPath + '/items/' + type + '.png';
};
exports.TYPES_TEXT_MAP = TYPES_TEXT_MAP;
exports.imageCanvasHolder = imageCanvasHolder;
exports.getItemSrc = getItemSrc;
exports.randtype = randtype;
exports.load = function (callback) {
    callback = callback || function () {};
    var count = 0;
    var layer;
    var timer = setTimeout(() => {
        layer = mlayer.loading();
    }, 200);
    var done = function () {
        clearTimeout(timer);
        layer && layer.close();
        callback();
    };
    TYPES.forEach((type) => {
        var img = new Image();
        img.src = getItemSrc(type);
        img.onload = () => {
            count++;
            imageCanvasHolder[type] = canvasUtil.getImageCanvas(
                img,
                canvasComp.cellWidth,
                canvasComp.cellHeight
            );
            if (count === TYPES.length) {
                done();
            }
        };
    });
};