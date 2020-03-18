const beforeCreate = function () {
    this.transitionDirection = 'none';
};
const created = function () {
};
const mounted = function () {
    this.$on('window-resize', this.handleWindowResize);
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
    // this.loopRenderStop();
    this.$off('window-resize', this.handleWindowResize);
};
let methods = {};
methods.switchPart = function (index) {
    if (index === this.partIndex) {
        return;
    }
    if (index > this.partIndex) {
        this.transitionDirection = 'left';
    } else {
        this.transitionDirection = 'right';
    }
    this.partIndex = index;
};
methods.handleWindowResize = function (v) {
    if (this.$refs.part) {
        this.$refs.part.$emit('window-resize', v);
    }
};
methods.calHeadMinWidth = function (len) {
    let n = 200 + (180 * len);
    return n + 'px';
};
let computed = {};
computed.part = function () {
    return 'part-' + this.partIndex;
};
computed.layerWidth = function () {
    return '90%';
};
computed.layerHeight = function () {
    return '85%';
};
module.exports = {
    props: ['area', 'visible'],
    data: function () {
        var o = {
            partIndex: 0
        };
        return o;
    },
    beforeCreate,
    methods,
    computed,
    created,
    mixins: [
        require('comp/transition/x_mix.js')
    ],
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    components: {
        'head-nav': require('comp/analysis/head-nav.vue')
    }
};