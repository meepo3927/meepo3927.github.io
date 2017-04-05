var config = require('global/config');

let TYPES = [
    'icon'
];
let imgs = {};
let randtype = function () {
    return TYPES[0];
};
let getItemSrc = (type) => {
    return config.imgPath + '/items/' + type + '.png';
};
exports.imgs = imgs;
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
        imgs[type] = img;
        img.src = getItemSrc(type);
        img.onload = () => {
            count++;
            if (count === TYPES.length) {
                done();
            }
        };
    });
};