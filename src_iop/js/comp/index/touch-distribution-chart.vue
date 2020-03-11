<template>
<div class="comp-touch-dd">
    <my-chart :o="o"/>
    <div class="my-text" v-show="totalSvcNum">
        <label>当前生效活动数</label>
        <strong v-text="totalSvcNum"></strong>
    </div>
</div>
</template>

<script>
const methods = {};
methods.getOption = function (data) {
    if (!data || !data.length) {
        return 'empty';
    }
    return {
        tooltip: this.getPieTooltip(),
        legend: {
            data: data.map(v => v.channelTitle),
            bottom: 20
        },
        series: {
            type: 'pie',
            // startAngle: 0,
            center: ['50%', '45%'],
            radius: [65, 90],
            minAngle: 10,
            label: {
                normal: {
                    formatter: '{b}：{c}'
                }
            },
            data: data.map(v => {
                return {
                    name: v.channelTitle,
                    value: v.svcNum
                }
            })
        }
    }
};
const computed = {};
computed.totalSvcNum = function () {
    let total = 0;
    if (!this.data) {
        return undefined;
    }
    this.data.forEach((item) => {
        total += item.svcNum;
    });
    return total;
};
const created = function () {};
const mounted = function () {
    Request.fetch2('/firstPageNew/getDistributionOfContactor').then((data) => {
        this.data = data;
        this.o = this.getOption(data);
    }).catch(() => {
        this.o = 'empty';
    });
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        data: undefined,
        o: null
    };
    return o;
};
export default {
    data: dataFunc,
    created,
    methods,
    computed,
    props: [],
    mounted,
    mixins: [require('mixins/echarts_mix.js')],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.comp-touch-dd {
    height: 100%;
    padding: 1px;
    position: relative;
}
.my-text {
    text-align: center;
    position: absolute;
    width: 100%;
    z-index: 2;
    top: 145px;
    line-height: 28px;
    label {
        display: block;
        color: #666;
    }
    strong {
        font-size: 28px;
        color: #DB5252;
    }
}
</style>
