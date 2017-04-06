var config = require('global/config');
var Resource = require('global/resource.js');
var Canvas = require('comp/canvas');
var Tween = require('lib/tween');
let ROW = config.MAX_ROW;
let CellHeight = Canvas.cellHeight;
let CellWidth = Canvas.cellWidth;
function Cell(row, col, type = Resource.randtype()) {
    this.row = row;
    this.col = col;
    // 类型
    this.type = type;

    // 延迟绘画
    this.delay = row * 3;

    // 目标坐标
    this.destX = CellWidth * col;
    this.destY = CellHeight * (ROW - row - 1);

    // 起始坐标
    this.startY = this.destY - Canvas.h;
    // 当前坐标(绘画)
    this.x = this.destX;
    this.y = this.startY;

    this.distance = this.destY - this.startY;
    this.step = 0;
}
var proto = Cell.prototype;
proto.isStopped = function () {
    return (this.y === this.destY);
};
proto.frameStep = function () {
    let frameCount = ((this.distance / 14) | 0) + 1;
    var y = Math.tween.Quad.easeIn(this.step, this.startY, this.distance, frameCount);
    this.step++;
    this.y = y;
    if (this.y >= this.destY || this.step >= frameCount) {
        this.y = this.destY;
    }
};
proto.draw = function (context) {
    if (this.delay >= 0) {
        this.delay--;
        return true;
    }
    // if nothing changed, return false
    let stoped = this.isStopped();
    // draw it
    var imageCanvas = Resource.imageCanvasHolder[this.type];
    if (!imageCanvas) {
        LOG('[cell]draw: imageCanvas null');
    } else {
        context.drawImage(imageCanvas, this.x, this.y, CellWidth, CellHeight);
    }
    // step every frame
    this.frameStep();

    return !stoped;
};

proto.drawCover = function (context) {
    
    context.fillRect(this.x, this.y, CellWidth, CellHeight);
};

module.exports = Cell;