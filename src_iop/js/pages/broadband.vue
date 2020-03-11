<template>
<div class="page-broadband">
    <page-title main="策略库" sub="高价值潜在宽带客户小区分析" />
    <div class="main-wrapper">
        <div class="community-list-box">
            <ul v-if="list">
                <li v-for="(v, i) in list">
                    <span v-text="(i + 1)" class="v-number"></span>
                    <!-- 名称 -->
                    <div v-text="v.name" class="v-name" title="定位到该小区"
                        @click="onItemClick(v)"></div>
                    <!-- 综合评分 -->
                    <div class="v-level">综合评分：<strong>{{v.level}}</strong></div>
                </li>
            </ul>
            <div class="v-loading" v-if="list === undefined">
                <img :src="loadingSrc" />
            </div>
        </div>
        <div class="gis-wrapper">
            <iframe :src="gisUrl" frameborder="0" scrolling="no"
                ref="fm"></iframe>
        </div>
    </div>

    <!-- 小区分析浮层 -->
    <community-chart-layer v-if="layerCommunityVisible" @close="closeCommunity"
        :cid="communityId" />
</div>
</template>

<script>
import iframeUtil from 'iframeUtil';

let methods = {};
methods.fetchRender = function () {
    this.vRequest.fetch2('/broadband/query').then((data) => {
        this.list = data;
    });
};
methods.onItemClick = function (item) {
    iframeUtil.send('render_community', item.id, this.$refs.fm);
};
methods.onGisReady = function () {
    this.isGisReady = true;
    let branchId = Config.user.branchId;
    let cityId = '400';
    if (branchId) {
        cityId = '4' + branchId.substr(0, 2);
    }
    if (cityId === '400') {
        cityId = '471';
    }
    iframeUtil.send('color_by', 'star', this.$refs.fm);
    iframeUtil.send('render_city', {
        cityId: cityId,
        countyId: '00'
    }, this.$refs.fm);
};
methods.showCoummnity = function () {
    this.layerCommunityVisible = true;
};
methods.closeCommunity = function () {
    this.layerCommunityVisible = false;
};
methods.communityAnalysis = function (id) {
    this.communityId = id;
    this.showCoummnity();
};
let computed = {};
computed.gisUrl = function () {
    return 'http://10.220.19.32:9105/homebroadband/view/tdMap.html';
};
computed.loadingSrc = function () {
    return this.vImgPath + '/loading_bar.gif'
};
let watch = {};
const created = function () {};
const mounted = function () {
    window.VM = this;
    iframeUtil.on('gis_ready', this.onGisReady);
    iframeUtil.on('community_analysis', this.communityAnalysis);
    this.fetchRender();
};
const beforeDestroy = function () {
};
const dataFunc = function () {
    let o = {
        list: undefined,
        communityId: '',
        layerCommunityVisible: false
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
    mixins: [
        require('mixins/request_mix.js')
    ],
    beforeDestroy,
    components: {
        'community-chart-layer': require('comp/community-chart-layer.vue')
    }
};
</script>

<style scoped lang="less">
@import "../ref";
@left-width:  280px;
.page-broadband {
    padding: 5px 15px 0 15px;
}
.main-wrapper {
    height: calc(~'100vh - 65px');
    background-color: #fff;
    position: relative;
}
.community-list-box {
    position: absolute;
    top: 0;
    left: 0;
    width: @left-width;
    height: 100%;
    border-right: 1px solid #ccc;
    overflow-x: hidden;
    overflow-y: auto;
    .v-loading {
        text-align: center;
        padding-top: 30px;
    }
    & > ul > li {
        border-bottom: 1px dashed #ccc;
        position: relative;
        padding: 15px 15px 15px 50px;
        .v-number {
            position: absolute;
            width: 32px;
            height: 32px;
            padding-top: 4px;
            color: #fff;
            background: url("../../images/map_marker.png") no-repeat center center;
            text-align: center;
            top: 10px;
            left: 10px;
        }
        .v-name {
            font-size: 16px;
            color: #0080FF;
            cursor: pointer;
        }
        .v-level {
            font-size: 13px;
            margin-top: 4px;
            strong {
                color: #ea3944;
            }
        }
    }
}
.gis-wrapper {
    margin-left: @left-width;
    height: 100%;
    iframe {
        width: 100%;
        height: 100%;
    }
}
</style>
