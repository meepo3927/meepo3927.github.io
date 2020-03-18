require('velocity');

let mounted = function () {
};
const beforeDestroy = function () {
};
let activated = function () {
};
let deactivated = function () {
};
let methods = {};
const duration = 700;
methods.tFadeInAnim = function (el, done) {
    $(el).velocity('stop').velocity({opacity: 0}, 0)
        .delay(1).velocity({opacity: 1}, {
        duration,
        complete: done
    });
};
methods.tFadeOutAnim = function (el, done) {
    $(el).velocity('stop').velocity({opacity: 1}, 0)
        .delay(1).velocity({opacity: 0}, {
        duration,
        complete: done
    });
};
let computed = {};
module.exports = {
    props: [],
    data: function () {
        var o = {};
        return o;
    },
    methods,
    computed,
    activated,
    deactivated,
    beforeDestroy,
    mounted: mounted
};