<template>
<div class="page-twelve-setting">
    <h2>12景区大屏配置</h2>
    <div class="my-wrapper mt20">
        <div class="l-section">
            <div class="table-wrapper">
                <table class="table-2">
                    <thead>
                        <tr>
                            <th>勾选</th>
                            <th>景区ID</th>
                            <th class="col-name">景区名称</th>
                            <th>所属地市</th>
                            <th>景区图片</th>
                            <th>景区经纬度</th>
                            <th>基站经纬度</th>
                        </tr>
                    </thead>
                    <tbody v-if="list">
                        <tr v-for="v in list" :class="{active: v === curItem}">
                            <td class="col-check" @click="v.checked = !v.checked">
                                <input type="checkbox" @click.stop v-model="v.checked" />
                            </td>
                            <td v-text="v.sceneryID"></td>
                            <td v-text="v.sceneryName" class="col-name" @click="selectItem(v)"></td>
                            <td v-text="v.cityName"></td>
                            <td v-text="getPicText(v)" :class="['pic-' + v.hasPic]"></td>
                            <td v-text="getSceneryLocationText(v)"></td>
                            <td v-text="v.lnglat || '无'"></td>
                        </tr>
                    </tbody>
                    <tfoot v-if="list === null">
                        <tr>
                            <td colspan="7">暂无数据</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="mt15" v-if="list">
                <button class="btn btn-primary" type="button" @click="save12">保存景区勾选</button>
                <span class="num-tip" v-text="numTip"></span>
            </div>
        </div>
        <div class="r-section" v-show="curItem">
            <div class="img-box">
                <img :src="curImg" />
            </div>
            <div class="map-instance mt15" ref="map"></div>
            <div class="mt15">
                <button class="btn btn-default" type="button" @click="savelng">保存经纬度</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {mlayer, request, $} from 'root';

let methods = {};
methods.selectItem = function (item) {
    this.curItem = item;
    this.$nextTick(this.setMap);
};
methods.getPicText = function (v) {
    if (v.hasPic === true) {
        return '正常';
    } else if (v.hasPic === false) {
        return '缺失';
    }
};
methods.getSceneryLocationText = function (v) {
    if (!v.lng || !v.lat) {
        return '无';
    }
    return v.lng + ',' + v.lat;
};
methods.addMarker = function (p) {
    this.removeMarker();
    this.marker = new BMap.Marker(p);
    this.bmap.addOverlay(this.marker);
};
methods.removeMarker = function () {
    if (this.marker) {
        this.bmap.removeOverlay(this.marker);
        this.marker = null;
    }
};
methods.onMapClick = function (e) {
    let p = e.point;
    this.lastPoint = p;
    this.addMarker(p);
    this.bmap.panTo(p);
};
methods.setMap = function () {
    const DEFAULT_LNG = 111.676943;
    const DEFAULT_LAT = 40.820949;
    const zoom = this.curItem.zoom || 14;
    if (!this.bmap) {
        var map = new BMap.Map(this.$refs.map, {
            enableMapClick: false
        });
        map.enableScrollWheelZoom(true);
        map.addEventListener('click', this.onMapClick);
        this.bmap = map;
    } else {
        map = this.bmap;
    }
    // 更换地点
    this.removeMarker();
    this.lastPoint = null;
    let scenery = this.curItem;
    if (scenery.lng && scenery.lat) {
        let p1 = new BMap.Point(scenery.lng, scenery.lat);
        map.centerAndZoom(p1, zoom);
        this.addMarker(p1);
    } else if (scenery.longitude && scenery.latitude) {
        map.centerAndZoom(new BMap.Point(scenery.longitude, scenery.latitude), zoom);
    }
};

methods.save12 = function () {
    if (this.checkedNum !== 12) {
        return mlayer.msg('请选中正好12个景区');
    }
    let param = {
        sceneryIDs: this.checkedList.map(v => v.sceneryID).join(',')
    };
    request.getActionJSON('/sceneryShowConfig/editSceneryChecks', param).then((data) => {
        mlayer.msg('保存成功');
    }).catch((e) => {
        mlayer.msg('保存失败');
    })
};
methods.savelng = function () {
    if (!this.lastPoint) {
        return mlayer.msg('请先点击地图绘制坐标点');
    }
    let info = {
        lng: this.lastPoint.lng,
        lat: this.lastPoint.lat,
        zoom: this.bmap.getZoom()
    };
    let param = {
        sceneryID: this.curItem.sceneryID,
        sceneryExtInfo: JSON.stringify(info)
    };
    request.getActionJSON('/sceneryShowConfig/editSceneryLocation', param).then((data) => {
        mlayer.msg('保存成功');
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }).catch(() => {
        mlayer.msg('保存失败');
    });
};
methods.initPic = function () {
    if (!this.list) {
        return;
    }
    this.list.map((v) => {
        let img = new Image();
        img.onload = () => {
            v.hasPic = true;
        };
        img.onerror = () => {
            v.hasPic = false;
        };
        img.src = this.getPicSrc(v);
    });
};
methods.getPicSrc = function (item) {
    return this.vImgPath + '/twelve/' + item.sceneryID + '.jpg';
};
methods.fetchRender = function () {
    this.list = undefined;
    this.curItem = null;
    request.getActionJSON('/sceneryShowConfig/getShowConfig', {isAll: true}, 'all').then((data) => {
        this.list = data.map((v) => {
            v.checked = !!(v.isValid);
            v.hasPic = undefined;
            if (v.longitude) {
                v.lnglat = v.longitude + ',' + v.latitude;
            }
            try {
                if (v.sceneryExtInfo) {
                    v.extInfo = JSON.parse(v.sceneryExtInfo);
                    v.lng = v.extInfo.lng;
                    v.lat = v.extInfo.lat;
                    v.zoom = v.extInfo.zoom;
                }
            } catch(e) {}
            return v;
        });
        this.initPic();
    }).catch(() => {
        this.list = null;
    });
};
let computed = {};
computed.curImg = function () {
    if (this.curItem) {
        return this.getPicSrc(this.curItem);
    }
};
computed.checkedList = function () {
    return this.list ? this.list.filter((v) => { return v.checked; }) : [];
};
computed.checkedNum = function () {
    return this.checkedList.length;
};
computed.numTip = function () {
    if (!this.checkedNum) {
        return '';
    }
    return '当前选中了' + this.checkedNum + '个景区';
};
let watch = {};
const created = function () {
    window.VM = this;
};
const mounted = function () {
    this.fetchRender();
};
const beforeDestroy = function () {
};
const dataFunc = function () {
    let o = {
        list: undefined,
        curItem: null
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
@table-width:  880px;
.page-twelve-setting {
    padding: 15px;
    & > .my-wrapper {
        position: relative;
    }
    .l-section {
        width: @table-width;
    }
    .table-wrapper {
        height: 560px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    tr.active {
        background-color: #FFA579;
    }
    td.col-check {
        text-align: center;
        cursor: pointer;
    }
    .col-name {
        width: 240px;
    }
    td.col-name {
        color: #6060FF;
        cursor: pointer;
    }
    td.pic-false {
        color: #f00;
    }
    .num-tip {
        margin-left: 15px;
        color: #999;
    }
    .r-section {
        position: absolute;
        top: 0;
        left: @table-width + 15px;
        .img-box > img {
            width: 170px;
            height: 170px;
        }
        .map-instance {
            width: 1920px / 4;
            height: 1080px / 3;
        }
    }
}

</style>
