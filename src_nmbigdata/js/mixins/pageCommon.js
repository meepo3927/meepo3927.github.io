const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
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
    components: {
        'v-header': require('comp/page-header.vue'),
        'banner-slide': require('comp/banner-slide.vue'),
        'v-backtop': require('comp/mui/backtop.vue'),
        'v-copyright': require('comp/page-copyright.vue')
    }
};