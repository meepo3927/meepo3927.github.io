import {Vue, mlayer} from 'common';
import request from 'util/request';
import IframeUtil from 'util/iframe';
import Tool from 'util/tool';
import ArcgisUtil from 'util/arcgis';
import RightBarStore from 'store/rightbar.js';
import Store from 'util/store.js';

const refreshInterval = 60;
let global = window.global || {};
let methods = {};
/**
 * 事件
 */
methods.onRightNavbarClick = function (index) {
    if (index === 1) {
        this.showCitySelect();
    } else if (index === 2) {
        this.showRealtimeChart();
    } else if (index === 3) {
        this.showAnalysisChart();
    }
};
methods.onCitySelectClose = function () {
    this.showCitySelect();
};
methods.onRealtimeChartClose = function () {
    this.showRealtimeChart();
};
methods.onRealtimeChartOpenBig = function () {
    this.realtimeBig = this.area.level + '-realtime-big';
};
methods.onRealtimeBigRenderOption = function (index, param) {
    if (this.$refs.realtimeChart) {
        this.$refs.realtimeChart.$emit('big-render-option', index, param);
    }
};
methods.onRealtimeBigClose = function () {
    this.realtimeBig = '';
};
methods.rowClick = function (item) {
    if (this.tableComp === 'city-table') {
        this.renderCity(item);
    } else if (this.tableComp === 'attraction-table') {
        this.renderAttraction(item);
    }
};
methods.onCitySelect = function (item) {
    if (this.lastRightComp === 'realtime-chart') {
        this.$nextTick(this.showRealtimeChart);
    }
    // this.showCitySelect();
    item = item || {};
    if (item.level === 'city') {
        this.renderCity(item);
    } else if (item.level === 'attraction') {
        this.renderAttraction(item);
    } else if (item.level === 'province') {
        this.renderProvince();
    }
};
methods.onPlaceSelected = function (val) {
    var info = {};
    info.id = val.placeID + '';
    info.name = val.placeName || '';

    if (info.id.length === 3) {
        // 地市
        this.renderCity(info);
    } else if (info.id.length === 4) {
        // 景区
        this.renderAttraction(info);
    }

    this.$refs.locationSearch.clean();
};
/**
 * 方法
 */
methods.renderProvince = function (options = {}) {
    this.area.level = 'province';

    // 刷新
    if (!options.refresh) {
        this.view.loadingTable = true;
        this.citylist = [];
    }
    // 请求table数据
    request.getCityTableData().then((data, state, xhr) => {
        this.view.loadingTable = false;
        this.citylist = data;
    }, () => {
        this.view.loadingTable = false;
    });
    if (options.refresh) {
        this.renderArcgis();
    } else {
        this.renderArcgis({init: options.init});
    }

    this.setupRefresh();
    this.cacheState();
};
methods.renderCity = function (city, options = {}) {
    // LOG('renderCity:');
    this.area.id = city.id;
    this.area.city = city.name;
    this.area.level = 'city';


    if (!options.refresh) {
        this.view.loadingTable = true;
        this.attractionlist = [];
    }
    // 请求地市 table 数据

    request.getAttractionList(city.id).then((result) => {
        this.view.loadingTable = false;
        this.attractionlist = result;
    }, () => {
        this.view.loadingTable = false;
    });

    this.renderArcgis({
        init: options.init
    });

    // 图表
    if (!options.refresh) {
        this.$nextTick(this.renderRight);
    }

    this.setupRefresh();
    this.cacheState();
};
methods.renderAttraction = function (item, options = {}) {

    this.area.id = item.id;
    this.area.attraction = item.name;
    this.area.level = 'attraction';

    if (!options.refresh) {
        this.view.loadingTable = true;
    }
    // 请求景区 table 数据

    request.getAttrctionDetailOne(item.id).then((result) => {
        this.view.loadingTable = false;
        this.attractionDetail = result;
    }, () => {
        this.view.loadingTable = false;
        // this.attractionDetail = {};
    });

    this.renderArcgis({
        init: options.init
    });
    // 图表
    if (!options.refresh) {
        this.$nextTick(this.renderRight);
    }

    this.setupRefresh();
    this.cacheState();
};
methods.showCitySelect = function () {
    if (this.view.rightComp === 'city-select') {
        this.view.rightComp = '';
        this.lastRightComp = '';
    } else {
        this.lastRightComp = this.view.rightComp;
        this.view.rightComp = 'city-select';
    }
};
/**
 * show 实时监控
 */
