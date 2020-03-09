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
let computed = {};
computed.heatmapBtnLabel = function () {
    return myStore.getters.label;
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