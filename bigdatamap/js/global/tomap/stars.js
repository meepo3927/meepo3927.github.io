const $ = require('jquery');
const context = require('./context.js');
const drawCCC = context.drawCCC;
const drawCircle = context.drawCircle;
const ColorUtil = require('util/color.js');
const MIN_VALUE = -10;
const BOUND_VALUE = 5;

// 初始值
const RUN_START_VALUE = 0;
const CUBE_SIZE = {x: 1000, y: 1200};

const getAlpha = (percent) => {
    if (percent > 75) {
        return 0.85;
    } else if (percent > 65) {
        return 0.75;
    } else if (percent > 50) {
        return 0.50;
    } else if (percent > 25) {
        return 0.40;
    }
    return 0.2;
};

let star1 = function (pointArr, canvas, options = {}) {
    // 模式
    this.mode = options.mode || 1;
    this.bound = options.bound || 50; // 边界
    this.max = (options.max === undefined) ? (this.bound + BOUND_VALUE) : options.max;
    this.ctx = canvas.getContext();
    this.map = canvas.map;
    this.pointArr = pointArr;
    this.direction = 1;
    this.reset();
    this.callback = options.callback;
    this.updateXY();
    this.draw();
};
star1.prototype.reset = function (options = {}) {
    this.direction = (options.direction === undefined) ? 1 : options.direction;
    if (this.mode === 1) {
        this.value = this.max;
        this.min = (options.min === undefined) ? 5 : options.min;
    } else if (this.mode === 2) {
        this.min = (options.min === undefined) ? MIN_VALUE : options.min;
        this.value = RUN_START_VALUE;
    } else if (this.mode === 3) {
        this.value = this.min = 5;
    }
    this.updateXY();
};
star1.prototype.setDirection = function (d) {
    if (d === 1) {
        this.direction = 1;
        this.value = this.min;
    } else {
        this.direction = -1;
        this.value = this.max;
    }
    this.draw();
};
star1.prototype.update = function() {
    this.value += this.direction;
    if (this.mode === 1) {
        // 太大了
        if (this.value > this.max) {
            this.direction = -1;
            this.value = this.max;
        }
        // 太小了
        if (this.value < this.min) {
            this.direction = 1;
            this.value = this.min + 5;
        }
    } else if (this.mode === 2) {
        if (this.reachMax()) {
            this.direction = -1;
        } else if (this.reachMin()) {
            this.direction = 1;
        }
    }
    this.draw();
    if (this.callback) {
        this.callback(this.value, this.direction, this);
    }
};
star1.prototype.reachMax = function () {
    return (this.value >= this.max);
};
star1.prototype.reachMin = function () {
    return (this.value <= this.min);
};
star1.prototype.updateXY = function() {
    this.pointArr.forEach((v) => {
        v.xy = this.map.pointToPixel(v.lnglat);
    });
    this.draw();
};
star1.prototype.draw = function() {
    var ctx = this.ctx;
    var direction = this.direction;
    var value = this.value;
    var bound = this.bound;
    var size = this.map.getSize();
    let mode = this.mode;
    value = Math.min(value, bound);
    value = Math.max(value, this.min);
    this.pointArr.forEach(function (point, i) {
        let count = point.count;
        let x = point.xy.x;
        let y = point.xy.y;
        let inView = false; // 在视野内
        if (x > -20 * count && x < size.width + 20 * count && y > -20 * count && y < size.height + 20 * count) {
            inView = true;
        }

        if (!inView) {
            return;
        }

        let directionMatch = (point.direction == direction);
        let radius = count * value / bound;
        if (mode === 1 && directionMatch) {
            drawCCC(x, y, ctx, radius, point.color);
        } else if (mode === 2) {
            drawCCC(x, y, ctx, radius, point.color);
        } else if (mode === 3) {
            drawCCC(x, y, ctx, radius, point.color);
        }
    });
};


