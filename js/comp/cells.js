
var Cell = require('comp/cell');
var config = require('global/config');
const MAX_COL = config.MAX_COL;
const MAX_ROW = config.MAX_ROW;
let cells = [];

exports.each = (f) => {
    if (!f) {
        return;
    }
    for (let i = 0; i < MAX_COL; i++) {
        for (let j = 0; j < MAX_ROW; j++) {
            f(cells[i][j], j, i);
        }
    }
};
exports.init = () => {
    for (let i = 0; i < MAX_COL; i++) {
        cells[i] = [];
        for (let j = 0; j < MAX_ROW; j++) {
            cells[i][j] = new Cell();
        }
    }
};