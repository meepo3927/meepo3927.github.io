<template>
<div class="six-part six-part-2 inner-main">
    <div class="six-part-banner">
        <img :src="getBannerImg(1)" />
        <h3 v-text="sixTitle[1]"></h3>
        <h4 v-text="sixSubTitle[1]"></h4>
    </div>

    <!-- section 1 -->
    <div class="main-section mt15">
        <div class="six-intro-text" >为各行业提供基于大数据的客户特征洞察与客户细分。通过整合传统电信数据和行业相关数据，挖掘用户身份特征、消费价值特征、社交行为特征、地理位置特征等，构建行业客户细分群，从客户的基本属性、行为、偏好、心理、价值、满意度等角度进行客户细分，清晰描绘出客户全息精准画像，并通过标签输出或分析支撑等形式为各行业客户洞察和精准营销提供全方位的支撑。
        </div>
        <!-- 地图 -->
        <v-amap ref="map" slider="1" class="map-holder"
            @click="onMapClick"
            @radius-change="onRadiusChange" />

        <!-- 图表 -->
        <div class="chart-row mt20" v-if="point">
            <div class="chart-col">
                <my-chart :o="o1" />
            </div>
            <div class="chart-col">
                <my-chart :o="o2" />
            </div>
        </div>
        <div class="chart-row " v-if="point">
            <div class="chart-col">
                <my-chart :o="o3" />
            </div>
            <div class="chart-col">
                <my-chart :o="o4" />
            </div>
        </div>
    </div>

</div>
</template>

<script>
let methods = {};
methods.onMapClick = function (point) {
    this.point = point;
    this.$refs.map.drawMarkerCircle(point, {
        autoZoom: true
    });

    this.fetchRender();
};
methods.onRadiusChange = function () {
    if (!this.point) {
        return;
    }
    this.$refs.map.drawMarkerCircle(this.point, {
        autoZoom: true
    });
    this.fetchRender();
};
methods.fetchRender = function () {
    this.o1 = null;
    this.o2 = null;
    this.o3 = null;
    this.o4 = null;
    let p = this.getRequestParam(this.point);
    p.func = 'custLabelNumByDis';
    const req = this.vRequest.fetch3('/rest/custService', p);
    this.setPromise('custLabelNumByDis', req).then((data) => {
        this.o1 = this.getGenderOption(data);
        this.o2 = this.getAgeOption(data);
        this.o3 = this.getCarrerOption(data);
        this.o4 = this.getArpuOption(data);
    }).catch((e) => {
        this.o1 = 'empty';
        this.o2 = 'empty';
        this.o3 = 'empty';
        this.o4 = 'empty';
        LOG(e);
    });
};
let computed = {};
let watch = {};
const created = function () {};
const mounted = function () {};
const beforeDestroy = function () {};
const dataFunc = function () {
    let o = {
        o1: null,
        o2: null,
        o3: null,
        o4: null
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
        require('mixins/six_part.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
.six-part-2 {
}
.map-holder {
    height: 460px;
}
.chart-row {
    background-color: #F7F7F7;
    padding: 16px 0;
    font-size: 0;
}
.chart-col {
    display: inline-block;
    width: 50%;
    height: 400px;
    font-size: 100%;
    padding-left: 16px;
    padding-right: 16px;
    &:nth-child(1) {
        padding-right: 8px;
    }
    &:nth-last-child(1) {
        padding-left: 8px;
    }
}
</style>
