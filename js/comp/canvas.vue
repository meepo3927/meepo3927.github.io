<template>
<div class="canvas-holder" >
    <canvas ref="mainCanvas" ></canvas>
    <canvas ref="lineCanvas" class="line-canvas"></canvas>
</div>
</template>

<script>
import Canvas from 'comp/canvas';
import Cell from 'comp/cell';
import Cells from 'comp/cells';
import config from 'global/config';
import Resource from 'global/resource';

const COL = config.MAX_COL;
const ROW = config.MAX_ROW;

const noop = function () {};
var docElem = document.documentElement;
var methods = {};
methods.bind = function () {
    this.$refs.mainCanvas.addEventListener('mousedown', this, true);
    docElem.addEventListener('mousemove', this, true);
    this.$refs.mainCanvas.addEventListener('mouseup', this, true);
};
methods.handleMousedown = function (e) {
    this.touchStart(e);
};
methods.handleMousemove = function (e) {
    this.touchMove(e);
};
methods.handleMouseup = function (e) {
    this.touchEnd();
};

// 交互开始(按下)
methods.touchStart = function (e) {
    if (this.isTouching) {
        return false;
    }
    this.isTouching = true;
    this.touchMove(e);
};
methods.touchMove = function (e) {
    if (!this.isTouching) {
        return false;
    }
    if (e.target.tagName.toLowerCase() !== 'canvas') {
        return this.touchEnd();
    }
    var x = e.clientX;
    var y = e.clientY;
    var canvasRect = this.mainCanvas.getBoundingClientRect();
    x -= canvasRect.left;
    y -= canvasRect.top;

    var cell = Cells.getCellByPoint(x, y);
    
};
methods.touchEnd = function () {
    if (!this.isTouching) {
        return false;
    }
    this.isTouching = false;
};

// 开始绘画
methods.startDraw = function () {
    Resource.load(() => {
        this.clearTimer();
        this.draw();
    });
};
methods.clearTimer = function () {
    if (this.drawTimer) {
        cancelAnimationFrame(this.drawTimer);
        this.drawTimer = null;
    }
};
methods.draw = function () {
    if (this.stoped) {
        return false;
    }
    var cxt = this.mainContext;
    Canvas.clear(cxt);
    var continueDraw = false;
    Cells.each((cell, row, col) => {
        if (cell.draw(cxt)) {
            continueDraw = true;
        }
    });
    if (continueDraw) {
        this.drawTimer = window.requestAnimationFrame(() => {
            this.draw();
        });
        return true;
    }
    return false;
};

methods.initSize = function (elem) {
    var {h,w} = Canvas.calSize();
    elem.height = h;
    elem.width = w;
    elem.style.marginLeft = -(w / 2) + 'px';
};
methods.initContext = function () {
    this.lineContext.fillStyle = 'rgba(0, 0, 0, .5)';
};
var computed = {};
var mounted = function () {
    this.bind();
    this.initSize(this.$refs.mainCanvas);
    this.initSize(this.$refs.lineCanvas);
    this.mainCanvas = this.$refs.mainCanvas;
    this.mainContext = this.$refs.mainCanvas.getContext('2d');

    this.lineContext = this.$refs.lineCanvas.getContext('2d');
    this.initContext();
    Cells.init();
    this.startDraw();
};
let destroyed = function () {
};
let dataFunc = function () {
    var o = {
    };
    return o;
};
export default {
    data: dataFunc,
    methods,
    computed,
    props: [],
    mounted,
    destroyed,
    components: {}
};
</script>

<style scoped lang="less">
</style>