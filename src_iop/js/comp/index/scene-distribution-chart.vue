<template>
<div class="comp-scene-dd">
    <my-chart :o="o" />
</div>
</template>

<script>
const methods = {};
methods.getOption = function (data) {
    if (!data || !data.length) {
        return 'empty';
    }
    let max = 0;
    data.forEach((item) => {
        item.value = item.mpSubs ? (Math.sqrt(item.mpSubs) / 20) : 0;
        // item.value = item.mpSubs;
        max = Math.max(max, item.value);
    });
    const dataShadow = [];
    data.forEach(() => {
        dataShadow.push(max);
    });
    const getTooltipStr = (o) => {
        const num = (o.data) ? o.data.mpSubs : o.value;
        return (o.marker || '') + o.name + '：' + num + '人';
    };
    const labelFormatter = (p) => {
        if (p.data) {
            return p.data.mpSubs;
        }
        return p.value;
    };
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: (p) => {
                if (p[1]) {
                    return getTooltipStr(p[1]);
                } else if (p[0]) {
                    return getTooltipStr(p[0]);
                } else {
                    return getTooltipStr(p);
                }
            }
        },
        grid: {
            top: 30,
            left: 15,
            right: 85,
            bottom: 20,
            containLabel: true
        },
        xAxis: {
            type: 'value',
            max: 'dataMax',
            show: false,
            splitLine: {show: false},
            name: '用户数\n(剔重)'
        },
        yAxis: {
            type: 'category',
            inverse: true,
            data: data.map(v => v.mpType)
        },
        series: [{
            type: 'bar',
            data: dataShadow,
            itemStyle: {
                normal: {color: 'rgba(0,0,0,0.05)'}
            },
            barGap: '-100%',
            barWidth: 24,
            animation: false
        }, {
            type: 'bar',
            barWidth: 24,
            label: {
                normal: {
                    show: true,
                    formatter: labelFormatter,
                    position: 'right'
                }
            },
            data: data.map(v => {
                return {
                    mpSubs: v.mpSubs,
                    value: v.value
                }
            })
        }]
    }
};
const computed = {};
const created = function () {};
const mounted = function () {
    Request.fetch2('/firstPageNew/getSendNumOfMessage').then((data) => {
        this.o = this.getOption(data);
    }).catch(() => {
        this.o = 'empty';
    })
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
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
.comp-scene-dd {
    height: 100%;
    padding: 1px;
}
</style>
