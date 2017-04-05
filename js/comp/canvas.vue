<template>
<div class="canvas-holder" :style="canvasHolderStyle">
    <canvas ref="cvs"></canvas>
</div>
</template>

<script>
const headHeight = 100;
const canvasWidthRate = 4;
const canvasHeightRate = 4;
const imgPath = './images';
const noop = function () {};
var docElem = document.documentElement;
var methods = {};
let loadImg = (url, callback = noop) => {
    var img = new Image();
    img.src = imgPath + '/' + url;
    if (img.complete) {
        return setTimeout(() => {
            callback(img);
        }, 1);
    }
    img.onload = () => {
        callback(img);
    };
};
methods.draw = function () {
    loadImg('1.png', (img) => {
        this.context.drawImage(img, 10, 10);
    });
};
methods.calSize = function () {
    var docWidth = docElem.clientWidth;
    var docHeight = docElem.clientHeight - headHeight;
    if (docWidth * canvasHeightRate > docHeight * canvasWidthRate) {
        var cheight = docHeight;
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

    this.$refs.cvs.height = h;
    this.$refs.cvs.width = w;
};
methods.handleResize = function () {
    this.renderSize();
    this.draw();
};
var computed = {};
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
    this.context = this.$refs.cvs.getContext('2d');
    this.renderSize();
    setTimeout(() => {
        this.draw();
    }, 400);
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
.comp-xxx {
    
}
</style>