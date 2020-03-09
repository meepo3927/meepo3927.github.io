const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.lineMoveOneByOne = function (i) {
    let item = this.olist && this.olist[i];
    if (!item) {
        return;
    }

    item.lineMove = true;

    setTimeout(() => {
        item.lineMove = false;
    }, 520);

    setTimeout(() => {
        this.lineMoveOneByOne(i + 1);
    }, 120);
};
methods.lineMove = function () {
    this.lineMoveOneByOne(0);
    setTimeout(() => {
        this.lineMove();
    }, this.loopInterval);
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