function OD(dataArr, canvas, options = {}) {
    this.data = dataArr;
    this.s = RUN_START_VALUE;
    this.canvas = canvas;
    this.ctx = canvas.getContext();
    this.go = true;
    this.min = (options.min === undefined) ? MIN_VALUE : options.min;
    this.ccs = context.setCCS("rgb(150,248,239)");
};
OD.prototype.update = function() {
    if(this.go === true) {
        this.s++;
        if (this.s >= 111) {
            this.go = false;
        }
    } else {
        this.s--;
        if(this.s <= this.min) {
            this.go = true;
        }
    }
    if (this.s >= 0 && this.s <= 100) {
        this.canvas.clear();
        this.updateXY();
    }
}
OD.prototype.updateXY = function() {
    let map = this.canvas.map;
    var mercatorProjection = map.getMapType().getProjection();
    var zoom = map.getZoom();
    var zoomUnit = Math.pow(2, 18 - zoom);
    var w = map.getSize().width;
    var h = map.getSize().height;
    var mcCenter = mercatorProjection.lngLatToPoint(map.getCenter());

    var nwMc = new BMap.Pixel(mcCenter.x - w / 2 * zoomUnit, mcCenter.y + h/ 2 * zoomUnit);
    var that = this;
    var s = this.s;
    var v = this.data[0];
    let ccs = this.ccs;
    this.data.forEach(function(v, i) {
        var x = (v.x + v.xx*s - nwMc.x) / zoomUnit;
        var y = (nwMc.y - v.y - v.yy*s) / zoomUnit;
        if (x > 0 && x < w && y > 0 && y < h) {
            let image = v.image || ccs[v.c];
            that.draw(x, y, image);
        }
    });
};
OD.prototype.draw = function(x, y, image) {
    var ctx = this.ctx;
    ctx.drawImage(image, x, y);
};


function Cube(dataArr, canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext();
    this.data = dataArr;
    this.color = options.color || '#00EEFF';
}
Cube.prototype.searchPoint = function (x, y) {
    var zoom = this.canvas.map.getZoom();
    var zoomUnit = Math.pow(2, 18 - zoom);
    var rx = Math.ceil((CUBE_SIZE.x / zoomUnit) / 2);
    var ry = Math.ceil((CUBE_SIZE.y / zoomUnit) / 2);
    for (var i = 0; i < this.data.length; i++) {
        let p = this.data[i];
        if (Math.abs(x - p.x) <= rx && Math.abs(y - p.y) <= ry) {
            return p;
        }
    }
};
Cube.prototype.update = function () {
};
Cube.prototype.updateXY = function () {
    let map = this.canvas.map;
    var zoom = map.getZoom();
    var zoomUnit = Math.pow(2, 18 - zoom);
    var rx = CUBE_SIZE.x / zoomUnit - 2;
    var ry = CUBE_SIZE.y / zoomUnit - 2;

    var w = map.getSize().width;
    var h = map.getSize().height;
    let maxValue = 0;
    this.data.forEach((point) => {
        maxValue = Math.max(point.value, maxValue);
    });
    this.data.forEach((point, i) => {
        let pixel = map.pointToPixel(point);
        point.i = i;
        let x = point.x = pixel.x;
        let y = point.y = pixel.y;
        point.rx = rx;
        point.ry = ry;
        if (x > 0 && x < w && y > 0 && y < h) {
            this.draw(x, y, rx, ry, point.value, maxValue);
            //this.drawText(i, x, y);
        }
    });
};
Cube.prototype.draw = function (x, y, rx, ry, value, maxValue) {
    let percent = Math.round(value * 100 / maxValue);
    let color = ColorUtil.change(this.color, 90 - percent);

    var ctx = this.ctx;
    ctx.globalAlpha = getAlpha(percent);
    ctx.fillStyle = color;
    ctx.fillRect(x - rx/2, y - ry/2, rx, ry);
};
Cube.prototype.drawText = function (text, x, y) {
    var ctx = this.ctx;
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#333333';
    ctx.font = '14px Arial';
    ctx.fillText(text, x, y);
};

