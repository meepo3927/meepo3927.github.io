<template>
<div class="my-root">
    <h1>test map</h1>

    <div class="bmap map-1" ref="map1"></div>
    <div class="color-intro-box">
        <ul>
            <li v-for="v in colorIntroList">
                <em :style="{backgroundColor: v.color}">&nbsp;</em>
                <span v-text="v.text"></span>
            </li>
        </ul>
    </div>

    
    <div class="chart-1" ><my-chart :o="o1" /></div>
    
    <div class="chart-2" ><my-chart :o="o2" /></div>

    <div class="bmap map-2 mt50" ref="map2"></div>

    <!-- <div class="chart-3" ><my-chart :o="o3" theme="dark" /></div> -->

    <div class="chart-4" ><my-chart :o="o4" /></div>
    <div class="chart-5" ><my-chart :o="o5" /></div>
    <div class="chart-5-1" ><my-chart :o="o5_1" /></div>
    <div class="chart-5-2" ><my-chart :o="o5_2" /></div>
    <div class="chart-5-3" ><my-chart :o="o5_3" /></div>

    <div class="bmap map-3 mt50" ref="map3"></div>

    <!--
    <h1>职住比平衡且工作者通勤距离长</h1>
    <div class="bmap2 map-2-1" ref="map2_1"></div>

    <h1>职住比平衡且工作者通勤距离短</h1>
    <div class="bmap2 map-2-2" ref="map2_2"></div>

    <h1>职住比平衡且居住者通勤距离长</h1>
    <div class="bmap2 map-2-3" ref="map2_3"></div>

    <h1>职住比平衡且居住者通勤距离短</h1>
    <div class="bmap2 map-2-4" ref="map2_4"></div>

    <h1>职住比小且居住者通勤距离长</h1>
    <div class="bmap2 map-2-5" ref="map2_5"></div>

    <h1>职住比大且工作者通勤距离长</h1>
    <div class="bmap2 map-2-6" ref="map2_6"></div>
    -->

    <h1>人流来源-东河区</h1>
    <div class="bmap2 map-3-1" ref="map3_1"></div>
    <h1>人流来源-青山区</h1>
    <div class="bmap2 map-3-2" ref="map3_2"></div>
    <h1>人流去向-东河区</h1>
    <div class="bmap2 map-3-3" ref="map3_3"></div>
    <h1>人流去向-青山区</h1>
    <div class="bmap2 map-3-4" ref="map3_4"></div>


    <h1>景区-南海湿地</h1>
    <div class="bmap2 map-4-1" ref="map4_1"></div>
    <h1>景区-塞汗塔拉</h1>
    <div class="bmap2 map-4-2" ref="map4_2"></div>

    <h1>居住地人流量最多_东河区</h1>
    <div class="bmap2 map-5-1" ref="map5_1"></div>
    <h1>居住地人流量最多_青山区</h1>
    <div class="bmap2 map-5-2" ref="map5_2"></div>
    <h1>工作地人流量最多_东河区</h1>
    <div class="bmap2 map-5-3" ref="map5_3"></div>
    <h1>工作地人流量最多_青山区</h1>
    <div class="bmap2 map-5-4" ref="map5_4"></div>
    <h1>周末在非工作地、非居住地停留</h1>
    <div class="bmap2 map-5-5" ref="map5_5"></div>

    <h1>到达机场后1小时内去向</h1>
    <div class="bmap2 map-6-1" ref="map6_1"></div>
    <h1>到达机场后居住地</h1>
    <div class="bmap2 map-6-2" ref="map6_2"></div>
</div>
</template>

<script>
require('lib/geo/china.js');
require('lib/geo/neimenggu.js');

