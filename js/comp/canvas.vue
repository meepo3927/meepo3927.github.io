<template>
<div class="canvas-holder" >
    <canvas ref="mainCanvas" ></canvas>
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
methods.start = function () {
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
    cxt.clearRect(0, 0, Canvas.w, Canvas.h);
    var continueDraw = false;
    LOG('draw-1');
    Cells.each((cell, row, col) => {
        if (cell.draw(cxt)) {
            continueDraw = true;
        }
        /*
        cxt.font = "20px Georgia";
        cxt.fillStyle = "#0000ff";
        cxt.fillText(`${row}:${col}`, x, y);
        */
    });
    if (continueDraw) {
        this.drawTimer = window.requestAnimationFrame(() => {
            this.draw();
        });
        return true;
    }
    return false;
};

methods.initSize = function () {
    var {h,w} = Canvas.calSize();
    this.$refs.mainCanvas.height = h;
    this.$refs.mainCanvas.width = w;
};
var computed = {};
var mounted = function () {
    this.initSize();
    this.mainContext = this.$refs.mainCanvas.getContext('2d');
    Cells.init();
    this.start();
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