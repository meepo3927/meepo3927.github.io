<template>
<div class="twelve-cell">
    <div class="my-wrapper">
        <!-- 名字 -->
        <div class="v-info">
            <span class="v-name" v-text="sceneryName"
                @click="onSceneryClick"></span>
            <span class="v-num common-verticle-rotate" :class="{rotating}"
                v-show="userNum">
                <strong v-text="userNum"></strong>
                <em>人</em>
            </span>
        </div>
        <!-- 人数 
        <div class="v-usernum common-verticle-rotate" :class="{rotating}">
            <span v-text="userNum"></span><em>人</em>
        </div>
        -->
        <!-- 地图 -->
        <img :src="mapImgSrc" class="map-img" />
        <!-- 景区图片 -->
        <img :src="myImgSrc" class="my-img" />
    </div>
</div>
</template>

<script>
import request from 'util/request.js';
let methods = {};
methods.fetchRender = function () {
    if (!this.data.id) {
        return;
    }
    request.getAttractionDetail(this.data.id).then((data) => {
        this.updateNum(data);
        clearTimeout(this.fetchTimer);
        this.fetchTimer = setTimeout(this.fetchRender, 4500);
    });
};
let computed = {};
computed.mapImgSrc = function () {
    let path = this.data.mapSrc || '/map.png';
    return this.vImgPath + '/twelve' + path;
};
computed.myImgSrc = function () {
    let path = this.data.imgSrc || '/default.png';
    return this.vImgPath + '/twelve' + path;
};
let watch = {};
const created = function () {};
const mounted = function () {
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
@my-width:  350px;
@my-height: 212px;
@img-top:   32px;
@img-left:  64px;
@name-height: 44px;

.twelve-cell {
    width: 25vw;
    height: 33.3vh;
}
.my-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
}
.map-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.my-img {
    position: absolute;
    top: @img-top;
    left: @img-left;
    width: @my-width;
}
.v-info {
    position: absolute;
    z-index: 50;
    border-radius: 0 0 10px 10px;
    top: @my-height + @img-top - @name-height - 16px;
    left: @img-left + 8px;
    width: @my-width - 16px;
    height: @name-height;
    background-color: rgba(0, 0, 0, .5);
    color: #fff;
    
    .v-name {
        display: inline-block;
        margin-right: 18px;
        font-size: 18px;
        float: left;
        margin-top: 14px;
        margin-left: 22px;
        cursor: pointer;
        &:hover {
            color: #ccc;
        }
    }
    .v-num {
        display: inline-block;
        float: right;
        margin-top: 13px;
        margin-right: 22px;
        color: #f00;
        strong {
            font-size: 20px;
        }
        em {
            vertical-align: 1px;
        }
    }
}
</style>

<style lang="less">
/*
.twelve-cell .BMap_cpyCtrl.BMap_noprint.anchorBL {
    visibility: hidden;
}
*/
</style>