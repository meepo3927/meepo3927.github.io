let tool = require('util/tool.js');

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.getPreferBarOption = function (o) {
    let grid = this.barGrid();
    grid.right = '15%';
    let option = tool.extend({
        tooltip: this.getBarTooltip(),
        grid,
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            axisTick: {show: false}
        },
        series: [this.getBarSeries({
            name: '数量',
            label: {
                normal: {
                    position: 'right'
                }
            }
        })]
    }, o);
    return this.getDefaultOption(option);
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