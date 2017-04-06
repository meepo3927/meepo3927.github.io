
var Cell = require('comp/cell.js');
var canvasComp = require('comp/canvas.js');
var config = require('global/config.js');
const MAX_COL = config.MAX_COL;
const MAX_ROW = config.MAX_ROW;
const CellWidth = canvasComp.cellWidth;
const CellHeight = canvasComp.cellHeight;
let cells = [];
let queue = [];
let each = (f) => {
    if (!f) {
        return;
    }
    for (let i = 0; i < MAX_COL; i++) {
        for (let j = 0; j < MAX_ROW; j++) {
            cells[i] && cells[i][j] && f(cells[i][j], j, i);
        }
    }
};
let inQueue = (cell) => {
    if (~queue.indexOf(cell)) {
        return true;
    }
    return false;
};
let removeCell = (cell) => {
    var col = cells[cell.col];
    col.splice(cell.row, 1);
    return cell;
};
let fillColumn = (column, col) => {
    while (column.length < MAX_ROW) {
        column.push(new Cell(column.length, col))
    }
};
let refill = () => {
    for (let col = 0; col < MAX_COL; col++) {
        let list = cells[col] || [];
        for (let row = 0; row < list.length; row++) {
            let cell = list[row];
            if (cell) {
                cell.repos(row, col);
            }
        }
        fillColumn(list, col);
    }
};
exports.removeQueueCells = function () {
    queue.forEach((cell) => {
        removeCell(cell);
    });
    refill();
};
exports.clearQueue = function () {
    queue.length = 0;
};
exports.push = (cell) => {
    if (!cell) {
        return false;
    }
    if (inQueue(cell)) {
        return false;
    }

    queue.push(cell);
};

exports.getCellByPoint = (x, y) => {
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
exports.each = each;
exports.init = () => {

    for (let i = 0; i < MAX_COL; i++) {
        cells[i] = [];
        fillColumn(cells[i], i);
    }
};

exports.queue = queue;