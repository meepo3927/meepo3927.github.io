import {Vue, config} from 'root';
import request from 'util/request';
import IframeUtil from 'util/iframe';
import Tool from 'util/tool';
import ArcgisUtil from 'util/arcgis';
import Store from 'util/store.js';
import URL from 'util/url.js';

const refreshInterval = 3 * 60 * 1000;
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
    // 实时监控 - 大窗和小窗交互 （已移除）
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
    info.id = val.placeId + '';
    info.name = val.placeName || '';
    if (info.id.length === 3) {
        // 地市
        this.renderCity(info);
    } else if (info.id.length > 3) {
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
    let req = request.getCityTableData();
    this.setPromise('renderRank', req).then((data, state, xhr) => {
        this.view.loadingTable = false;
        this.citylist = data;
    }).catch(() => {
        this.view.loadingTable = false;
    });
    if (options.refresh) {
        this.renderArcgis({type: 'refresh'});
    } else if (options.init) {
        this.renderArcgis({type: 'init'});
    } else {
        this.renderArcgis({});
    }
    this.setupRefresh();
};
methods.renderCity = function (city, options = {}) {
    this.area.id = city.id;
    this.area.city = city.name;
    this.area.level = 'city';


    if (!options.refresh) {
        this.view.loadingTable = true;
        this.attractionlist = [];
    }
    // 请求地市 table 数据
    const req = request.getAttractionList(city.id);
    this.setPromise('renderRank', req).then((result) => {
        this.view.loadingTable = false;

        // 刷新排行列表
        this.attractionlist = result;

        // 刷新gis数据
        if (options.refresh) {
            this.renderArcgis({type: 'refresh', data: result});
        } else if (options.init) {
            this.renderArcgis({type: 'init', data: result});
        } else {
            this.renderArcgis({data: result});
        }
    }).catch(() => {
        this.view.loadingTable = false;
    });

    // 图表
    if (!options.refresh) {
        this.$nextTick(this.renderRight);
    }
    this.setupRefresh();
};
methods.renderAttraction = function (item, options = {}) {

    this.area.id = item.id;
    this.area.attraction = item.name;
    this.area.level = 'attraction';

    if (!options.refresh) {
        this.view.loadingTable = true;
    }
    // 请求景区 table 数据
    const req = request.getAttrctionDetailOne(item.id);
    this.setPromise('renderRank', req).then((result) => {
        this.view.loadingTable = false;
        // 刷新table数据
        this.attractionDetail = result;

        // 刷新gis
        if (options.refresh) {
            this.renderArcgis({type: 'refresh', data: result});
        } else if (options.init) {
            this.renderArcgis({type: 'init', data: result});
        } else {
            this.renderArcgis({data: result});
        }
    }).catch((e) => {
        this.view.loadingTable = false;
        this.attractionDetail = {
            city_title: item.name
        };
    });

    // 图表
    if (!options.refresh) {
        this.$nextTick(this.renderRight);
    }
    this.setupRefresh();
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
    if (this.isProvince) {
        return this.showCitySelect();
    }
    this.onRealtimeChartOpenBig();

};
methods.showAnalysisChart = function () {
    if (!this.analysisChart) {
        return this.showCitySelect();
    }
    this.view.analysisVisible = true;
};
methods.closeAnalysisChart = function () {
    this.view.analysisVisible = false;
};

methods.renderRight = function () {
};
methods.loadUrlParam = function () {
    if (URL.query().scenery_id) {
        let id = URL.query().scenery_id;
        request.getAttractionById(id).then((attraction) => {
            this.renderAttraction({
                id,
                name: attraction.placeName
            });
        });
    }
};
methods.renderArcgis = function (options = {}) {
    let level = this.area.level;
    let data = options.data;
    if (!data) {
        // 已有数据
        if (level === 'city' && this.attractionlist) {
            data = this.attractionlist;
        }
        if (level === 'attraction' && this.attractionDetail) {
            data = this.attractionDetail;
        }
    }
    return this.renderGis({
        level,
        id: this.area.id,
        type: options.type,
        data
    });
};

methods.listenArcgis = function () {
    IframeUtil.on('gis_ready', () => {
        this.renderArcgis();
        setTimeout(this.loadUrlParam, 1500);
    });
    // 景区点击事件
    IframeUtil.on('scenery_click', (data, e) => {
        let id = data.sceneryid;
        request.getAttractionById(id).then((attraction) => {
            this.renderAttraction({
                id,
                name: attraction.placeName
            });
        });
        LOG(data);
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

// 排行榜 - 返回上一级
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
        }).catch((e) => {
            LOG('getAttractionById error:', e);
        });
    }
};
methods.setupRefresh = function () {
    this.refreshTimer = setTimeout(this.refresh, refreshInterval);
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

methods.init = function () {
    // 地市权限
    if (this.auth === 'city') {
        this.view.loadingTable = true;
        request.getCityById(config.user.cityId).then((city) => {
            this.renderCity({
                id: city.placeID,
                name: city.placeName
            }, {init: true});
        }).catch((e) => {
            this.view.loadingTable = false;
            LOG(e);
        });
    } else {
        // 全区权限
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

computed.analysisChart = function () {
    if (this.area.level === 'attraction' || this.area.level === 'city') {
        return this.area.level + '-analysis-layer';
    }
    return null;
};

let watch = {};
watch.heatmapFlag = function (val) {
    this.renderArcgis();
};

let data = {
    auth: config.user.auth,
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
    test: '',
    options: [1,2,3,4]
};
const beforeCreate = function () {
};
let mounted = function () {
    this.init();
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
    mixins: [
        require('mixins/gis_iframe.js'),
        require('mixins/request_mix.js')
    ],
    components: {
        // 搜索
        'location-search': require('comp/index/location_search.vue'),
        // 表格
        'table-layer': require('comp/index/table_layer.vue'),
        // 城市列表
        'city-table': require('comp/city/table.vue'),
        // 景区列表
        'attraction-table': require('comp/attraction/table.vue'),
        // 景区概况
        'attraction-detail': require('comp/attraction/detail.vue'),
        // 右侧导航条
        'right-navbar': require('comp/index/right_navbar.vue'),
        // 选择城市
        'city-select': require('comp/index/city_select.vue'),
        // 景区实时监控
        // 'attraction-realtime': require('comp/attraction/realtime.vue'),
        // 景区实时监控 - 放大
        'attraction-realtime-big': (r) => {
            require.ensure([], () => {
                r(require('comp/attraction/realtime_big.vue'));
            });
        },
        // 城市实时监控
        // 'city-realtime': require('comp/city/realtime.vue'),
        // 城市实时监控 - 放大
        'city-realtime-big': (r) => {
            require.ensure([], () => {
                r(require('comp/city/realtime_big.vue'));
            });
        },
        // 城市 - 数据分析
        'city-analysis-layer': (r) => {
            require.ensure([], () => {
                r(require('comp/city/analysis_layer.vue'));
            });
        },
        // 景区 - 数据分析
        'attraction-analysis-layer': (r) => {
            require.ensure([], () => {
                r(require('comp/attraction/analysis_layer.vue'));
            });
        },
        // 页尾
        'page-footer': require('comp/index/footer.vue')
    }
});