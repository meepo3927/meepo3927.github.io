<template>
<div class="twelve-cell">
    <div class="my-wrapper">
        <!-- 名字和人数 -->
        <div class="v-info">
            <div class="v-name" @click="onSceneryClick">
                <span v-text="sceneryName" v-marquee="{interval: 30, gap: 20}"></span>
            </div>
            <div class="v-num common-verticle-rotate" :class="{rotating}"
                v-show="userNum !== undefined">
                <strong v-text="userNum"></strong>
                <em>人</em>
            </div>
        </div>
        <!-- 线条 -->
        <div class="corner-1"></div>
        <div class="corner-2"></div>
        <div class="line-1"></div>
        <div class="v-line"></div>
        <!-- 圆圈 -->
        <img :src="circleImgSrc" class="circle-img" />
        <!-- 景区图片 -->
        <img :src="myImgSrc" class="my-img" />
        <!-- 地图 -->
        <div class="map-instance" ref="map"></div>
        <img :src="mapCover" class="map-cover" />
    </div>
</div>
</template>

<script>
import request from 'util/request.js';
let methods = {};
methods.fetchRender = function () {
    request.getAttractionDetail(this.mySceneryId).then((data) => {
        this.updateNum(data);
        clearTimeout(this.fetchTimer);
        this.fetchTimer = setTimeout(this.fetchRender, 4500);
    });
};
let computed = {};
computed.mySceneryId = function () {
    return this.data.sceneryID || 7122;
};
computed.circleImgSrc = function () {
    return this.vImgPath + '/twelve/circle.png';
};
computed.myImgSrc = function () {
    return this.vImgPath + '/twelve/' + this.mySceneryId + '.jpg';
};
computed.mapCover = function () {
    return this.vImgPath + '/twelve/map_cover.png';
};
let watch = {};
const created = function () {};
const mounted = function () {
    this.initMap(this.data);
    this.fetchRender();
};
const beforeDestroy = function () {
};
const dataFunc = function () {
    let o = {
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
        require('mixins/twelve_cell.js')
    ],
    beforeDestroy,
    components: {}
};
</script>

<style scoped lang="less">
@i-top: 70px;
@i-right: 40px;
@i-width: 190px;
@i-height: 76px;
@line-color: #24F0FB;
@corner-size: 40px;
@content-z:  300;
@cover-z:  150;
.twelve-cell {
    width: 25vw;
    height: 33.3vh;
}
.my-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
}
.map-instance {
    width: 100%;
    height: 100%;
}
.map-cover {
    position: absolute;
    top: 0;
    left: 0;
    z-index: @cover-z;
    pointer-events: none;
}
.map-instance {
    background-color: #ccc;
}
.circle-img {
    position: absolute;
    top: 10px;
    left: 13px;
    width: 200px;
    height: 200px;
    z-index: @content-z - 1;
}
.my-img {
    position: absolute;
    top: 23px;
    left: 28px;
    z-index: @content-z;
    border-radius: 50%;
    //width: 178px;
}
.v-info {
    position: absolute;
    text-align: center;
    top: @i-top;
    right: @i-right;
    width: @i-width;
    height: @i-height;
    background-color: #233E5B;
    padding: 10px 1px;
    border-radius: 6px 0 6px 0;
    z-index: @content-z;
    .v-name {
        padding-top: 5px;
        font-size: 18px;
        color: #fff;
        overflow: hidden;
        max-width: 90%;
        margin: auto;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
            color: #ccc;
        }
        span {
            display: inline-block;
        }
    }
    .v-num {
        margin-top: 10px;
        color: #FF1B00;
        strong {
            font-size: 24px;
            font-weight: normal;
        }
        em {
            vertical-align: 1px;
        }
    }
}
.corner-1,
.corner-2 {
    position: absolute;
    width: @corner-size;
    height: @corner-size;
}
.corner-1 {
    border-top: 1px solid @line-color;
    border-left: 1px solid @line-color;
    border-radius: 6px 0 0 0;
    top: @i-top - 1px;
    right: @i-right + @i-width - @corner-size + 1px;
    z-index: @content-z;
}
.corner-2 {
    border-right: 1px solid @line-color;
    border-bottom: 1px solid @line-color;
    border-radius: 0 0 6px 0;
    top: @i-top + @i-height - @corner-size + 2px;
    right: @i-right - 1px;
    z-index: @content-z;
}
.line-1 {
    position: absolute;
    top: @i-top + 39px;
    right: @i-right + @i-width - 2px;
    width: 48px;
    height: 1px;
    border-top: 1px solid @line-color;
    z-index: @content-z - 2;
}
</style>
<style lang="less">
.twelve-cell .BMap_cpyCtrl.BMap_noprint.anchorBL,
.twelve-cell .map-instance div.anchorBL {
    visibility: hidden;
}
</style>