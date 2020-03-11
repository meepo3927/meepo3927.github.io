<template>
<vue-echarts class="my-chart" ref="echart"
    :loading="loading"
    :options="options"
    :theme="myTheme"
    :auto-resize="autoResize"
    @click="$emit('click', $event)"></vue-echarts>
</template>

<script>
require('echarts');
require('lib/echarts_theme/shine.js');
require('lib/echarts_theme/community.js');
var methods = {};
var computed = {};
computed.loading = function () {
    if (this.o === null || this.o === 'loading') {
        return true;
    }
    return false;
};
computed.myTheme = function () {
    return this.theme || 'shine';
};
computed.options = function () {
    if (this.o === 'empty') {
        return {
            title: {
                text: '暂无数据',
                left: 'center',
                top: 'middle'
            }
        };
    }
    return this.o;
};
computed.autoResize = function () {
    if (this.resize === false || this.resize === 'false') {
        return false;
    }
    if (this.resize === true || this.resize === 'true') {
        return true;
    }
    return true;
};
var watch = {};
var mounted = function () {
};
let beforeDestroy = function () {};
let dataFunc = function () {
    var o = {
    };
    return o;
};
export default {
    data: dataFunc,
    watch,
    mixins: [],
    methods,
    computed,
    props: ['o', 'theme', 'resize'],
    mounted,
    beforeDestroy,
    components: {
        'vue-echarts': require('comp/common/ECharts.vue')
    }
};
</script>

<style scoped lang="less">
.my-chart {
    
}
</style>