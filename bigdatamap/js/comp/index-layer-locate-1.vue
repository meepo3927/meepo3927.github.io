<template>
<div class="index-layer-child-2">
    <div class="chart-1">
        <my-chart :o="o" />
    </div>
</div>
</template>

<script>
let methods = {};
methods.getOption = function (data) {
    let klfgMax = 0;
    let khxqMax = 0;
    let fzjhMax = 0;
    let jzxsMax = 0;
    let ratio = 1.2;
    let legend = data.map((v) => {
        klfgMax = Math.max(klfgMax, v.klfg_value * ratio);
        khxqMax = Math.max(khxqMax, v.khxq_value * ratio);
        fzjhMax = Math.max(fzjhMax, v.fzjh_value * ratio);
        jzxsMax = Math.max(jzxsMax, v.jzxs_value * ratio);
        return v.gridTypeDesc;
    });
    return {
        tooltip: {
            trigger: 'item',
            confine: true
        },
        legend: {
            data: legend,
            orient: 'verticle',
            right: 10,
            bottom: 10
        },
        radar: {
            name: {
                color: '#fff',
                fontSize: 13
            },
            radius: '70%',
            indicator: [
                {name: '客流规模', max: Math.round(klfgMax)},
                {name: '购买能力', max: Math.round(khxqMax)},
                {name: '消费增长', max: Math.round(fzjhMax)},
                {name: '地段估值', max: Math.round(jzxsMax)}
            ]
        },
        series: {
            name: '区域分析',
            type: 'radar',
            symbolSize: 8,
            lineStyle: {
                width: 4
            },
            data: data.map((v) => {
                return {
                    name: v.gridTypeDesc,
                    value: [v.klfg_value, v.khxq_value, v.fzjh_value, v.jzxs_value]
                }
            })
        }
    };
};
methods.fetchRender = function () {
    let p = this.$store.getters.cityParam;
    this.vRequest.fetch2('/locate/areaRadar', p).then((data) => {
        this.o = this.getOption(data);
    }).catch((e) => {
        this.o = 'empty';
        LOG(e);
    });
};

let computed = {};

let watch = {};
const created = function () {};
const mounted = function () {
};
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
    components: {
    }
};
</script>

<style scoped lang="less">
.index-layer-child-2 {
    
}

</style>
