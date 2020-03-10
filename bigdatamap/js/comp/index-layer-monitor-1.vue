<template>
<div class="index-layer-child-2">
    <!-- <h4 v-text="myTitle"></h4> -->
    <div class="m-row mt10">
        <div class="col-1">
            <grid-box-2>
                <div class="v-line-1">
                    <i class="iconfont icon-renqun"></i>
                    <span>人口总量</span>
                </div>
                <div class="v-line-2">
                    <em v-text="peopleTotalText"></em>
                    <span v-text="peopleTotalUnit"></span>
                </div>
            </grid-box-2>
        </div>
        <div class="col-2">
            <div class="chart-1"><my-chart :o="o" /></div>
        </div>
    </div>
    
</div>
</template>

<script>
let methods = {};
methods.fetchRender = function () {
    let p = {cityId: this.$store.getters.cityId};
    // 图表
    let req = this.vRequest.fetch2('/monitor/peopleTotal', p);
    this.o = null;
    this.peopleTotal = 0;
    this.setPromise('fetchRender', req).then((data) => {
        this.o = this.getOption(data);
        this.peopleTotal = this.getTotal(data);
    }).catch((e) => {
        this.o = 'empty';
    });
};
methods.getTotal = function (data) {
    let num = 0;
    data.forEach((item) => {
        num += item.man + item.woman;
    });
    return num;
};
methods.getOption = function (data) {
    let innerRadius = 50;
    let outerRadius = innerRadius + 8;
    let maxRadius = 72;
    let ss1 = {
        type: 'pie',
        name:'人口总数',
        radius: [0, innerRadius + '%'],
        label: {
            position: 'inner',
            formatter: (p) => {
                return p.name + '\n' + p.percent + '%';
            }
        },
        itemStyle: {
            borderColor: '#ffffff'
        },
        data: data.map((v, i) => {
            return {
                name: v.name,
                value: v.man + v.woman
            }
        })
    };
    let data2 = [];
    data.forEach((v, i) => {
        if (i === 0) {
            data2.push({
                name: v.name + '-男', value: v.man
            });
            data2.push({
                name: v.name + '-女', value: v.woman
            });
        } else {
            data2.push({
                name: v.name + '-女', value: v.woman
            });
            data2.push({
                name: v.name + '-男', value: v.man
            });
        }
    });
    let ss2 = {
        type: 'pie',
        name: '性别比例',
        radius: [outerRadius + '%', maxRadius + '%'],
        label: {
            formatter: (p) => {
                return p.name.split('-')[1] + ':' + p.value;
            }
        },
        data: data2
    };
    return {
        tooltip: this.getPieTooltip(),
        color: [
            '#3A91DB', '#F26C60',
            '#53FBD9', 
            '#EC3C6A', '#EC3C6A',
            '#53FBD9'
        ],
        series: [
            ss1, ss2
        ]
    };
};
methods.onPOIClick = function (point, name, instance) {
};
let computed = {};
computed.myTitle = function () {
    return this.titlePrefix + '人口分布';
};
let watch = {};
const created = function () {};
const mounted = function () {
};
const beforeDestroy = function () {
};
const dataFunc = function () {
    let o = {
        titlePrefix: '全市'
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
.m-row {
    margin-left: 40px;
}
.col-1 {
    padding-top: 45px;
    width: 30%;
}
.col-2 {
    width: 50%;
}
</style>
