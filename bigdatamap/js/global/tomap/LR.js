const context = require('./context');
const config = require('global/config.js');
const $ = require('jquery');
const pro = context.pro;
const getAngle = context.getAngle;

const getImageUrl = function (path) {
    return './images' + path;
};
const getOffsetY = () => {
    let mapElem = document.querySelector('.vue-bmap');
    if (!mapElem) {
        mapElem = document.querySelector('.circle-wrapper');
    }
    return mapElem.getBoundingClientRect().top;
};

function jttv1(p1, p2, c) {
    this.p1 = p1;
    this.p2 = p2;
    this.name = '来源地';
    this.i = 0;
    this.run = false;
    this.count = 3;
    this.c = c + 1;
}
if (window.BMap) {
    jttv1.prototype = new BMap.Overlay();
}

jttv1.prototype.initialize = function(map) {
    this._map = map;
    var p1 = this.p1;
    var p2 = this.p2;
    var div = this._div = document.createElement("div");
    var div1 = this._div1 = document.createElement("div");
    var div2 = this._div2 = document.createElement("div");
    var img = this._img = document.createElement("img");
    var img2 = this._img2 = document.createElement("img");
    div1.className = "timg";
    div2.className = "windText2";
    div2.innerHTML =this.name;

    div.appendChild(div1);
    div1.appendChild(img);
    div1.appendChild(img2);
    div.className = "gggg";
    div.style.position = "absolute";
    div.style.width = 30 * this.count + "px";
    var angle = this.angle = getAngle(p1.x, p1.y, p2.x, p2.y);
    div.style.transform = "rotateZ(" + angle + "deg)";
    angle = 0 - angle;
    div.style.transformOrigin = "center bottom";
    $("#imgview").append(div);
    img.src = getImageUrl('/effect/arrow_line.png');
    img.className = "wimg";
    img2.src = getImageUrl('/effect/arrow_head.png');
    img2.className = "wimg2";
    this.h = div2.clientHeight;
    this.w = div2.clientWidth;
    return div;
};
jttv1.prototype.draw = function() {
    var _div1 = this._div1;
    var _div2 = this._div2;
    var _img  = this._img;
    var p1 = this.p1;
    var p2 = this.p2;
    var zoom = this._map.getZoom();
    var zu = Math.pow(2, 18 - zoom);
    var xx=p2.x - p1.x;
    var yy=p2.y - p1.y;
    var l = Math.sqrt(xx * xx + yy * yy);
    var c = Math.round(l / zu);
    if (c >800) {
        c=800;
    }
    xx=c/2/l*xx;
    yy=-c/2/l*yy;
    //console.log(xx);
    var h = c  - 15 * this.count;
    _div1.style.height = h + "px";
    var poi = pro.pointToLngLat(p1);
    var position = this._map.pointToPixel(poi);
    let offsetY = getOffsetY();
    this._div.style.height = c + "px";
    this._div.style.left = (position.x - this.count * 15) + "px";
    this._div.style.top = (position.y - c + offsetY) + "px";
    position.x+=xx;
    position.y+=yy;
    //var xy3d=set3DName(position);
    //this._div2.style.left = xy3d.x - this.w/2+ "px";
    //this._div2.style.top = xy3d.y  - this.h+"px";
    var that=this;
    if(this.run==false){
        this.run=true;
        this.i=1;
        next(1);
    }

    function next(i){
        var enterDuration = 2000;
        var leaveDuration = 2000;
        var stepInterval = enterDuration;
        switch (i) {
            case 1:
                $(_div1).animate({opacity:"1"},enterDuration);
                $(_img).animate({height:"100%"},{easing:"easeOutCubic",duration: enterDuration});
                that.i = 2;
                next(that.i);
            break;
            case 2:
                var timeOut = setTimeout(function(){
                    clearTimeout(timeOut);
                    $(_div1).animate({opacity:"0"}, leaveDuration);
                    $(_div2).animate({opacity:"0"}, leaveDuration);
                    that.i=3;
                    next(that.i);
                }, stepInterval);
            break;
            case 3:
                var timeOut = setTimeout(function(){
                    clearTimeout(timeOut);
                    that._div.remove();
                    that._div2.remove();
                }, stepInterval + 500);
            break;
        }
    }
}


