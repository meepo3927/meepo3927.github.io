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
        this.draw();
    });
};
methods.draw = function () {
    var cxt = this.mainContext;
    Cells.each((cell, row, col) => {
        let {w, h} = Canvas.getCellSize();
        let {x, y} = this.calCellPosition(row, col, w, h);
        cell.draw(cxt, x, y, w, h);
    });
};
methods.calCellPosition = function (row, col, w, h) {
    return {
        x: w * row,
        y: h * col
    };
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