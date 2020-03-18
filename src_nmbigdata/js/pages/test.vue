<template>
<div class="page-test">
    <div class="chart-1">
        <my-chart :o="o" />
        <!--
        <div class="lb-1">男<br />68%</div>
        <div class="lb-2">女<br />32%</div>
        -->
    </div>
</div>
</template>

<script>
import 'lib/geo/neimenggu.js';
import EChartUtil from 'util/echart.js';
let methods = {};
methods.initMapChart = function () {
    this.o = {
        tooltip: {
            trigger: 'item',
            formatter: (p) => {
                if (!p.value) {
                    return;
                }
                return p.seriesName + '<br />'
                    + EChartUtil.getTooltipDotHtml(p.color)
                    + p.name + '：' + p.value;
            }
        },
        geo: {
            type: 'map',
            map: '内蒙古',
            roam: true,
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 2,
                color: '#000'
            },
            regions: [{
                name: '呼和浩特市'
            },{
                name: '锡林郭勒盟',
                itemStyle: {
                }
            }]
            //mapType: 'china',
        },
        title : {
            // text: '测试图表',
            // subtext: '纯属虚构',
            // left: 'center'
        },
        series: {
            name: 'ye',
            type: 'map',
            geoIndex: 0,
            data: [{
                name: '呼和浩特市',
                value: 200
            },{
                name: '包头市',
                value: 190
            },{
                name: '呼伦贝尔市',
                value: 80
            }]
        }
    };
};
methods.initHalfPie = function () {
    this.o = {
        title: {
            text: '半圆测试'
        },
        series: {
            radius: [80, 120],
            type: 'pie',
            startAngle: 180,
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            data: [
                {name: '男', value: 300},
                {name: '女', value: 250},
                {
                    name: '空', value: 300 + 250,
                    itemStyle: {
                        opacity: 0
                    }
                }
            ]
        }
    };
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {
    this.initMapChart();
    //this.initHalfPie();
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
    watch,
    props: [],
    mounted,
    mixins: [],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.page-test {
    
}
.chart-1 {
    height: 760px;
    position: relative;
    .lb-1,
    .lb-2 {
        position: absolute;
        top: 334px;
        left: 50%;
        text-align: center;
        font-size: 14px;
    }
    .lb-1 {
        margin-left: -120px;
    }
    .lb-2 {
        margin-left: 90px;
    }
}
</style>
