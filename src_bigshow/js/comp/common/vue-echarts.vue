<template>
<div class="vue-echarts"></div>
</template>

<style scoped lang="less">
.vue-echarts {
    height: 100%;
}
</style>

<script>
import echarts from 'echarts';
const LOADING_COLOR = '#30D434';
// enumerating ECharts events for now
const ACTION_EVENTS = [
    'legendselectchanged',
    'legendselected',
    'legendunselected',
    'datazoom',
    'datarangeselected',
    'timelinechanged',
    'timelineplaychanged',
    'restore',
    'dataviewchanged',
    'magictypechanged',
    'geoselectchanged',
    'geoselected',
    'geounselected',
    'pieselectchanged',
    'pieselected',
    'pieunselected',
    'mapselectchanged',
    'mapselected',
    'mapunselected',
    'axisareaselected',
    'brush',
    'brushselected'
];

const MOUSE_EVENTS = [
    'click',
    'dblclick',
    'mouseover',
    'mouseout',
    'mousedown',
    'mouseup',
    'globalout'
];
const methods = {};
methods.reset = function () {
    this.clear();
    if (this.loading && this.chart) {
        this.chart.showLoading('default', {color: LOADING_COLOR});
    }
};
// just delegates ECharts methods to Vue component
// provide a explicit merge option method
methods.mergeOptions = function (options) {
    this._delegateMethod('setOption', options)
};
methods.resize = function (options) {
    this._delegateMethod('resize', options)
};
methods.dispatchAction = function (payload) {
    this._delegateMethod('dispatchAction', payload)
};
methods.clear = function () {
    this._delegateMethod('clear')
};
methods.dispose = function () {
    this._delegateMethod('dispose');
    this.chart = null;
};
methods._delegateMethod = function (name, ...args) {
    if (!this.chart) {
        Vue.util.warn(`Cannot call [${name}] before the chart is initialized.`, this);
        return
    }
    return this.chart[name](...args)
};
methods._init = function () {
    if (this.chart) {
        return;
    }
    let chart = echarts.init(this.$el, this.theme, this.initOptions);
    chart.setOption(this.options || {});
    // expose ECharts events as custom events
    ACTION_EVENTS.forEach(event => {
        chart.on(event, params => {
            this.$emit(event, params);
        });
    });
    MOUSE_EVENTS.forEach(event => {
        chart.on(event, params => {
            this.$emit(event, params);
        });
    });
    if (this.autoResize !== false) {
        this.bindResize();
    }
    this.chart = chart;
};
methods.resizeHanlder = function () {
    if (this.chart) {
        this.chart.resize();
    }
};
methods.bindResize = function () {
    window.addEventListener('resize', this.resizeHanlder);
};
methods.unbindResize = function () {
    window.removeEventListener('resize', this.resizeHanlder)
};
methods.isDisposed = function () {
    if (this.chart) {
        return this.chart.isDisposed()
    }
    return true;
};
methods.onTouchStart = function (e) {
    if (this.$el === e.target) {
        return false;
    }
    if (this.$el.contains(e.target)) {
        return false;
    }
    if (this.chart) {
        this.chart.dispatchAction({
            type: 'hideTip'
        });
    }
};
const watch = {};
watch.options = {
    deep: true,
    handler: function (options) {
        if (options) {
            if (!this.chart) {
                this._init();
            } else {
                this.chart.setOption(this.options, true);
            }
        } else {
            this.reset();
        }
    }
};
watch.loading = function (v) {
    if (!this.chart) {
        return;
    }
    if (v) {
        this.chart.showLoading('default', {color: LOADING_COLOR});
    } else {
        this.chart.hideLoading();
    }
};
watch.autoResize = function (v) {
    if (v === false) {
        this.unbindResize();
    } else {
        this.bindResize();
    }
};
const computed = {};
const mounted = function () {
    this._init();
    if (this.loading) {
        this.chart.showLoading('default', {color: LOADING_COLOR});
    }
    document.addEventListener('touchstart', this.onTouchStart, false);
};
const beforeDestroy = function () {
    this.unbindResize();
    if (this.chart) {
        this.dispose();
    }
    document.removeEventListener('touchstart', this.onTouchStart, false);
};
export default {
    props: {
        options: Object,
        theme: String,
        initOptions: Object,
        loading: Boolean,
        autoResize: Boolean
    },
    data: function () {
        return {}
    },
    watch,
    methods,
    computed,
    mounted,
    beforeDestroy
}
</script>
