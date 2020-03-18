let EventBus = require('util/event_bus.js');

const ebus = new EventBus();

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.loadMapScript = function (callback) {
    callback = callback || (function () {});
    if (window.BMap) {
        return callback(BMap);
    }
    let timer = setInterval(() => {
        if (window.BMap) {
            callback(window.BMap);
            clearInterval(timer);
        }
    }, 150);
};
let computed = {};
let watch = {};
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
    beforeDestroy,
    mixins: [],
    components: {}
};