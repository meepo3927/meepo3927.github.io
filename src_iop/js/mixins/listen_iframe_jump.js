let iframeUtil = require('iframeUtil');
const created = function () {
};
const mounted = function () {
    iframeUtil.on('iopjump', (data) => {
        iframeUtil.send('jump', data, window.parent);
    });
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
let computed = {};
module.exports = {
    props: [],
    data: function () {
        var o = {};
        return o;
    },
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy
};