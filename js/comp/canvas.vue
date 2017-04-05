<template>
<div class="canvas-holder" :style="canvasHolderStyle">
    <canvas ref="mainCanvas"></canvas>
</div>
</template>

<script>
import Cell from 'comp/cell';
import Cells from 'comp/cells';
import config from 'global/config';
import Resource from 'global/resource';
const COL = config.MAX_COL;
const ROW = config.MAX_ROW;
const headHeight = 100;
const canvasWidthRate = 6;
const canvasHeightRate = 6;
const noop = function () {};
var docElem = document.documentElement;
var methods = {};
methods.start = function () {
    Resource.load(() => {
        this.draw();
    });
};
methods.draw = function () {
    var cxt = this.mainContext;
    Cells.each((cell, row, col) => {
        let {w, h} = this.getCellSize();
        let {x, y} = this.calCellPosition(row, col, w, h);
        cell.draw(cxt, x, y, w, h);
    });
};
methods.getCellSize = function () {
    return {
        w: this.cellWidth,
        h: this.cellHeight
    };
};
methods.calCellPosition = function (row, col, w, h) {
    return {
        x: w * row,
        y: h * col
    };
};
methods.calSize = function () {
    var docWidth = docElem.clientWidth;
    var docHeight = docElem.clientHeight - headHeight;
    if (docWidth * canvasHeightRate > docHeight * canvasWidthRate) {
        var cheight = Math.max(320, docHeight);
        var cwidth = Math.ceil(cheight * canvasWidthRate / canvasHeightRate);
    } else {
        cwidth = docWidth;
        cheight = Math.ceil(cwidth * canvasHeightRate / canvasWidthRate);
    }

    return {
        h: cheight,
        w: cwidth
    };
};
methods.renderSize = function () {
    var {h,w} = this.calSize();
    this.canvas.h = h;
    this.canvas.w = w;

    this.$refs.mainCanvas.height = h;
    this.$refs.mainCanvas.width = w;
};
methods.handleResize = function () {
    this.renderSize();
    this.draw();
};
var computed = {};
computed.cellWidth = function () {
    return Math.floor(this.canvasWidth / COL);
};
computed.cellHeight = function () {
    return Math.floor(this.canvasHeight / ROW);
};
computed.canvasWidth = function () {
    return this.canvas.w;
};
computed.canvasHeight = function () {
    return this.canvas.h;
};
computed.canvasHolderStyle = function () {
    return {
        height: this.canvasHeight + 'px',
        width: this.canvasWidth + 'px',
        marginLeft: -(this.canvasWidth / 2) + 'px'
    };
};
var mounted = function () {
    this.mainContext = this.$refs.mainCanvas.getContext('2d');
    Cells.init();
    this.renderSize();
    this.start();
    window.addEventListener('resize', this);
};
let destroyed = function () {
    window.removeEventListener('resize', this);
};
let dataFunc = function () {
    let canvas = {
        h: 0,
        w: 0
    };
    var o = {
        canvas
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