const request = require('util/request.js');
const EC = require('util/echarts.js');
const borders = require('lib/geo/border_data.js');
const baotouBorders = require('lib/geo/baotou.js');
const LNG = 110.279451;
const LAT = 40.993743;
const COUNTRYS = [
    {
        name: '九原区', lng: 109.593298, lat: 40.612376
    },{
        name: '昆都仑区', lng:109.795094, lat: 40.676753
    },{
        name: '市区', lng:109.795094, lat: 40.676753
    }, {
        name: '青山区', lng: 109.909502, lat: 40.658804
    }, {
        name: '东河区', lng: 110.049206, lat: 40.586958
    }, {
        name: '石拐区', lng: 110.29412, lat: 40.690321
    }, {
        name: '达茂旗', lng: 110.36311, lat: 41.997456
    }, {
        name: '白云鄂博矿区', lng: 109.962969, lat: 41.772328
    }, {
        name: '土默特右旗', lng: 110.678164, lat: 40.521617
    }, {
        name: '固阳县', lng: 110.122796, lat: 41.072142
    }
];
const HEATMAP_OPTIONS_1 = {
    "radius": 15,
    "gradient": {
        .2:'rgb(169, 145, 255)',
        .5:'rgb(105, 62, 255)',
        .9:'rgb(48, 0, 215)'
    }
};
const COUNTRY_MAP = {};
COUNTRYS.forEach((v) => {
    COUNTRY_MAP[v.name] = v;
});
const BAOTOU_BOUNDRAY = borders['包头'];
const COLOR = [
    '#E4D2F7',
    '#CEB2DD',
    '#BB8DCA',
    '#9E74B1',
    '#845992',
    '#724386',
    '#5E2776'
];
const COLOR_RANGE = [
    50000,
    100000,
    200000,
    300000,
    400000,
    500000,
    9999999999
];
const COLOR_TEXT = [
    '少于5万人',
    '5 ~ 10万人',
    '10 ~ 20万人',
    '20 ~ 30万人',
    '30 ~ 40万人',
    '40 ~ 50万人',
    '50万以上'
];
const HOME_WORK_BALANCE_MIN = 0.60;
const HOME_WORK_BALANCE_MAX = 1.80;
const getPoints = (str) => {
    const arr = str.split(';');
    return arr.map(v => {
        const p = v.split(',');
        return new BMap.Point(p[0].trim(), p[1].trim());
    });
};
const transformData1 = (list) => {
    const categories = [];
    const nodes = [];
    const links = [];

    const nameMap = {};
    const relationMap = {};
    const handle = (source, target, val) => {
        const key = source + '-' + target;
        if (!relationMap[key]) {
            links.push({source, target});
            relationMap[key] = true;
        }
        if (nameMap[source]) {
            nameMap[source] += val * 1;
        } else {
            nameMap[source] = val * 1;
        }
    };
    list.forEach((item) => {
        // COME_TITLE1, COME_TITLE2
        handle(item.COME_TITLE1, item.COME_TITLE2, item.USER_NUM);
        if (item.COME_TITLE3) {
            handle(item.COME_TITLE2, item.COME_TITLE3, item.USER_NUM);
            if (item.COME_TITLE4) {
                handle(item.COME_TITLE3, item.COME_TITLE4, item.USER_NUM);
            }
        }
    });
    for (let k in nameMap) {
        categories.push({name: k});
        nodes.push({
            name: k, category: k, value: nameMap[k],
            symbolSize: nameMap[k] / 1000
        });
    }
    return {
        categories, nodes, links
    }
};
let methods = {};
methods.initMap = function (el) {
    const map = new BMap.Map(el);
    const point = new BMap.Point(109.85546,40.661431);
    map.centerAndZoom(point, 12);
    map.enableScrollWheelZoom();
    return map;
};
methods.drawBorder = function (map, data, options = {}) {
    const points = getPoints(data);
    const line = new BMap.Polyline(points, {
        strokeColor: options.color || 'blue',
        strokeWeight: 1
    });
    map.addOverlay(line);
    return line;
};
methods.drawBoundary = function (map, data, options = {}) {
    const points = getPoints(data);
    const g = new BMap.Polygon(points, {
        strokeColor: 'blue',
        strokeWeight: 2,
        fillColor: options.color,
        fillOpacity: .9
    });

    map.addOverlay(g);
    return g;
};
methods.drawCountyBorder = function (map, countyName, color) {
    const borders = baotouBorders[countyName];
    if (!borders) {
        return;
    }
    // LOG('drawBoundary:' + countyName + ', color:' + color);
    if (typeof borders === 'string') {
        this.drawBoundary(map, borders, {
            color
        });
    } else if (borders.length) {
        this.drawBoundary(map, borders[0], {
            color
        });
        for (let i = 1; i < borders.length; i++) {

        }
    }
};
methods.drawAllCountryRangeColor = function (map) {
    request.fetch1('/getBaotouAllNum').then((data) => {
        for (let i = 0; i < data.length; i++) {
            let countyName = data[i].COUNTY_TITLE;
            let userNum = data[i].USER_NUM * 1;
            this.drawCountyBorder(
                map,
                countyName,
                this.getRangeColor(userNum)
            );
        }
        
    });
};
methods.drawAllCountryBorders = function (map) {
    request.fetch1('/getBaotouAllNum').then((data) => {
        for (let i = 0; i < data.length; i++) {
            let countyName = data[i].COUNTY_TITLE;
            let userNum = data[i].USER_NUM * 1;
            this.drawCountyBorder(
                map,
                countyName,
                ''
            );
        }
        
    });
};
// 根据人数获取颜色
methods.getRangeColor = function (value) {
    for (let i = 0; i < COLOR_RANGE.length; i++) {
        if (COLOR_RANGE[i] > value) {
            return COLOR[i];
        }
    }
    return COLOR[COLOR.length - 1];
};
methods.getIndexColor = function (i) {
    return COLOR[i % COLOR.length];
};
methods.getBoundary = function (str) {
    (new BMap.Boundary()).get(str, (result) => {
        LOG(str + ':', result);
    });
};
methods.initMap1 = function () {
    this.$map1 = this.initMap(this.$refs.map1);
    var top_left_navigation = new BMap.NavigationControl();
    this.$map1.addControl(top_left_navigation);

    this.$map1.addEventListener('click', (e) => {
        LOG('click:' + e.point.lng + ',' + e.point.lat);
        LOG('lng: ' + e.point.lng + ', lat: ' + e.point.lat);
    });
    // this.drawBorder(this.$map1, BAOTOU_BOUNDRAY);
    this.drawAllCountryRangeColor(this.$map1);
};
methods.initMap2 = function () {
    const map = this.$map2 = this.initMap(this.$refs.map2);
    var top_left_navigation = new BMap.NavigationControl();
    map.addEventListener('click', (e) => {
        LOG('click:' + e.point.lng + ',' + e.point.lat);
        LOG('lng: ' + e.point.lng + ', lat: ' + e.point.lat);
    });
    // map.addControl(top_left_navigation);
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouTongqin').then((data) => {
        const points = [];
        data.forEach((v) => {
            const distance = v.ZHU_LI * 1;
            if (distance < 4) {
                return;
            }
            points.push({
                lng: v.CLOGIITUD,
                lat: v.CLATITUDE,
                count: distance
            });
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay(HEATMAP_OPTIONS_1);
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
methods.initMap2_1 = function () {
    const map = this.initMap(this.$refs.map2_1);
    var top_left_navigation = new BMap.NavigationControl();
    // map.addControl(top_left_navigation);
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouTongqin').then((data) => {
        let n1 = 0, n2 = 0, n3 = 0;
        const points = [];
        data.forEach((v) => {
            const distance = v.GONG_LI * 1;
            if (distance < 4) {
                return;
            }
            const ratio = v.GONG_NUM / v.ZHU_NUM;
            if (ratio >= HOME_WORK_BALANCE_MIN && ratio <= HOME_WORK_BALANCE_MAX) {
                points.push({
                    lng: v.CLOGIITUD,
                    lat: v.CLATITUDE,
                    count: distance
                });
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
methods.initMap2_2 = function () {
    const map = this.initMap(this.$refs.map2_2);
    var top_left_navigation = new BMap.NavigationControl();
    // map.addControl(top_left_navigation);
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouTongqin').then((data) => {
        let n1 = 0, n2 = 0, n3 = 0;
        const points = [];
        data.forEach((v) => {
            const distance = v.GONG_LI * 1;
            if (distance > 4) {
                return;
            }
            const ratio = v.GONG_NUM / v.ZHU_NUM;
            if (ratio >= HOME_WORK_BALANCE_MIN && ratio <= HOME_WORK_BALANCE_MAX) {
                points.push({
                    lng: v.CLOGIITUD,
                    lat: v.CLATITUDE,
                    count: distance
                });
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
methods.initMap2_3 = function () {
    const map = this.initMap(this.$refs.map2_3);
    var top_left_navigation = new BMap.NavigationControl();
    // map.addControl(top_left_navigation);
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouTongqin').then((data) => {
        let n1 = 0, n2 = 0, n3 = 0;
        const points = [];
        data.forEach((v) => {
            const distance = v.ZHU_LI * 1;
            if (distance < 4) {
                return;
            }
            const ratio = v.GONG_NUM / v.ZHU_NUM;
            if (ratio >= HOME_WORK_BALANCE_MIN && ratio <= HOME_WORK_BALANCE_MAX) {
                points.push({
                    lng: v.CLOGIITUD,
                    lat: v.CLATITUDE,
                    count: distance
                });
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};

methods.initMap2_5 = function () {
    const map = this.initMap(this.$refs.map2_5);
    var top_left_navigation = new BMap.NavigationControl();
    // map.addControl(top_left_navigation);
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouTongqin').then((data) => {
        let n1 = 0, n2 = 0, n3 = 0;
        const points = [];
        data.forEach((v) => {
            const distance = v.ZHU_LI * 1;
            if (distance < 3) {
                return;
            }
            const ratio = v.GONG_NUM / v.ZHU_NUM;
            if (ratio < HOME_WORK_BALANCE_MIN) {
                points.push({
                    lng: v.CLOGIITUD,
                    lat: v.CLATITUDE,
                    count: distance
                });
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
methods.initMap2_6 = function () {
    const map = this.initMap(this.$refs.map2_6);
    var top_left_navigation = new BMap.NavigationControl();
    // map.addControl(top_left_navigation);
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouTongqin').then((data) => {
        let n1 = 0, n2 = 0, n3 = 0;
        const points = [];
        data.forEach((v) => {
            const distance = v.GONG_LI * 1;
            if (distance < 5) {
                return;
            }
            const ratio = v.GONG_NUM / v.ZHU_NUM;
            if (ratio > HOME_WORK_BALANCE_MAX) {
                points.push({
                    lng: v.CLOGIITUD,
                    lat: v.CLATITUDE,
                    count: distance
                });
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
methods.getOption1 = function (data) {
    const geoData = data.map(v => {
        return {
            value: v.USER_NUM * 1,
            fromLng: COUNTRY_MAP[v.COME_TITLE].lng,
            fromLat: COUNTRY_MAP[v.COME_TITLE].lat,
            fromName: v.COME_TITLE,
            toLng: COUNTRY_MAP[v.GO_TITLE].lng,
            toLat: COUNTRY_MAP[v.GO_TITLE].lat,
            toName: v.GO_TITLE
        }
    });
    geoData.sort((a, b) => {
        return (a.value > b.value) ? 1 : -1
    });
    const geo = EC.getChartGeo({
        map: '内蒙古',
        center: [110.266525,41.449578],
        zoom: 6
    });
    return EC.getMapPlaneOption({
        title: {
            text: '各居住地人流工作去向'
        },
        yAxis: {
            show: false

        }
    }, {data: geoData, geo: geo});
};
methods.getOption2 = function (data) {
    const geoData = data.map(v => {
        return {
            value: v.USER_NUM * 1,
            fromLng: COUNTRY_MAP[v.GO_TITLE].lng,
            fromLat: COUNTRY_MAP[v.GO_TITLE].lat,
            fromName: v.GO_TITLE,
            toLng: COUNTRY_MAP[v.COME_TITLE].lng,
            toLat: COUNTRY_MAP[v.COME_TITLE].lat,
            toName: v.COME_TITLE
        }
    });
    geoData.sort((a, b) => {
        return (a.value > b.value) ? 1 : -1
    });
    const geo = EC.getChartGeo({
        map: '内蒙古',
        center: [110.266525,41.449578],
        zoom: 6
    });
    return EC.getMapPlaneOption({
        title: {
            text: '各工作地人流居住来源'
        },
        yAxis: {
            show: false

        }
    }, {data: geoData, geo: geo});
};
methods.getOption3 = function (data) {
    const cdata = transformData1(data);
    // LOG(cdata);
    // 过滤
    let nodes = cdata.nodes.filter((v) => {
        return (v.symbolSize > 1)
    });
    nodes.forEach((v) => {
        let size = Math.sqrt(v.symbolSize) * 2;
        size = Math.round(size);
        v.symbolSize = Math.min(size, 500);
    });
    return EC.getForceRelationChart({
        legend: {
            data: cdata.categories.map(v => v.name)
        },
        series: {
            name: '流动路线',
            categories: cdata.categories,
            data: nodes,
            links: cdata.links
        }
    });
};
methods.getOption4 = function (data) {
    const geoData = data.map(v => {
        return {
            value: v.USER_NUM * 1,
            fromLng: COUNTRY_MAP[v.COME_TITLE].lng,
            fromLat: COUNTRY_MAP[v.COME_TITLE].lat,
            fromName: v.COME_TITLE,
            toLng: COUNTRY_MAP[v.GO_TITLE].lng,
            toLat: COUNTRY_MAP[v.GO_TITLE].lat,
            toName: v.GO_TITLE
        }
    });
    geoData.sort((a, b) => {
        return (a.value > b.value) ? 1 : -1
    });
    const geo = EC.getChartGeo({
        map: '内蒙古',
        center: [110.266525,41.449578],
        zoom: 6
    });
    return EC.getMapPlaneOption({
        title: {
            text: '昆都仑区与各旗县人流流动关系',
            textStyle: {
                fontSize: 32
            }
        },
        yAxis: {
            show: false

        }
    }, {data: geoData, geo: geo});
};
methods.getOption5 = function (data) {
    const geoData = data.map(v => {
        return {
            value: v.USER_NUM * 1,
            fromLng: COUNTRY_MAP[v.COME_TITLE].lng,
            fromLat: COUNTRY_MAP[v.COME_TITLE].lat,
            fromName: v.COME_TITLE,
            toLng: COUNTRY_MAP[v.GO_TITLE].lng,
            toLat: COUNTRY_MAP[v.GO_TITLE].lat,
            toName: v.GO_TITLE
        }
    });
    geoData.sort((a, b) => {
        return (a.value > b.value) ? 1 : -1
    });
    const geo = EC.getChartGeo({
        map: '内蒙古',
        center: [110.266525,41.449578],
        zoom: 6
    });
    return EC.getMapPlaneOption({
        title: {
            text: '市区和各旗县人流流动关系',
            textStyle: {
                fontSize: 32
            }
        },
        yAxis: {
            show: false
        }
    }, {data: geoData, geo: geo});
};
methods.getOption5_1 = function (data) {
    const geoData = data.map(v => {
        return {
            value: v.USER_NUM * 1,
            fromLng: COUNTRY_MAP[v.COME_TITLE].lng,
            fromLat: COUNTRY_MAP[v.COME_TITLE].lat,
            fromName: v.COME_TITLE,
            toLng: COUNTRY_MAP[v.GO_TITLE].lng,
            toLat: COUNTRY_MAP[v.GO_TITLE].lat,
            toName: v.GO_TITLE
        }
    });
    geoData.sort((a, b) => {
        return (a.value > b.value) ? 1 : -1
    });
    const geo = EC.getChartGeo({
        map: '内蒙古',
        center: [110.266525,41.449578],
        zoom: 7
    });
    return EC.getMapPlaneOption({
        title: {
            text: '东河区与各旗县人流流动关系',
            textStyle: {
                fontSize: 32
            }
        },
        yAxis: {
            show: false
        }
    }, {data: geoData, geo: geo});
};
methods.getOption5_2 = function (data) {
    const geoData = data.map(v => {
        return {
            value: v.USER_NUM * 1,
            fromLng: COUNTRY_MAP[v.COME_TITLE].lng,
            fromLat: COUNTRY_MAP[v.COME_TITLE].lat,
            fromName: v.COME_TITLE,
            toLng: COUNTRY_MAP[v.GO_TITLE].lng,
            toLat: COUNTRY_MAP[v.GO_TITLE].lat,
            toName: v.GO_TITLE
        }
    });
    geoData.sort((a, b) => {
        return (a.value > b.value) ? 1 : -1
    });
    const geo = EC.getChartGeo({
        map: '内蒙古',
        center: [110.266525,41.449578],
        zoom: 6
    });
    return EC.getMapPlaneOption({
        title: {
            text: '固阳县与各旗县人流流动关系',
            textStyle: {
                fontSize: 32
            }
        },
        yAxis: {
            show: false
        }
    }, {data: geoData, geo: geo});
};
methods.getOption5_3 = function (data) {
    const geoData = data.map(v => {
        return {
            value: v.USER_NUM * 1,
            fromLng: COUNTRY_MAP[v.COME_TITLE].lng,
            fromLat: COUNTRY_MAP[v.COME_TITLE].lat,
            fromName: v.COME_TITLE,
            toLng: COUNTRY_MAP[v.GO_TITLE].lng,
            toLat: COUNTRY_MAP[v.GO_TITLE].lat,
            toName: v.GO_TITLE
        }
    });
    geoData.sort((a, b) => {
        return (a.value > b.value) ? 1 : -1
    });
    const geo = EC.getChartGeo({
        map: '内蒙古',
        center: [110.266525,41.449578],
        zoom: 6
    });
    return EC.getMapPlaneOption({
        title: {
            text: '土默特右旗与各旗县人流流动关系',
            textStyle: {
                fontSize: 32
            }
        },
        yAxis: {
            show: false
        }
    }, {data: geoData, geo: geo});
};
methods.initChart1 = function () {
    request.fetch2('/getBaotouGoRoute').then((data) => {
        this.o1 = this.getOption1(data);
    }).catch((err) => {
        this.o1 = 'empty';
        LOG('initChart1:', err);
    });
};
methods.initChart2 = function () {
    request.fetch2('/getBaotouComeRoute').then((data) => {
        this.o2 = this.getOption2(data);
    }).catch((err) => {
        this.o2 = 'empty';
        LOG('initChart2:', err);
    });
};
methods.initChart3 = function () {
    request.fetch1('/getBaotouRoutes').then((data) => {
        this.o3 = this.getOption3(data);
    }).catch((e) => {
        LOG(e);
    });
};
methods.initChart4 = function () {
    request.fetch2('/getBaotouRoutes4').then((data) => {
        this.o4 = this.getOption4(data);
    }).catch((e) => {
        LOG(e);
    });
};
methods.initChart5 = function () {
    request.fetch2('/getBaotouRoutes5').then((data) => {
        this.o5 = this.getOption5(data);
    }).catch((e) => {
        LOG(e);
    });
};
methods.initChart5_1 = function () {
    request.fetch2('/getBaotouRoutes5_1').then((data) => {
        this.o5_1 = this.getOption5_1(data);
    }).catch((e) => {
        LOG(e);
    });
};
methods.initChart5_2 = function () {
    request.fetch2('/getBaotouRoutes5_2').then((data) => {
        this.o5_2 = this.getOption5_2(data);
    }).catch((e) => {
        LOG(e);
    });
};
methods.initChart5_3 = function () {
    request.fetch2('/getBaotouRoutes5_3').then((data) => {
        this.o5_3 = this.getOption5_3(data);
    }).catch((e) => {
        LOG(e);
    });
};
methods.initMap3 = function () {
    const map = this.initMap(this.$refs.map3);
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouTongqin').then((data) => {
        const points = [];
        data.forEach((v) => {
            const distance = v.GONG_LI * 1;
            if (distance < 4) {
                return;
            }
            points.push({
                lng: v.CLOGIITUD,
                lat: v.CLATITUDE,
                count: distance
            });
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
methods.initMap3_1 = function () {
    const map = this.initMap(this.$refs.map3_1);
    var top_left_navigation = new BMap.NavigationControl();
    // this.drawAllCountryBorders(map);
    this.drawCountyBorder(
        map,
        '东河区',
        '#fff'
    );
    request.fetch1('/getBaotouSourceDonghe').then((data) => {
        const points = data.map(v => {
            const count = v.USER_NUM * 1;
            if (count < 10) {
                return {};
            }
            return {
                lng: v.CLOGIITUD,
                lat: v.CLATITUDE,
                count: count
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    }).catch((e) => {
        LOG(e);
    });
};
methods.initMap3_2 = function () {
    const map = this.initMap(this.$refs.map3_2);
    var top_left_navigation = new BMap.NavigationControl();
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouSourceQingshan').then((data) => {
        const points = data.map(v => {
            const count = v.USER_NUM * 1;
            if (count < 30) {
                return {};
            }
            return {
                lng: v.CLOGIITUD,
                lat: v.CLATITUDE,
                count: count
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
methods.initMap3_3 = function () {
    const map = this.initMap(this.$refs.map3_3);
    var top_left_navigation = new BMap.NavigationControl();
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouGoWhereDonghe').then((data) => {
       const points = data.map(v => {
            const count = v.USER_NUM * 1;
            if (count < 30) {
                return {};
            }
            return {
                lng: v.CLOGIITUD,
                lat: v.CLATITUDE,
                count: count
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
methods.initMap3_4 = function () {
    const map = this.initMap(this.$refs.map3_4);
    var top_left_navigation = new BMap.NavigationControl();
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouGoWhereQingshan').then((data) => {
        const points = data.map(v => {
            const count = v.USER_NUM * 1;
            if (count < 30) {
                return {};
            }
            return {
                lng: v.CLOGIITUD,
                lat: v.CLATITUDE,
                count: count
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};

methods.initMap4_1 = function () {
    const map = this.initMap(this.$refs.map4_1);
    var top_left_navigation = new BMap.NavigationControl();
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouSeceneryNanhai').then((data) => {
        const points = data.map(v => {
            const count = v.REN_NUM * 1;
            if (count < 30) {
                return {};
            }
            return {
                lng: v.CLOGIITUD,
                lat: v.CLATITUDE,
                count: count
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
methods.initMap4_2 = function () {
    const map = this.initMap(this.$refs.map4_2);
    var top_left_navigation = new BMap.NavigationControl();
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouSecenerySaihantala').then((data) => {
        const points = data.map(v => {
            const count = v.REN_NUM * 1;
            if (count < 50) {
                return {};
            }
            return {
                lng: v.CLOGIITUD,
                lat: v.CLATITUDE,
                count: count
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
methods.initMap5_1 = function () {
    const map = this.initMap(this.$refs.map5_1);
    var top_left_navigation = new BMap.NavigationControl();
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouLiveMostDonghe').then((data) => {
        const points = data.map(v => {
            const count = v.REN_NUM * 1;
            if (count < 500) {
                return {};
            }
            return {
                lng: v.CLOGIITUD,
                lat: v.CLATITUDE,
                count: count
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
methods.initMap5_2 = function () {
    const map = this.initMap(this.$refs.map5_2);
    var top_left_navigation = new BMap.NavigationControl();
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouLiveMostQingshan').then((data) => {
        const points = data.map(v => {
            const count = v.REN_NUM * 1;
            if (count < 500) {
                return {};
            }
            return {
                lng: v.CLOGIITUD,
                lat: v.CLATITUDE,
                count: count
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
methods.initMap5_3 = function () {
    const map = this.initMap(this.$refs.map5_3);
    var top_left_navigation = new BMap.NavigationControl();
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouWorkMostDonghe').then((data) => {
        const points = data.map(v => {
            const count = v.REN_NUM * 1;
            if (count < 500) {
                return {};
            }
            return {
                lng: v.CLOGIITUD,
                lat: v.CLATITUDE,
                count: count
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
methods.initMap5_4 = function () {
    const map = this.initMap(this.$refs.map5_4);
    var top_left_navigation = new BMap.NavigationControl();
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouWorkMostQingshan').then((data) => {
        const points = data.map(v => {
            const count = v.REN_NUM * 1;
            if (count < 500) {
                return {};
            }
            return {
                lng: v.CLOGIITUD,
                lat: v.CLATITUDE,
                count: count
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
methods.initMap5_5 = function () {
    const map = this.initMap(this.$refs.map5_5);
    var top_left_navigation = new BMap.NavigationControl();
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouNotHomeNotWork').then((data) => {
        const points = data.map(v => {
            const count = v.REN_NUM * 1;
            if (count < 1000) {
                return {};
            }
            return {
                lng: v.CLOGIITUD,
                lat: v.CLATITUDE,
                count: count
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};

methods.initMap6_1 = function () {
    const map = this.initMap(this.$refs.map6_1);
    var top_left_navigation = new BMap.NavigationControl();
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouAirportOneHour').then((data) => {
        const points = data.map(v => {
            const count = v.REN_NUM * 1;
            if (count < 500) {
                return {};
            }
            return {
                lng: v.CLOGIITUD,
                lat: v.CLATITUDE,
                count: count
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
methods.initMap6_2 = function () {
    const map = this.initMap(this.$refs.map6_2);
    var top_left_navigation = new BMap.NavigationControl();
    this.drawAllCountryBorders(map);
    request.fetch1('/getBaotouAirportLive').then((data) => {
        const points = data.map(v => {
            const count = v.REN_NUM * 1;
            if (count < 10) {
                return {};
            }
            return {
                lng: v.CLOGIITUD,
                lat: v.CLATITUDE,
                count: count
            }
        });
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points});
    });
};
let computed = {};
computed.colorIntroList = function () {
    return COLOR.map((v, i) => {
        return {
            color: v,
            text: COLOR_TEXT[i]
        }
    });
};
let watch = {};
const created = function () {};
const mounted = function () {
    window.VM = this;
    if (!window.BMap) {
        return this.$msg('百度地图加载失败');
    }
    this.initMap1();
    // this.initChart1();
    // this.initChart2();
    this.initMap2();
    // this.initChart3();
    // this.initChart4();
    // this.initChart5();
    this.initChart5_1();
    this.initChart5_2();
    this.initChart5_3();
    // this.initMap3();
    /*
    this.initMap2_1();
    this.initMap2_2();
    this.initMap2_3();
    this.initMap2_4();
    this.initMap2_5();
    this.initMap2_6();
    */
    /*
    this.initMap3_1();
    this.initMap3_2();
    this.initMap3_3();
    this.initMap3_4();

    this.initMap4_1();
    this.initMap4_2();

    this.initMap5_1();
    this.initMap5_2();
    this.initMap5_3();
    this.initMap5_4();
    this.initMap5_5();

    this.initMap6_1();
    this.initMap6_2();
    */
};
const beforeDestroy = function () {
    
};
const dataFunc = function () {
    let o = {
        o1: null,
        o2: null,
        o3: null,
        o4: null,
        o5: null,
        o5_1: null,
        o5_2: null,
        o5_3: null,
        o6: null
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
    mixins: [],
    beforeDestroy,
    components: {
        'my-chart': require('comp/common/my-chart.vue')
    }
};
</script>

<style scoped lang="less">
.my-root {
    padding-bottom: 50px;
}
h1 {
    margin-top: 15px;
    margin-bottom: 10px;
    text-align: center;
}
.bmap {
    width: 1280px;
    height: 840px;
    background-color: #333;
    margin-left: auto;
    margin-right: auto;
}
.bmap2 {
    width: 1280px;
    height: 768px;
    margin-left: auto;
    margin-right: auto;
}
.color-intro-box {
    position: absolute;
    background-color: rgba(255, 255, 255, .5);
    right: 100px;
    bottom: 55px;
}
.color-intro-box > ul {
    padding: 1px 16px 16px;
    & > li {
        display: block;
        width: 180px;
        margin-top: 15px;
        em {
            display: inline-block;
            width: 60px;
            height: 30px;
        }
        span {
            line-height: 30px;
            margin-left: 20px;
            vertical-align: -4px;
        }
    }
}
.chart-1,
.chart-2,
.chart-3,
.chart-4,
.chart-5,
.chart-5-1,
.chart-5-2,
.chart-5-3,
.chart-6 {
    width: 1280px;
    height: 880px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;

}
</style>
<style>
.BMap_cpyCtrl.BMap_noprint {
    visibility: hidden;
}
a[title=到百度地图查看此区域] {
    display: none;
}
</style>