const RUN_INTERVAL = 100;

function CanvasLayer(z) {
    this.zIndex = typeof(z) === "undefined" ? 0 : z;
    this.data = null;
    this.paused = false;
}
if (window.BMap) {
    CanvasLayer.prototype = new BMap.Overlay();
}
CanvasLayer.prototype.initialize = function (map) {
    this.map = map;
    var canvas = this.canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;" + "left:0;" + "top:0;" + "z-index:" + this.zIndex + ";";
    canvas.style.zIndex = this.zIndex;
    this.adjustSize();
    this.map.getPanes().labelPane.appendChild(canvas); 
    return this.canvas;
};
CanvasLayer.prototype.adjustSize = function () {
    var size = this.map.getSize();
    var canvas = this.canvas;
    var pixelRatio;

    if (this.context == 'webgl') {
        pixelRatio = 1;
    } else {
        pixelRatio = (function (context) {
            var backingStore = context.backingStorePixelRatio
                || context.webkitBackingStorePixelRatio
                || context.mozBackingStorePixelRatio
                || context.msBackingStorePixelRatio
                || context.oBackingStorePixelRatio
                || context.backingStorePixelRatio || 1;

            return (window.devicePixelRatio || 1) / backingStore;
        })(canvas.getContext('2d'));
    }

    canvas.width = size.width;
    canvas.height = size.height;
};
CanvasLayer.prototype.draw = function () {
    this.adjustSize();
    var map =this.map;
    var size = map.getSize();
    var center = map.getCenter();
    var pixel = map.pointToOverlayPixel(center);
    this.canvas.style.left = pixel.x - size.width / 2 + 'px';
    this.canvas.style.top = pixel.y - size.height / 2 + 'px';
    if (this.data !== null) {
        var ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, size.width, size.height);
        this.update();
    }
};
CanvasLayer.prototype.on = function (event, func) {
    return this.canvas.addEventListener(event, func, true);
};
CanvasLayer.prototype.getContainer = function () {
    return this.canvas;
};
CanvasLayer.prototype.getContext = function () {
    return this.canvas.getContext('2d');
};
CanvasLayer.prototype.clear = function () {
    var ctx = this.getContext();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    return this;
};
CanvasLayer.prototype.hide = function () {
    this.canvas.style.display = "none";
};
CanvasLayer.prototype.setZIndex = function (zIndex) {
    this.canvas.style.zIndex = zIndex;
};

CanvasLayer.prototype.getZIndex = function () {
    return this.zIndex;
};
CanvasLayer.prototype.setData = function (data) {
    if (data && !Array.isArray(data)) {
        this.data = [data];
    } else {
        this.data = data;
    }

    return this;
};
CanvasLayer.prototype.update = function () {
    var da = this.data || [];
    var l = da.length;
    for (var i = 0; i < l; i++) {
        da[i].updateXY();
    }
};
CanvasLayer.prototype.dispose = function () {
    this.data = null;
    if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
    }
};
CanvasLayer.prototype.start = function (options) {
    this.paused = false;
    clearTimeout(this.timer);
    this.run(options);
};
CanvasLayer.prototype.pause = function () {
    this.paused = true;
};
CanvasLayer.prototype.run = function (options) {
    let o = options || {};
    this.timer = setTimeout(() => {
        this.run(options);
    }, o.interval || RUN_INTERVAL);
    if (!this.paused) {
        if (o.clear) {
            this.clear();
        }
        if (this.data) {
            this.data.forEach((v) => {
                v.update();
            });
        }
    }
};
module.exports = CanvasLayer;