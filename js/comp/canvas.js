var config = require('global/config');
const COL = config.MAX_COL;
const ROW = config.MAX_ROW;
const canvasWidthRate = 6;
const canvasHeightRate = 6;
const headHeight = 100;
var docElem = document.documentElement;

exports.calSize = function () {
    var docWidth = docElem.clientWidth;
    var docHeight = docElem.clientHeight - headHeight;
    if (docWidth * canvasHeightRate > docHeight * canvasWidthRate) {
        var cheight = Math.max(320, docHeight);
        var cwidth = Math.ceil(cheight * canvasWidthRate / canvasHeightRate);
    } else {
        cwidth = docWidth;
        cheight = Math.ceil(cwidth * canvasHeightRate / canvasWidthRate);
    }

    return {
        h: cheight,
        w: cwidth
    };
};
exports.getCellSize = function () {
    var w = Math.floor(exports.w / COL);
    var h = Math.floor(exports.h / ROW);
    return {w, h};
};
var size = exports.calSize();
exports.w = size.w;
exports.h = size.h;
