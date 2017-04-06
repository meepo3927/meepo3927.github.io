
var Cell = require('comp/cell.js');
var canvasComp = require('comp/canvas.js');
var config = require('global/config.js');
const MAX_COL = config.MAX_COL;
const MAX_ROW = config.MAX_ROW;
const CellWidth = canvasComp.cellWidth;
const CellHeight = canvasComp.cellHeight;
let cells = [];

exports.getCellByPoint = function (x, y) {
    var xUnit = (x / CellWidth) | 0;
    var yUnit = (y / CellHeight) | 0;
    // LOG('xunit:' + xUnit + '.yunit:' + yUnit);
    var col = xUnit;
    var row = MAX_ROW - yUnit - 1;
    var emptyGap = (CellWidth * 0.2) | 0;
    var xGap = Math.abs(xUnit * CellWidth - x);
    var yGap = Math.abs(yUnit * CellHeight - y);
    // LOG('xg:' + xGap + '.yg:' + yGap);
    if (xGap < emptyGap && yGap < emptyGap) {
        return null;
    }
    return cells[col] ? cells[col][row] : null;
};
exports.each = (f) => {
    if (!f) {
        return;
    }
    for (let i = 0; i < MAX_COL; i++) {
        for (let j = 0; j < MAX_ROW; j++) {
            cells[i] && f(cells[i][j], j, i);
        }
    }
};
exports.init = () => {

    for (let i = 0; i < MAX_COL; i++) {
        cells[i] = [];
        for (let j = 0; j < MAX_ROW; j++) {
            cells[i][j] = new Cell(j, i);
        }
    }
};