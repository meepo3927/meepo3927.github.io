<template>
<vue-echarts class="my-chart" ref="vuechart"
    :loading="loading"
    :options="options"
    :theme="myTheme"
    :auto-resize="autoResize"
    @click="$emit('click', $event)" />
</template>

<script>
import VueCharts from 'comp/common/vue-echarts.vue';
const methods = {};
methods.getEmptyOption = function () {
    return {
        title: {
            text: '暂无数据',
            top: 'middle',
            left: 'center'
        }
    };
};
const computed = {};
computed.loading = function () {
    if (this.o === undefined) {
        return true;
    }
    return false;
};
computed.myTheme = function () {
    return this.theme || '';
};
computed.options = function () {
    if (this.o === null) {
        return this.getEmptyOption();
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
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    var o = {};
    return o;
};
export default {
    data: dataFunc,
    methods,
    computed,
    props: ['o', 'theme', 'resize'],
    mounted,
    beforeDestroy,
    components: {
        'vue-echarts': VueCharts
    }
};
</script>
