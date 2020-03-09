let mounted = function () {
};
const beforeDestroy = function () {};
let activated = function () {
};
let deactivated = function () {
};
let methods = {};
methods.windowMax = function () {
    this.$refs.clayer.fullMode(() => {
        this.$emit('window-resize', 'full');
    });
    this.isFullMode = true;
};
methods.windowRestore = function () {
    this.$refs.clayer.restoreMode(() => {
        this.$emit('window-resize', 'restore');
    });
    this.isFullMode = false;
};
let computed = {};
module.exports = {
    props: [],
    data: function () {
        var o = {
            isFullMode: false
        };
        return o;
    },
    methods,
    computed,
    activated,
    deactivated,
    mounted: mounted,
    beforeDestroy
};