function Curve(p1, p2, canvas, options = {}) {
    this.p1 = p1;
    this.p2 = p2;
    this.canvas = canvas;
    let colorArr = ["#ffcccc","#ff9966","#ff6666","#ff6633","#ff3300"];
    this.count = options.count % colorArr.length;
    this.color = options.color || colorArr[this.count % colorArr.length];
    this.t = 0;
    this.ctx = canvas.getContext();

    this.updateXY();
}
Curve.prototype.update = function () {
    this.t += 8 * (100 - this.t) / 100;
    this.draw();
};
Curve.prototype.updateXY = function () {
    let map = this.canvas.map;
    var poi1 = map.pointToPixel(this.p1);
    var poi2 = map.pointToPixel(this.p2);
    this.x1 = poi1.x;
    this.y1 = poi1.y;
    this.x2 = poi2.x;
    this.y2 = poi2.y;
    this.x3 = poi1.x;
    this.y3 = (poi1.y + poi2.y) / 2;
    if((this.y3 - poi1.y) < 100 && (this.y3 - poi1.y) > -100){
        this.x3 = (poi1.x + poi2.x) / 2;
        this.y3 = poi1.y - (poi1.x - poi2.x) / 4;
    }
};
Curve.prototype.draw = function () {
    var ctx = this.ctx;
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = this.count;
    var x1 = this.x1;
    var x2 = this.x2;
    var x3 = this.x3;
    var y1 = this.y1;
    var y2 = this.y2;
    var y3 = this.y3;
    var t1 = this.t / 100;
    var t2 = (this.t - 1) / 100;
    var x4 = (1-t1)*(1-t1)*x1+2*t1*(1-t1)*x3+t1*t1*x2;
    var y4 = (1-t1)*(1-t1)*y1+2*t1*(1-t1)*y3+t1*t1*y2;
    var x5 = (1-t2)*(1-t2)*x1+2*t2*(1-t2)*x3+t2*t2*x2;
    var y5 = (1-t2)*(1-t2)*y1+2*t2*(1-t2)*y3+t2*t2*y2;
    var endRadians = Math.atan((y4-y5)/(x4-x5));
    endRadians+=((x4>x5) ? 90 : -90) * Math.PI / 180;
    this.drawArrowhead(x4,y4,endRadians);
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    for (var i = 0; i < this.t; i++) {
        var t = i / 100;
        var xx4=(1-t)*(1-t)*x1+2*t*(1-t)*x3+t*t*x2;
        var yy4=(1-t)*(1-t)*y1+2*t*(1-t)*y3+t*t*y2;
        ctx.lineTo(xx4, yy4);
    }
    ctx.lineTo(x4, y4);
    ctx.shadowColor = 'rgba(0, 0, 0, 1)';
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.closePath();
};
Curve.prototype.drawArrowhead = function(x, y, radians) {
    var ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.rotate(radians);
    ctx.moveTo(0,0);
    ctx.lineTo(12,8);
    ctx.lineTo(0,-12);
    ctx.lineTo(-12,8);
    ctx.lineTo(0,0);
    ctx.restore();
    ctx.fill();
    ctx.closePath();
};

function light(points, canvas, options = {}) {
    this.points = points || [];
    this.canvas = canvas;
    this.ctx = canvas.getContext();
    this.map = canvas.map;
    this.value = 0;
    this.step = 1;
    this.MIN = 1;
    this.MAX = 10;
    this.color = options.color;
    this.maxValue = options.maxValue || 100;
    this.points.forEach((v) => {
        v.startValue = v.value % this.MAX;
    });
    this.updateXY();
}
light.prototype.update = function () {
    this.value += this.step;
    if (this.value >= this.MAX) {
        this.step = -1;
    } else if (this.value <= this.MIN) {
        this.step = 1;
    }
    this.draw();
};
light.prototype.updateXY = function () {
    this.points.forEach((v) => {
        v.pixel = this.map.pointToPixel(v);
    });
    this.draw();
};
light.prototype.draw = function () {
    let ctx = this.ctx;
    let MAX = this.MAX;
    let color = this.color;
    let maxValue = this.maxValue;
    let frameValue = this.value;
    let frameValue2 = (MAX - this.value);
    this.points.forEach((v, i) => {
        let pixel = v.pixel;
        let add = (i % 3 === 0) ? frameValue2 : frameValue;
        add += v.startValue;

        add = Math.max(1, add);
        let myAddValue = Math.round(Math.abs(v.value) * (add + 1) / (MAX + 1));
        //LOG(myAddValue);
        let radius = Math.sqrt(myAddValue) / 2;
        let opacity = (add + 2) / 10;
        drawCircle(ctx, pixel.x, pixel.y, {
            radius, opacity, color
        });
    });
};

module.exports = {
    star1,
    OD,
    Cube,
    Curve,
    light
};