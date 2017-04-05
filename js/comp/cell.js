var config = require('global/config');
var Resource = require('global/resource.js');

function Cell(type = Resource.randtype()) {
    // 类型
    this.type = type;
    if (type) {
        this.img = new Image();
        this.img.src = Resource.getItemSrc(type);
        this.img.onload = () => {
            this.loaded = true;
        };
    }
}
var proto = Cell.prototype;
proto.draw = function (context, x, y, w, h) {
    if (!this.loaded) {
        LOG(this.type + ' not loaded');
        return false;
    }
    context.drawImage(this.img, x, y, w, h);
};

module.exports = Cell;