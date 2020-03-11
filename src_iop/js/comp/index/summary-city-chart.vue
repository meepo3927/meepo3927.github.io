<template>
<center-layer close="1" height="80vh" @ready="onReady" @close="onClose">
    <my-chart :o="o" class="chart-1 center-layer-inner-1" 
        v-if="isReady" />
</center-layer>
</template>

<script>
const methods = {};
methods.onReady = function () {
    this.isReady = true;
};
methods.onClose = function () {
    Vue.$disposeComponent(this);
};
methods.getOption = function (datalist) {
    if (!datalist || !datalist.length) {
        return 'empty';
    }
    // 按覆盖用户数排序
    datalist.sort((a, b) => {
        return (a.msisdnNum > b.msisdnNum) ? -1 : 1
    });
    const userNumFormatter = (p) => {
        const userNum = p.value;
        if ((userNum + '').length >= 6) {
            return Math.round(userNum / 10000) + '万';
        }
        return userNum + '';
    };
    return {
        title: {
            text: '各地市营销数据汇总',
            subtext: '数据从本年度1月开始累计',
            top: 12,
            left: 'center'
        },
        tooltip: this.getBarTooltip(),
        legend: {
            data: ['创建活动数', '营销用户数', '营销成功率'],
            bottom: 10
        },
        grid: {
            top: 70,
            left: 25,
            right: 25,
            bottom: 42,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                interval: 0
            },
            data: datalist.map(v => v.cityName)
        },
        yAxis: [
            {
                type: 'value',
                boundaryGap: ['0', '20%']
            },
            {
                type: 'value',
                splitLine: {show: false},
                boundaryGap: ['0', '20%']
            },
            {
                type: 'value',
                boundaryGap: ['300%', 0],
                show: false
            }
        ],
        series: [
            {
                name: '创建活动数',
                type: 'bar',
                label: {
                    normal: {
                        show: true
                    }
                },
                data: datalist.map(v => v.svcNum)
            },
            {
                name: '营销用户数',
                type: 'bar',
                yAxisIndex: 1,
                label: {
                    normal: {
                        formatter: userNumFormatter,
                        show: true
                    }
                },
                data: datalist.map(v => v.msisdnNum)
            },
            {
                name: '营销成功率',
                type: 'line',
                label: {
                    normal: {
                        formatter: '{c}%',
                        show: true
                    }
                },
                yAxisIndex: 2,
                data: datalist.map(v => {
                    return Math.round(v.rateOfSuccess * 1000) / 1000
                })
            }
        ]
    }
};
const computed = {};
const created = function () {};
const mounted = function () {
    Request.fetch2('/firstPageNew/getMoreBranchData').then((result) => {
        this.o = this.getOption(result);
    }).catch(() => {
        this.o = 'empty';
    });
};
const beforeDestroy = function () {
};
const dataFunc = function () {
    let o = {
        isReady: false,
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
    mixins: [
        require('mixins/echarts_mix.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.chart-1 {
    width: 88vw;
}
.center-layer-inner-1 {
    padding: 2px 3px;
}
</style>
