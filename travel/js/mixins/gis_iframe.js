let config = require('global/config');
let RightBarStore = require('store/rightbar.js');
let ArcgisUtil = require('util/arcgis');
let request = require('util/request');
let mlayer = require('mlayer');

const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
methods.renderProvinceGis = function (type) {
    let level = 'province';
    request.getAllAttractionsTop3().then((data) => {
        // 已经切换级别
        if (!this.isProvince) {
            return false;
        }

        if (type === 'init') {
            this.setArcGisUrl(ArcgisUtil.getUrl(data));
        } else if (type === 'refresh') {
            ArcgisUtil.sendEvent(data, level + '_point');
        } else {
            ArcgisUtil.sendEvent(data, level);
        }
    });
};
methods.renderCityGisData = function (type, cityId, data) {
    let param = {cityId};
    let level = 'city';
    // LOG('renderCityGisData:' + cityId, data);
    if (type === 'init') {
        this.setArcGisUrl(ArcgisUtil.getUrl(data, level, param));
    } else if (type === 'refresh') {
        ArcgisUtil.sendEvent(data, level + '_point', param);
    } else {
        ArcgisUtil.sendEvent(data, level, param);
    }
};
methods.renderCityGis = function (id, options = {}) {
    let data = options.data;
    if (data && data.length) {
        return this.renderCityGisData(options.type, id, data);
    }

    request.getAttractionList(id).then((data) => {
        // 已经切换级别，或者已经切换为热力图
        if (!this.isCity || this.isHeatmapState) {
            return false;
        }
        this.renderCityGisData(options.type, id, data);
    }).catch((e) => {
        LOG(e);
    });
};
methods.renderAttractionGisData = function (type, item) {
    let level = 'attraction';
    let data = [item];
    if (type === 'init') {
        this.setArcGisUrl(ArcgisUtil.getUrl(data, level));
    } else if (type === 'refresh') {
        ArcgisUtil.sendEvent(data, level + '_point');
    } else {
        ArcgisUtil.sendEvent(data, level);
    }
};
methods.renderAttractionGis = function (id, options = {}) {
    if (options.data) {
        return this.renderAttractionGisData(options.type, options.data);
    }
    request.getAttrctionDetailOne(id).then((result) => {
        // 已经切换级别，或者已经切换为热力图
        if (!this.isAttraction || this.isHeatmapState) {
            return false;
        }
        this.renderAttractionGisData(options.type, result);
    });
};

const processHeatMapResult = (result = []) => {
    return result.map((item) => {
        return {
            lacCellIid: item.i,
            userNum: item.v
        };
    });
};

const heatmapRequestErrMsg = '热力图数据加载失败';

methods.renderCityHeatmap = function (id) {
    // fetch
    let p = request.getHeatMap({scenery_city: id});
    let l = mlayer.loading({withCover: false});
    p.then((result) => {
        l.close();
        if (!this.isCity || !this.isHeatmapState) {
            return false;
        }
        let list = processHeatMapResult(result);
        // render
        ArcgisUtil.sendHeatmap(list, 'city', {
            cityId: id
        });
    }).catch(() => {
        l.close();
        mlayer.msg(heatmapRequestErrMsg);
    });
};
methods.renderAttractionHeatmap = function (id) {
    // fetch
    let p = request.getHeatMap({scenery_id: id});
    let l = mlayer.loading({withCover: false});
    p.then((result) => {
        l.close();
        if (!this.isAttraction || !this.isHeatmapState) {
            return false;
        }
        let list = processHeatMapResult(result);
        // render
        ArcgisUtil.sendHeatmap(list, 'attraction');
    }).catch(() => {
        l.close();
        mlayer.msg(heatmapRequestErrMsg);
    });
};

methods.renderGis = function (o = {}) {
    let level = o.level;
    let id = o.id;
    let type = o.type;
    let isHeatmap = this.isHeatmapState;

    if (level === 'city') {
        if (isHeatmap) {
            return this.renderCityHeatmap(id);
        } else {
            return this.renderCityGis(id, o);
        }

    } else if (level === 'attraction') {
        if (isHeatmap) {
            return this.renderAttractionHeatmap(id);
        } else {
            return this.renderAttractionGis(id, o);
        }

    } else if (level === 'province') {
        return this.renderProvinceGis(type);
    }
};
methods.setArcGisUrl = function (url) {
    //this.arcgisUrl = url;
    this.arcgisUrl = this.gisAddToken(url, config.gisToken);
};
methods.gisAddToken = function (originUrl, tokenObj = []) {
    let hashArr = originUrl.split('#');
    let url = hashArr[0];
    // 数组
    if (tokenObj[0] && tokenObj[1]) {
        var timestamp = tokenObj[0];
        var signature = tokenObj[1];
    } else if (tokenObj.timestamp && tokenObj.signature) {
        timestamp = tokenObj.timestamp;
        signature = tokenObj.signature;
    } else {
        return originUrl;
    }
    let param = 'timestamp=' + timestamp + '&signature=' + signature;
    if (url.indexOf('?') >= 0) {
        url += '&' + param;
    } else {
        url += '?' + param;
    }
    hashArr[0] = url;
    // 对象
    return hashArr.join('#');
};
let computed = {};
computed.isHeatmapState = function () {
    return (this.heatmapFlag === 'heatmap');
};
computed.heatmapFlag = function () {
    return RightBarStore.state.flag;
};
computed.gisFakeImage = function () {
    return this.vImgPath + '/index/gis.png';
};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {
            arcgisUrl: 'about:blank',
            view: {
                //gisFakeVisible: (config.dev)
                gisFakeVisible: false
            }
        };
        return o;
    },
    watch,
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy,
    mixins: [],
    components: {}
};