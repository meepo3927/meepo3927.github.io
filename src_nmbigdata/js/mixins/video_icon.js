const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.vlog = function (str) {
    //LOG(str);
};
methods.vPlay = function () {
    if (this.$refs.v) {
        this.$refs.v.play();
    }
};
methods.onCanplay = function () {
    this.oIconVisible = true;
    this.vlog('onCanplay');
};
methods.onPlay = function () {
    this.oIconVisible = false;
    this.vlog('onPlay');
};
methods.onPlaying = function () {
    this.oIconVisible = false;
    this.vlog('onPlaying');
};
methods.onPause = function () {
    this.oIconVisible = true;
    this.vlog('onPause');
};
methods.onEnd = function () {
    this.oIconVisible = true;
    this.vlog('onEnd');
};
methods.onError = function () {
    this.vlog('onError');
};
let computed = {};
computed.iconVisible = function () {
    if (this.vConfig.isFirefox) {
        return false;
    }
    return this.oIconVisible;
};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {
            oIconVisible: false
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