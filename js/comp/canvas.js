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
    var w = exports.cellWidth;
    var h = exports.cellHeight;
    return {w, h};
};
exports.getCellOffset = function (row) {
    return -exports.h;
};
exports.calCellPosition = function (row, col) {
    return {
        x: exports.cellWidth * col,
        y: exports.cellHeight * (ROW - row - 1)
    };
};
var size = exports.calSize();
exports.w = size.w;
exports.h = size.h;
exports.cellWidth = Math.floor(exports.w / COL);
exports.cellHeight = Math.floor(exports.h / ROW);