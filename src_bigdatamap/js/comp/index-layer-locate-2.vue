<template>
<div class="index-layer-child-2">
    <div class="chart-1">
        <my-chart :o="o" />
    </div>
</div>
</template>

<script>
const MAX_W = 520;
const MAX_H = 230;
let methods = {};
methods.getOption = function (data) {
    return {
        tooltip: this.getBarTooltip(),
        legend: {
            top: 9,
            data: data.map(v => v.name)
        },
        xAxis: {
            type: 'value',
            name: '人数',
            max: 'dataMax'
        },
        grid: {
            containLabel: true,
            top: 65,
            left: 25,
            right: 55,
            bottom: 1
        },
        yAxis: {
            name: '驻留时长',
            nameGap: 12,
            type: 'category',
            data: ['1小时以内', '1至2小时', '2至3小时', '3至4小时', '4小时以上']
        },
        series: data.map(v => {
            return {
                type: 'bar',
                name: v.name,
                stack: 'all',
                label: {show: true},
                data: v.value
            }
        })
    }
};
methods.fetchRender = function () {
    let p = this.$store.getters.cityParam;
    this.vRequest.fetch2('/locate/stayTotal', p).then((data) => {
        this.o = this.getOption(data);
    }).catch((e) => {
        this.o = 'empty';
    });
};
methods.getStyle = function (flag) {
    let w = this['w' + flag];
    if (!w) {
        return;
    }
    let h = Math.round(w * 0.8);
    let style = {
        width: w + 'px',
        height: h + 'px',
        paddingTop: (h / 2 - 36) + 'px',
        top: Math.round((MAX_H - h) / 2) + 'px'
    };
    const PAD_RATIO = 0.8;
    if (flag === 0) {
        left = Math.round((MAX_W / 2) - w) + 25;
        style.left = left + 'px';
    } else if (flag === 1) {
        left = Math.round((MAX_W / 2) - 0) - 25;
        style.left = left + 'px';
    }
    return style;
};
let computed = {};
computed.w0 = function () {
    return 226;
};
computed.w1 = function () {
    return 192;
};
let watch = {};
const created = function () {};
const mounted = function () {
};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        list: undefined,
        intersection: 0
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
.pie-0, .pie-1,
.border-0, .border-1 {
    position: absolute;
    border-radius: 50%;
    text-align: center;
    .v-line-1 {
        margin-top: 15px;
    }
}
.border-0, .border-1 {
    border: 1px solid #fff;
}

.pie-0 {
    background-color: rgba(112,173,71, .7);
}

.pie-1 {
    background-color: rgba(135,71,28, .7);
}
.v-middle {
    position: absolute;
    text-align: center;
    width: 60px;
    left: 50%;
    margin-left: -30px;
    top: 96px;
}
</style>