methods.showRealtimeChart = function () {
    if (this.view.rightComp === 'realtime-chart') {
        this.view.rightComp = '';
    } else {
        this.view.rightComp = 'realtime-chart';
        this.$nextTick(function () {
            this.delayRenderRealtimeChart();
        });
    }
};
methods.showAnalysisChart = function () {
    if (!this.analysisChart) {
        return;
    }
    this.view.analysisVisible = true;
};
methods.delayRenderRealtimeChart = function () {
    if (this.delayRenderRealtimeChartTimer) {
        clearTimeout(this.delayRenderRealtimeChartTimer);
        this.delayRenderRealtimeChartTimer = null;
    }
    this.delayRenderRealtimeChartTimer = setTimeout(() => {
        this.renderRealtimeChart();
    }, 16);
};
methods.renderRealtimeChart = function () {
    if (!this.realtimeChart) {
        return this.showCitySelect();
    }
    if (!this.$refs.realtimeChart) {
        return;
    }
    this.$refs.realtimeChart.render({
        id: this.area.id,
        areaName: this.areaName
    });
};
methods.renderRight = function () {
    // 实时监控
    if (this.view.rightComp === 'realtime-chart') {
        this.delayRenderRealtimeChart();
    }
};
methods.renderProvinceGis = function (isInit) {
    let type = 'province';
    request.getAllAttractionsTop3().then((data) => {
        if (!this.isProvince) {
            return false;
        }

        if (isInit) {
            this.arcgisUrl = ArcgisUtil.getUrl(data);
        } else {
            ArcgisUtil.sendEvent(data, type);
        }
    });
};
methods.renderCityGis = function (id, isInit) {
    let type = 'city';
    request.getAttractionsOfCity(id).then((result) => {

        // 已经切换
        if (!this.isCity || this.isHeatmapState) {
            return false;
        }

        let param = {cityId: id};
        if (isInit) {
            this.arcgisUrl = ArcgisUtil.getUrl(result, type, param);
        } else {
            ArcgisUtil.sendEvent(result, type, param);
        }
    });
};
methods.renderAttractionGis = function (id ,isInit) {
    let type = 'attraction';
    request.getAttractionById(id).then((result) => {
        if (!this.isAttraction || this.isHeatmapState) {
            return false;
        }

        if (isInit) {
            this.arcgisUrl = ArcgisUtil.getUrl([result], type);
        } else {
            ArcgisUtil.sendEvent([result], type);
        }
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
        mlayer.msg('加载数据失败');
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
        mlayer.msg('加载数据失败');
    });
};
methods.renderArcgis = function (options = {}) {
    let type = this.area.level;
    let id = this.area.id;
    let isHeatmap = this.isHeatmapState;
    let isInit = !!options.init;
    if (type === 'city') {
        if (isHeatmap) {
            this.renderCityHeatmap(id);
        } else {
            this.renderCityGis(id, isInit);
        }

    } else if (type === 'attraction') {
        if (isHeatmap) {
            this.renderAttractionHeatmap(id);
        } else {
            this.renderAttractionGis(id, isInit);
        }

    } else if (type === 'province') {
        this.renderProvinceGis(isInit);
    }
};
methods.listenArcgis = function () {
    // 景区点击事件
    IframeUtil.on('scenery_click', (data, e) => {
        let id = data.sceneryid;
        request.getAttractionById(id).then((attraction) => {
            this.renderAttraction({
                id,
                name: attraction.placeName
            });
        });
    });
    // 地市点击事件
    IframeUtil.on('city_click', (data, e) => {
        let cityId = data.cityid;
        request.getCityById(cityId).then((city) => {
            this.renderCity({
                id: city.placeID,
                name: city.placeName
            });
        }, () => {
            LOG(`getCityById fail [id:${cityId}]`)
        });
    });
};
methods.tableBack = function () {
    if (this.isCity) {
        this.renderProvince();
    } else if (this.isAttraction) {

        request.getAttractionById(this.area.id).then((attraction) => {
            var city = attraction.parent;
            if (city) {
                this.renderCity({
                    id: city.placeID,
                    name: city.placeName
                });
            }
        });
    }
};
methods.setupRefresh = function () {
    this.closeRefresh();
    this.refreshTimer = setTimeout(() => {
        this.refresh();
    }, refreshInterval * 1000)
};
methods.closeRefresh = function () {
    if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
    }
};
methods.refresh = function () {
    let area = this.area;
    if (this.isProvince) {
        this.renderProvince({refresh: true});
    } else if (this.area.level === 'city') {
        this.renderCity({
            id: area.id,
            name: area.city
        }, {refresh: true});
    } else if (this.area.level === 'attraction') {
        this.renderAttraction({
            id: area.id,
            name: area.attraction
        }, {refresh: true});
    }
};
methods.cacheState = function () {
    // LOG('cache:' + JSON.stringify(this.area));
    Store.set('homeAreaState', this.area);
};
methods.loadState = function () {
    let state = Store.get('homeAreaState', 'json');
    if (!state) {
        return false;
    }

    let level = state.level;
    if (level === 'city' && state.id) {
        this.initCity(state.id, state.city);
        return true;
    } else if (level === 'attraction' && state.id) {
        this.initAttraction(state.id, state.attraction);
        return true;
    }
    return false;
};
methods.initCity = function (id, name) {
    return this.renderCity({id, name}, {
        init: true
    });
};
methods.initAttraction = function (id, name) {
    return this.renderAttraction({id, name}, {
        init: true
    });
};
methods.init = function () {
    if (this.auth === 'city') {
        let cityId = global.city;
        this.view.loadingTable = true;
        request.getCityById(cityId).then((city) => {
            this.initCity(city.placeID, city.placeName);
        }).catch(() => {
            this.view.loadingTable = false;
        });
    } else {
        this.renderProvince({init: true});
    }
};
let computed = {};
computed.tablelist = function () {
    if (this.tableComp === 'city-table') {
        return this.citylist;
    } else if (this.tableComp === 'attraction-table') {
        return this.attractionlist;
    }
    return [];
};
computed.tableComp = function () {
    var l = this.area.level;
    if (l === 'province') {
        return 'city-table';
    } else if (l === 'city') {
        return 'attraction-table';
    } else if (l === 'attraction') {
        return 'attraction-detail';
    }
    return null;
};
computed.areaName = function () {
    return this.area[this.area.level];
};
computed.isProvince = function () {
    return this.area.level === 'province';
};
computed.isCity = function () {
    return this.area.level === 'city';
};
computed.isAttraction = function () {
    return this.area.level === 'attraction';
};
computed.realtimeChart = function () {
    if (this.isProvince) {
        return null;
    }
    return this.area.level + '-realtime';
};
computed.analysisChart = function () {
    if (this.area.level === 'attraction' || this.area.level === 'city') {
        return this.area.level + '-analysis-layer';
    }
    return null;
};
computed.isHeatmapState = function () {
    return (this.heatmapFlag === 'heatmap');
};
computed.heatmapFlag = function () {
    return RightBarStore.state.flag;
};

