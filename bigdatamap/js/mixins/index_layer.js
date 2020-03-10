const Context = require('global/tomap/context.js');

const created = function () {
};
const mounted = function () {
    this.fetchRender();
    if (this.onPOIClick) {
        Context.ebus.on('POIClick', this.onPOIClick);
    }
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
    if (this.onPOIClick) {
        Context.ebus.off('POIClick', this.onPOIClick);
    }
};
let methods = {};
methods.onNavClick = function (v, i) {
    if (this.navIndex === i) {
        return;
    }
    let oldIndex = this.navIndex;
    this.navIndex = i;
    if (this.myNavClick) {
        this.myNavClick(v, i, oldIndex);
    }
};
let computed = {};
computed.peopleUnitEdge = function () {
    return 10 * 10000;
};
computed.peopleTotalUnit = function () {
    if (!this.peopleTotal) {
        return '';
    }
    if (this.peopleTotal > this.peopleUnitEdge) {
        return '万人';
    }
    return '人';
};
computed.peopleTotalText = function () {
    if (!this.peopleTotal) {
        return '';
    }
    if (this.peopleTotal > this.peopleUnitEdge) {
        return Math.round(this.peopleTotal / 10000);
    }
    return this.peopleTotal;
};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {
            o: null,
            navIndex: 0,
            peopleTotal: 0
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
    mixins: [
        require('mixins/request_mix.js'),
        require('mixins/chart_mix.js')
    ],
    components: {
        'grid-box-2': require('comp/grid-box-2.vue')
    }
};