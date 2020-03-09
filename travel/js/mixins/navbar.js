let myStore = require('store/rightbar.js');

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.click = function (index) {
    this.$emit('click', index);
};
methods.toggle = function () {
    if (this.overflowHidden) {
        this.overflowHidden = false;
    } else {
        this.overflowHidden = true;
    }
};
methods.toggleHeatmap = function () {
    myStore.commit('toggle');
};
let computed = {};
computed.heatmapBtnLabel = function () {
    return myStore.getters.label;
};
computed.toggleTitle = function () {
    return (this.overflowHidden) ? '展开' : '收起';
};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {
            overflowHidden: true
        };
        return o;
    },
    watch,
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    mixins: [],
    components: {}
};