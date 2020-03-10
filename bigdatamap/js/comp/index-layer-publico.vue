<template>
<div class="index-layer-child">
    <h4>热点搜索</h4>
    <div class="canvas-wrapper" ref="wrapper">
        <canvas :width="canvasWidth" :height="canvasHeight" 
            :id="id"></canvas>
    </div>
    <div id="tags">
        <ul v-if="list">
            <li v-for="(v, i) in list">
                <a href="javascript:;" v-text="v.text" 
                    :style="{fontSize: v.fontSize + 'px'}"
                    @click="onClick(v, i)"></a>
            </li>
        </ul>
    </div>
    
</div>
</template>

<script>
require('lib/tagcanvas.min.js');

const tagOptions = {
    textColour: '#ffffff',
    outlineColour: '#eeeeee',
    minBrightness: 0.5,
    reverse: true,
    depth: 0.8,
    maxSpeed: 0.05,
    minSpeed: 0.01,
    initial: [0.2, -0.2],
    wheelZoom: false,
    shadowBlur: 2,
    clickToFront: 500,
    fadeIn: 800,
    weight: true,
    weightMode: 'both',
    weightGradient: {0:'#EF7520', 0.3:'#fff'}
};

let methods = {};
methods.onClick = function (v, i) {
};
methods.fetchRender = function () {
    let p = this.$store.getters.cityParam;
    this.vRequest.fetch2('/publico/total', p).then((data) => {
        let max = 1;
        data.forEach((v) => {
            max = Math.max(max, v.value);
        });
        this.list = data.map((v) => {
            return {
                text: v.name + ' (' + v.value + ')',
                fontSize: Math.round(v.value / max * 30)
            }
        });
        this.$nextTick(this.initTagCanvas);
    });
};
methods.initTagCanvas = function () {
    TagCanvas.Start(this.id, 'tags', tagOptions);
};
let computed = {};
computed.id = function () {
    return 'publicotagCanvas';
};

let watch = {};
const created = function () {};
const mounted = function () {
    this.canvasWidth = (this.$refs.wrapper.clientWidth);
    this.canvasHeight = (this.$refs.wrapper.clientHeight);
};
const beforeDestroy = function () {
    TagCanvas.Delete(this.id);
};
const dataFunc = function () {
    let o = {
        canvasWidth: 0,
        canvasHeight: 0,
        list: undefined
    };
    return o;
};
module.exports = {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [
        require('mixins/index_layer.js'),
        require('mixins/transition/fade.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.index-layer-child {
}
.canvas-wrapper {
    height: 85%;
}
#tags {
    opacity: 0;
}
</style>
