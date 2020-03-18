let mounted = function () {
};
const beforeDestroy = function () {
};
let activated = function () {
};
let deactivated = function () {
};
let methods = {};
const transitionDuration = 350;
methods.enterXAnim = function (el, done) {
    let xFrom = '100%';
    if (this.transitionDirection === 'right') {
        xFrom = '-100%';
    }
    let xTo = '0%';
    let duration = transitionDuration;
    if (this.transitionDirection === 'none') {
        duration = 0;
    }
    $(el).velocity('stop').velocity({translateX: xFrom}, 0)
        .delay(1).velocity({translateX: xTo}, {
        duration,
        complete: done
    });
};
methods.leaveXAnim = function (el, done) {
    let xFrom = '0%';
    let xTo = '-100%';
    if (this.transitionDirection === 'right') {
        xTo = '100%';
    }
    let duration = transitionDuration;
    if (this.transitionDirection === 'none') {
        duration = 0;
    }
    $(el).velocity('stop').velocity({translateX: xFrom}, 0)
        .delay(1).velocity({translateX: xTo}, {
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