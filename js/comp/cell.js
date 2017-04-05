var config = require('global/config');
var Resource = require('global/resource.js');
var Canvas = require('comp/canvas');
function Cell(row, col, type = Resource.randtype()) {
    // 类型
    this.type = type;
    this.yOffset = Canvas.getCellOffset(row);
}
var proto = Cell.prototype;
proto.draw = function (context, x, y, w, h) {
    var img = Resource.imgs[this.type];
    if (!img) {
        LOG('[cell]draw: img null');
    }
    y += this.yOffset;
    this.calOffset();
    context.drawImage(img, x, y, w, h);
};
proto.calOffset = function () {
    this.yOffset += 6;
    if (this.yOffset >= 0) {
        this.yOffset = 0;
    }
};

module.exports = Cell;