function jttv3(p1, p2, name, num, count,c) {
    this.p1 = p1;
    this.p2 = p2;
    this.name = name;
    this.num = num;
    this.i = 0;
    this.run = false;
    this.count = count;
    this.color=c;
}
if (window.BMap) {
    jttv3.prototype = new BMap.Overlay();
}
jttv3.prototype.initialize = function(map) {
    this._map = map;
    var p1 = this.p1;
    var p2 = this.p2;
    var div = this._div = document.createElement("div");
    var div1 = this._div1 = document.createElement("div");
    var div2 = this._div2 = document.createElement("div");
    var img = this._img = document.createElement("img");
    var img2 = this._img2 = document.createElement("img");
    div1.className = "timg";
    div2.className = "windText3";
    div2.style.color=this.color;
    var n=this.num+"%";
    div2.innerHTML =  n;
    //div.appendChild(div2);
    $("#cname").append(div2);
    div.appendChild(div1);
    div1.appendChild(img);
    div1.appendChild(img2);
    div.className = "gggg";
    div.style.position = "absolute";
    div.style.width = 30 * this.count + "px";
    var angle = this.angle = getAngle(p1.x, p1.y, p2.x, p2.y);
    div.style.transform = "rotateZ(" + angle + "deg)";
    angle = 0 - angle;
    div.style.transformOrigin = "center bottom";
    $("#imgview").append(div);
    img.src = getImageUrl('/effect/arrow_line.png');
    img.className = "wimg";
    img2.src = getImageUrl('/effect/arrow_head.png');
    img2.className = "wimg2";
    this.h=div2.clientHeight;    
    this.w=div2.clientWidth;
    return div;
}
jttv3.prototype.draw = function() {
    var _div1 = this._div1;
    var _div2 = this._div2;
    var _img  = this._img;
    var p1 = this.p1;
    var p2 = this.p2;
    var zoom = this._map.getZoom();
    var zu = Math.pow(2, 18 - zoom);
    var xx=p2.x - p1.x;
    var yy=p2.y - p1.y;
    var l = Math.sqrt(xx * xx + yy * yy);
    var c = Math.round(l / zu);
 
    xx=c/l*xx;
    yy=-c/l*yy;
    //console.log(xx);
    var h = c  - 15 * this.count;
    _div1.style.height = h + "px";
    var poi = pro.pointToLngLat(p1);
    var position = this._map.pointToPixel(poi);
    let offsetY = getOffsetY();
    this._div.style.height = c + "px";
    this._div.style.left = (position.x - this.count * 15) + "px";
    this._div.style.top = (position.y - c + offsetY) + "px";
   // position.x+=0;
    //position.y+=0;
    //var xy3d=set3DName(position);
    this._div2.style.left = position.x - this.w/2+ "px";
    this._div2.style.top = (position.y  - this.h + offsetY) + "px";
    var that=this;
    if(this.run==false){
        this.run=true;
        this.i=1;
        next(1);
    }
    function next(i){
        switch (i) {
            case 1:
                $(_div1).animate({opacity:"1"},2000);
                $(_div2).animate({opacity:"1"},3000);
                $(_img).animate({height:"100%"},{easing:"easeOutCubic",duration: 3000});
                that.i = 2;
                next(that.i);
            break;
            case 2:
                var timeOut = setTimeout(function () {
                    clearTimeout(timeOut);
                    setTimeout(function () {
                         $(_div1).animate({opacity:"0"},2000);
                         $(_div2).animate({opacity:"0"},2000);
                    }, 1000);
                    that.i = 3;
                    next(that.i);
                }, 3000);
            break;
            case 3:
                var timeOut = setTimeout(function () {
                    clearTimeout(timeOut);
                    that._div2.remove();
                    that._div.remove();
                }, 3000);
            break;
        }
    }
}

function POI(point, item, options = {}) {
    this.point = point;
    if (typeof item === 'string') {
        this.item = {
            name: item,
            userNum: Math.round(Math.random() * 9988)
        };
    } else {
        this.item = item;
    }
    this.name = this.item.name;
    this.options = options;
}
if (window.BMap) {
    POI.prototype = new BMap.Overlay();
}
POI.prototype.initialize = function (map) {
    this.map = map;
    var elem = this.elem = document.createElement('div');
    elem.className = 'bmap-poi';
    var userNumHTML = '';
    if (this.item.userNum !== undefined) {
        userNumHTML = [
            `<i class="fa fa-caret-left"></i>`,
            `<span class="poi-usernum">${this.item.userNum}人</span>`
        ].join('');
    }
    elem.innerHTML = [
        `<div class="poi-wrapper">`,
            `<span class="poi-name">${this.name}</span>`,
            userNumHTML,
        `</div>`
    ].join('');
    elem.addEventListener('click', () => {
        context.ebus.fire('POIClick', [this.point, this.name, this]);
    });
    map.getPanes().labelPane.appendChild(elem);

    this.h = elem.clientHeight;
    this.w = elem.clientWidth;

    if (this.options.visible === false) {
        elem.style.display = 'none';
    }

    return elem;
};
POI.prototype.draw = function () {
    var p = this.map.pointToOverlayPixel(this.point);
    let top = p.y - (this.h / 2);
    let left = p.x - (this.w / 2);

    this.elem.style.top = top + 'px';
    this.elem.style.left = left + 'px';
};
POI.prototype.showHide = function (bool) {
    if (bool) {
        //$(elem).animate({opacity: 1}, 1000);
        $(this.elem).stop().fadeIn(1000);
    }else{
        $(this.elem).stop().fadeOut(1000);
        //$(elem).animate({opacity: 0}, 1000);
    }
};

module.exports = {
    jttv1,
    jttv3,
    POI
};