let watch = {};
watch.heatmapFlag = function (val) {
    this.renderArcgis();
};

let data = {
    auth: global.city ? 'city' : 'all',
    area: {
        province: '内蒙古自治区',
        id: 0,
        city: '',
        attraction: '',
        level: 'province'
    },
    view: {
        rightComp: '',
        analysisVisible: false,
        loadingTable: false
    },
    citylist: [],
    attractionlist: [],
    attractionDetail: {
    },
    realtimeBig: '',
    arcgisUrl: 'about:blank',
    test: '',
    options: [1,2,3,4]
};
const beforeCreate = function () {
};
let mounted = function () {
    if (!this.loadState()) {
        this.init();
    }

    this.listenArcgis();
};
window.Index = new Vue({
    el: '#main',
    beforeCreate,
    methods,
    computed,
    data,
    watch,
    mounted,
    components: {
        // 搜索
        'location-search': require('comp/location_search.vue'),
        // 表格
        'table-layer': require('comp/table_layer.vue'),
        // 城市列表
        'city-table': require('comp/city_table.vue'),
        // 景区列表
        'attraction-table': require('comp/attraction_table.vue'),
        // 景区概况
        'attraction-detail': require('comp/attraction_detail.vue'),
        // 右侧导航条
        'right-navbar': require('comp/right_navbar.vue'),
        // 选择城市
        'city-select': require('comp/city_select.vue'),
        // 景区实时监控
        'attraction-realtime': require('comp/attraction_realtime.vue'),
        // 景区实时监控 - 放大
        'attraction-realtime-big': (r) => {
            require.ensure([], () => {
                r(require('comp/attraction_realtime_big.vue'));
            });
        },
        // 城市实时监控
        'city-realtime': require('comp/city_realtime.vue'),
        // 城市实时监控 - 放大
        'city-realtime-big': (r) => {
            require.ensure([], () => {
                r(require('comp/city_realtime_big.vue'));
            });
        },
        // 城市 - 数据分析
        'city-analysis-layer': (r) => {
            require.ensure([], () => {
                r(require('comp/city_analysis_layer.vue'));
            });
        },
        // 景区 - 数据分析
        'attraction-analysis-layer': (r) => {
            require.ensure([], () => {
                r(require('comp/attraction_analysis_layer.vue'));
            });
        },
        'amap': require('comp/map/amap.vue'),
        // 页尾
        'page-footer': require('comp/footer.vue'),
        // 测试
        'test-layer': require('comp/test.vue')
    }
});