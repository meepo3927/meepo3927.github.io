<template>
<div class="index-layer-child">
    <h4>信用分布</h4>
    <div class="chart-1">
        <my-chart :o="o" />
    </div>
    
</div>
</template>

<script>
const config = require('global/config.js');
const CREDIT_DEFINE = config.CREDIT_DEFINE;

let methods = {};
methods.getOption = function (data) {
    return {
        tooltip: this.getBarTooltip(),
        grid: {
            top: 30,
            bottom: 25,
            left: 13,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                interval: 0
            },
            data: data.map(v => v.name)
        },
        yAxis: {
            type: 'value',
            show: false,
            splitLine: {
                show: false
            }
        },
        series: this.getBarSeries({
            label: {
                show: true,
                position: 'top'
            },
            itemStyle: {
                borderColor: '#ffffff',
                borderWidth: 1,
                barBorderRadius: [4, 4, 0, 0]
            },
            data: data.map((v ,i) => {
                return {
                    itemStyle: {
                        color: (CREDIT_DEFINE[i] ? CREDIT_DEFINE[i].color : undefined)
                    },
                    value: v.value
                }
            })
        })
    };
};
methods.fetchRender = function () {
    let p = this.$store.getters.cityParam;
    this.vRequest.fetch2('/credit/total', p).then((data) => {
        data.sort((a, b) => {
            if (~a.name.indexOf('高')) {
                return -1;
            } else if (~b.name.indexOf('高')) {
                return 1;
            }

            if (~a.name.indexOf('低')) {
                return 1;
            } else if (~b.name.indexOf('低')) {
                return -1;
            }
            return 0;
        });
        this.o = this.getOption(data);
    }).catch(() => {
        this.o = 'empty';
    });
};
let computed = {};
;
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {

    };
    return o;
};
module.exports = {
    data: dataFunc,
    created,
    methods,
    computed,
    watch,
    props: [],
    mounted,
    mixins: [
        require('mixins/index_layer.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.index-layer-child {
    
}
</style>
