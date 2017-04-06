var config = require('global/config');
var canvasComp = require('comp/canvas.js');
var canvasUtil = require('util/canvas.js');
let TYPES = [
    'icon'
];

let imageCanvasHolder = {};
let randtype = function () {
    return TYPES[0];
};
let getItemSrc = (type) => {
    return config.imgPath + '/items/' + type + '.png';
};

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