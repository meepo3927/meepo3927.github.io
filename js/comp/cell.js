var config = require('global/config');
var Resource = require('global/resource.js');
var Canvas = require('comp/canvas');
var Tween = require('lib/tween');
let ROW = config.MAX_ROW;
let CellHeight = Canvas.cellHeight;
let CellWidth = Canvas.cellWidth;
function Cell(row, col, options = {}) {
    this.row = row;
    this.col = col;
    // 类型
    this.type = options.type || Resource.randtype();
    this.mainContext = options.mainContext;
    this.lineContext = options.lineContext;
    let delay = row - options.len;

    this.anim = {
        scale: 1
    };
    this.state = {};

    this.resetAnim({
        delay,
        startY: -CellHeight * 1.5
    });
}
var proto = Cell.prototype;
// 在队列中
proto.renderInQueue = function () {
    this.anim.scale = .8;
    this.state.inQueue = true;
};
/**
 * 离开队列
 */
proto.leaveQueue = function () {
    this.anim.scale = 1;
    this.state.inQueue = false;
};
/**
 * 根据类型判断，不符合类型则cover
 */
proto.drawByType = function (type) {
    if (this.type !== type) {
        this.drawCover();
    }
};

/**
 * 重新设置行列位置，重新计算坐标
 */
proto.repos = function (row, col) {
    if (this.row === row && this.col === col) {
        return false;
    }
    this.row = row;
    this.col = col;
    this.resetAnim({
        startY: this.y
    });
};
/**
 * 重新计算坐标，动画
 * @return {[type]}
 */
proto.resetAnim = function (o = {}) {
    // 延迟绘画
    this.delay = o.delay * 12;

    // 目标坐标
    this.destX = CellWidth * this.col;
    this.destY = CellHeight * (ROW - this.row - 1);
    this.step = 0;

    // 起始坐标
    if (o.startY === undefined) {
        this.startY = this.destY - Canvas.h;
    } else {
        this.startY = o.startY;
    }

    // 当前坐标(绘画)
    this.x = this.destX;
    this.y = this.startY;
    this.distance = this.destY - this.startY;
};
/**
 * 是否应该停止移动
 * @return {Boolean}
 */
proto.isStopped = function () {
    return (this.y === this.destY);
};
/**
 * 逐帧计算位置
 */
proto.frameStep = function () {
    let frameCount = ((this.distance / 12) | 0) + 1;
    var y = Math.tween.Quad.easeIn(this.step, this.startY, this.distance, frameCount);
    this.step++;
    this.y = y;
    if (this.y >= this.destY || this.step >= frameCount) {
        this.y = this.destY;
    }
};
/**
 * 绘画自己的位置
 * @param  {Context}
 */
proto.draw = function () {
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
        var scale = this.anim.scale;
        var w = CellWidth * scale;
        var h = CellHeight * scale;
        var x = this.x + (CellWidth - w) / 2;
        var y = this.y + (CellHeight - h) / 2;
        this.mainContext.drawImage(imageCanvas, x, y, w, h);
    }
    // step every frame
    this.frameStep();

    return !stoped;
};
/**
 * 画透明遮罩层
 */
proto.drawCover = function () {
    this.lineContext.fillRect(this.x, this.y, CellWidth, CellHeight);
};
/**
 * 获取中心点
 */
proto.getCenter = function () {
    let x = this.x + CellWidth / 2;
    let y = this.y + CellHeight / 2;
    return {x, y};
};
/**
 * 销毁
 */
proto.dispose = function () {
};
module.exports = Cell;