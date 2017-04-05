var config = require('global/config');

let TYPES = [
    'icon'
];
let randtype = function () {
    return TYPES[0];
};
let getItemSrc = (type) => {
    return config.imgPath + '/items/' + type + '.png';
};
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
            if (count === TYPES.length) {
                done();
            }
        };
    });
};