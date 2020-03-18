const created = function () {
    this.promiseHolder = {};
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
    this.cleanPromise();
};
let methods = {};
methods.setPromise = function (name, p) {
    if (this.promiseHolder[name]) {
        this.promiseHolder[name].cancel();
        this.promiseHolder[name] = null;
    }
    this.promiseHolder[name] = p;
    return p;
};
methods.cleanPromise = function () {
    for (let i in this.promiseHolder) {
        if (this.promiseHolder.hasOwnProperty(i)) {
            let p = this.promiseHolder[i];
            if (p && p.cancel) {
                p.cancel();
            }
            p = null;
        }
    }

    this.promiseHolder = {};
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
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    mixins: [],
    components: {}
};