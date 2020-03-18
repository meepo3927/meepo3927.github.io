const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.switchUserType = function (v) {
    if (this.userType === v) {
        return;
    }
    this.userType = v;
    this.fetchRender();
};
methods.getDimParam = function () {
    if (this.isEnterCity) {
        return 'roma';
    } else if (this.isLeaveCity) {
        return 'outside';
    }
    if (this.isAttraction || this.isCity) {
        return 'scenery';
    } else if (this.isCity) {
        return 'scenery';
    }
};
methods.getUserTypeParam = function () {
    if (this.userType === '0' || this.userType === 0) {
        return undefined;
    }
    return (4 - this.userType);
};
let computed = {};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {
            userType: '0'
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