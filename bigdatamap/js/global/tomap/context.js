const EventBus = require('util/event_bus.js');

function getAngle(px,py,mx,my){//获得原点和坐标连线，与y轴正半轴之间的夹角
    var x = Math.abs(px-mx);
    var y = Math.abs(py-my);
    var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
    var cos = y/z;
    var radina = Math.acos(cos);//用反三角函数求弧度
    var angle = 180/(Math.PI/radina);//将弧度转换成角度

    if(mx<px&&my>py){//鼠标在第四象限
        angle =  - angle;
    }

    if(mx==px&&my<py){//鼠标在y轴负方向上
        angle = 180;
    }

    if(mx>px&&my==py){//鼠标在x轴正方向上
        angle = 90;
    }

    if(mx<px&&my<py){//鼠标在第三象限
        angle = 180+angle;
    }

    if(mx<px&&my==py){//鼠标在x轴负方向
        angle = 270;
    }

    if(mx>px&&my<py){//鼠标在第二象限
        angle = 180 - angle;
    }
    return angle;
};
var colorTtt = [
    "#EF7520","#FCF19E","#00C6C6","#96F8EF"
];
const getColor = (i) => {
    return colorTtt[i % 4];
};
function drawCCC(x,y,ctx,count,color){
    var n = count * 10 - 2;
    if (n < 0) {
        n = 0;
    }
    let arcRadius = Math.max(count * 12, 0);
    let grdRadius = arcRadius + 2;
    var grd = ctx.createRadialGradient(x, y, grdRadius, x, y, n);
    grd.addColorStop(0,"rgba(255, 255, 255, 0.2)");
    grd.addColorStop(1,color);
    ctx.beginPath();
    ctx.fillStyle = color;

    ctx.arc(x,y, arcRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = grd;
    let arcRadius2 = arcRadius + 1;
    ctx.arc(x,y, arcRadius2,0,2*Math.PI);
    ctx.stroke();
    ctx.closePath();
}

function setCCS(color) {
    var ccs = [];
    for(var i = 0; i < 8; i++) {
        var canvas = document.createElement('canvas');
        canvas.width = 2*  i + 2;
        canvas.height = 2 * i + 2;
        var context = canvas.getContext("2d");
        context.beginPath();
        context.fillStyle= color;
        context.globalAlpha = i / 10 + 0.3;
        context.arc(i + 1, i + 1, i + 1, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
        ccs[i] = canvas;
    }
    return ccs;
}
function getCircle(color) {
    var canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    var context = canvas.getContext("2d");
    context.beginPath();
    context.fillStyle = color;
    context.globalAlpha = 0.8;
    context.arc(8, 8, 8, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
    return canvas;
}
function getColorByDistance(distance) {
    let map = [
        1000, 5000, 10000
    ];
    let maxColor = '#E17055';
    let color = [
        '#00CEC9', '#FDCB6E', '#0984E3'
    ];
    for (let i = 0; i < map.length; i++) {
        if (distance < map[i]) {
            return color[i];
        }
    }
    return maxColor;
}
const drawCircle = (ctx, x, y, options = {}) => {
    //LOG('drawCircle:' + x + ':' + y);
    //let color = '#FDCB6E';
    let color = options.color || '#00B0F0';
    let radius = (options.radius === undefined) ? 20 : options.radius;
    let opacity = (options.opacity === undefined) ? 1 : options.opacity;
    ctx.shadowBlur = 5;
    ctx.shadowColor = color;
    //ctx.fillStyle = color;
    var grd = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grd.addColorStop(0, color);
    grd.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
    ctx.globalAlpha = Math.min(opacity, 1);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x,y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
};

let exports = {
    getAngle,
    getColor,
    drawCCC,
    setCCS,
    getCircle,
    drawCircle,
    getColorByDistance,
    ebus: new EventBus()
};
if (window.BMap) {
    exports.pro = new BMap.MercatorProjection();
} else {
    exports.pro = {
        lngLatToPoint: () => {}
    };
}

module.exports = exports;