var config = require('global/config');
var Resource = require('global/resource.js');

function Cell(row, col, type = Resource.randtype()) {
    // 类型
    this.type = type;
}
var proto = Cell.prototype;
proto.draw = function (context, x, y, w, h) {
    var img = Resource.imgs[this.type];
    if (!img) {
        LOG('[cell]draw: img null');
    }
    context.drawImage(img, x, y, w, h);
};

module.exports = Cell;