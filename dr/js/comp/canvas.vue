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
    this.$refs.mainCanvas.addEventListener('contextmenu', this, true);
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
    this.touchEnd(e);
};
methods.handleContextmenu = function (e) {
    e.preventDefault();
    return false;
};

// 交互开始(按下)
methods.touchStart = function (e) {
    if (this.isTouching) {
        return false;
    }
    LOG('zizoupao')
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

    if (Cells.tryPush(cell)) {
        this.drawline();
    }

};
methods.touchEnd = function (e) {
    if (!this.isTouching) {
        return false;
    }

    this.isTouching = false;
    var collect = true;
    if (!e) {
        collect = false;
    }

    // 收集成功
    if (collect && Cells.isQueueCollectable()) {
        this.$emit('collect', Cells.queue);
        this.$nextTick(function () {
            this.$emit('after-collect');
        });
        Cells.removeQueueCells();
    }

    // 清除并绘画
    Cells.clearQueue();
    this.drawline();
    // this.startDraw();
};
methods.cancel = function () {};
// 画线
methods.drawline = function () {
    // 先清除line画布
    Canvas.clear(this.lineContext);
    // 类型
    Cells.drawByType();
    if (Cells.queue.length) {
        // 在队列中的cell
        Cells.queue.forEach((cell) => {
            cell.renderInQueue();
        });
        // 线条
        Cells.drawQueuePath();
    }
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
        if (cell.draw()) {
            continueDraw = true;
        }
    });
    // if (continueDraw) {
    this.drawTimer = window.requestAnimationFrame(() => {
        this.draw();
    });
    return true;
};

methods.initSize = function (elem) {
    var {h,w} = Canvas.calSize();
    elem.height = h;
    elem.width = w;
    elem.style.marginLeft = -(w / 2) + 'px';
};
methods.initContext = function () {
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
    Cells.init({
        mainContext: this.mainContext,
        lineContext: this.lineContext
    });
    this.startDraw();
};
let destroyed = function () {
    this.stoped = true;
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