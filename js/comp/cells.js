
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
    var pos = col.indexOf(cell);
    if (pos >= 0) {
        col.splice(pos, 1);
    }
    cell.dispose();
    return cell;
};
let fillColumn = (column, col) => {
    let len = column.length;
    while (column.length < MAX_ROW) {
        column.push(new Cell(column.length, col, {
            len: len,
            mainContext: exports.mainContext,
            lineContext: exports.lineContext
        }))
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
/**
 * 队列中最后一个Cell
 * @return {Cell}
 */
const lastQueueCell = () => {
    return queue[queue.length - 1];
};
/**
 * 截断queue
 */
const cutQueue = (cell) => {
    var pos = queue.indexOf(cell);
    if (pos < 0) {
        return false;
    }
    for (let i = pos + 1; i < queue.length; i++) {
        queue[i].leaveQueue();
    }
    queue.length = pos + 1;
};
/**
 * 获取两点距离
 * @return {integer}
 */
const getDistance = (c1, c2) => {
    var xdiff = Math.abs(c1.col - c2.col);
    var ydiff = Math.abs(c1.row - c2.row);
    return Math.max(xdiff, ydiff);
};
/**
 * 进队列
 * @param  {Cell}
 */
const push = (cell) => {
    if (!cell) {
        return false;
    }

    queue.push(cell);
};
// 根据(第一个)选中的类型绘画
// 规则：只能选择同类型的
exports.drawByType = function (cell = queue[0]) {
    if (!cell) {
        return false;
    }
    let type = cell.type;
    each((cell) => {
        cell.drawByType(type);
    });
};
/**
 * 画队列路径线
 */
exports.drawQueuePath = () => {
    var cxt = exports.lineContext;
    // 黑
    cxt.strokeStyle = 'rgba(0, 0, 0, .8)';
    cxt.lineWidth = 6;
    exports.lineToQueue(cxt);
    // 绿
    cxt.strokeStyle = 'rgba(0, 255, 0, .8)';
    cxt.lineWidth = 4;
    exports.lineToQueue(cxt);
};
exports.lineToQueue = (cxt) => {
    cxt.beginPath();
    queue.forEach((cell, index) => {
        let {x, y} = cell.getCenter();
        if (index === 0) {
            cxt.moveTo(x, y);
        } else {
            cxt.lineTo(x, y);
        }
    });
    cxt.stroke();
};
// 队列是否可收集 (长度 >= 3)
exports.isQueueCollectable = function () {
    return queue.length >= 3;
};
// 将队列中的cell从游戏中清除
// 并重新填充
exports.removeQueueCells = function () {
    queue.forEach((cell) => {
        removeCell(cell);
    });
    refill();
};
exports.clearQueue = () => {
    queue.forEach((cell) => (cell.leaveQueue()));
    queue.length = 0;
};

/**
 * 尝试加入队列, 需要符合规则
 */
exports.tryPush = (cell) => {
    if (!cell) {
        return false;
    }
    if (inQueue(cell) && cell !== lastQueueCell()) {
        cutQueue(cell);
        return true;
    }
    let lastCell = lastQueueCell();
    if (!lastCell) {
        push(cell);
        return true;
    }
    if (lastCell.type !== cell.type) {
        return false;
    }
    if (getDistance(lastCell, cell) === 1) {
        push(cell);
        return true;
    }
    return false;
};
exports.push = push;

// 根据坐标获取Cell
exports.getCellByPoint = (x, y) => {
    // 触摸边缘系数
    var gapRatio = .18;

    let xUnit = (x / CellWidth) | 0;
    let yUnit = (y / CellHeight) | 0;

    let innerX = Math.abs(x - xUnit * CellWidth);
    let xGap = CellWidth * gapRatio;
    if (innerX < xGap || innerX > (CellWidth - xGap)) {
        return null;
    }

    let innerY = Math.abs(y - yUnit * CellHeight);
    let yGap = CellHeight * gapRatio;
    if (innerY < yGap || innerY > (CellHeight - yGap)) {
        return null;
    }

    var col = xUnit;
    var row = MAX_ROW - yUnit - 1;

    return cells[col] ? cells[col][row] : null;
};
exports.each = each;
exports.init = (options = {}) => {
    exports.mainContext = options.mainContext;
    exports.lineContext = options.lineContext;
    for (let i = 0; i < MAX_COL; i++) {
        cells[i] = [];
        fillColumn(cells[i], i);
    }
};

exports.queue = queue;