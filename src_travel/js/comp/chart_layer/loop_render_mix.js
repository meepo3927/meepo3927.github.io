const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.loopRenderStart = function (interval = 10) {
    if (this.loopMaxPart) {
        var __loopMaxRenderIndex = this.loopMaxPart;
    } else if (this.$options.components) {
        let max = 0;
        for (let p in this.$options.components) {
            if (p.indexOf('-') < 0) {
                continue;
            }
            let a = p.split('-').pop();
            let n = parseInt(a, 10);
            if (n > max) {
                max = n;
            }
        }
        if (max) {
            __loopMaxRenderIndex = max;
        }
    }
    if (interval < 301) {
        interval *= 1000;
    }
    if (__loopMaxRenderIndex) {
        this.loopRenderStop();
        this.__loopMaxRenderTimer = setInterval(() => {
            let i = this.partIndex + 1;
            if (i > __loopMaxRenderIndex) {
                i = 1;
            }
            this.switchPart(i);
        }, interval);
    }
};
methods.loopRenderStop = function () {
    if (this.__loopMaxRenderTimer) {
        clearInterval(this.__loopMaxRenderTimer);
        this.__loopMaxRenderTimer = null;
    }
};
let watch = {};
let computed = {};
module.exports = {
    props: [],
    data: function () {
        var o = {};
        return o;
    },
    watch,
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy
};