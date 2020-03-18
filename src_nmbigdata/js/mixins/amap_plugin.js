let Promise = require('Promise');
let config = require('global/config');
let mapUtil = require('util/map.js');
let tool = require('util/tool.js');

// loc图标
const RED_LOC_ICON = 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png';
const themeColor = config.themeColor;
const created = function () {
};
const mounted = function () {
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
};
let methods = {};
// 定位当前城市
methods.locateCurrentCity = function () {
    return new Promise((r, j) => {
        const searchCallback = function (status, result) {
            let rr = {status, result};
            if (status !== 'complete') {
                return j(rr);
            }
            if (!result) {
                return j(rr);
            }
            r(rr);
            // mlayer.msg('当前城市：' + result.city, {time: 1800});
            // 地图显示当前城市
            // result.bounds && self.map.setBounds(result.bounds);
        };
        AMap.plugin(['AMap.CitySearch'], function () {
            // 定位城市
            var citySearch = new AMap.CitySearch();
            // 自动获取用户IP，返回当前城市
            citySearch.getLocalCity(searchCallback);
        });
    });
};
/**
 * 定位当前位置
 * @param  {Function} callback  回调
 */
methods.locateCurrentPosition = function () {
    return new Promise((r, j) => {
        function onComplete(data) {
            mlayer.msg('定位成功');
            r(data);
        }
        function onError(data) {
            mlayer.msg('定位失败');
            j(data);
        }
        AMap.plugin(['AMap.Geolocation'], function () {
            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                buttonPosition: 'RB'
            });

            // map.addControl(geolocation);
            mlayer.msg('正在定位当前位置..');
            geolocation.getCurrentPosition();
            geolocation.on('complete', onComplete); //返回定位信息
            geolocation.on('error', onError);      //返回定位出错信息
        });
    });
};
/**
 * 获取地址
 */
methods.getAddress = function (point) {
    return new Promise((r, j) => {
        AMap.plugin(['AMap.Geocoder'], function () {
            var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: 'all'
            });
            geocoder.getAddress(point, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    r(result.regeocode);
                } else {
                    j({status, result});
                }
            });
        });
    });
};
/**
 * 添加点标记
 */
methods.addMarker = function (point) {
    return new AMap.Marker({
        position: point,
        map: this.map
    });
};
/**
 * 画圆
 */
methods.drawCircle = function (radius, point) {
    return new AMap.Circle({
        bubble: true,
        map: this.map,
        center: point,  // 圆心位置
        radius: radius, //半径
        strokeColor: themeColor, //线颜色
        strokeOpacity: 0.8,   //线透明度
        strokeWeight: 2,   //线粗细度
        fillColor: "#fff", //填充颜色
        fillOpacity: 0.6    //填充透明度
    });
};
/**
 * 画曲线
 */
methods.drawlines = function (point) {
    if (!window.AMap || !point) {
        return false;
    }
    for (var i = 0; i < 10; i++) {
        var randPoint = mapUtil.getRandPoint(point, {
            radius: 300
        });
        var randPointArr = [randPoint.lng, randPoint.lat];
        var lineArr = [
            [point.lng, point.lat],
            randPointArr
        ];
        var polyline = new AMap.Polyline({
            map: this.map,
            bubble: true,
            path: lineArr,            // 设置线覆盖物路径
            strokeColor: themeColor,   // 线颜色
            strokeOpacity: 0.7,         // 线透明度
            strokeWeight: 2,          // 线宽
            strokeStyle: 'dashed',     // 线样式
            strokeDasharray: [10, 5], // 补充线样式
            geodesic: true            // 绘制大地线
        });
        var marker = new AMap.Marker({
            map: this.map,
            position: randPointArr,
            icon: RED_LOC_ICON
        });
    }
};
methods.drawMarkerCircle = function (point, options) {
    if (!this.map || !point) {
        return;
    }
    options = options || {};
    this.map.clearMap();
    // 添加marker
    var marker = this.addMarker(point);
    // 画圆
    var circle = this.drawCircle(this.radius, point);
    this.map.panTo(point);

    if (options.autoZoom) {
        this.map.setZoom(this.getBestZoomByRadius(this.radius));
    } else if (options.fitView) {
        this.map.setFitView();
    }
};
/**
 * 热力图
 * @param  {Point} point, 中心点
 */
methods.renderHeatmap = function (point, o) {
    if (!this.map || !point) {
        return;
    }
    let radius = this.radius / 25;
    this.removeHeatmap();
    if (typeof o === 'object') {
        var heatmapData = o;
    } else {
        heatmapData = mapUtil.getRandPointBatch(point, o || 40, {
            radius: radius
        });
        for (var i = 0; i < heatmapData.length; i++) {
            heatmapData[i].count = tool.getRandInt(100, 777);
        }
    }

    this.drawHeatPointData(heatmapData);
    return heatmapData;
};
methods.drawHeatPointData = function (arr, callback) {
    var self = this;
    this.map.plugin(["AMap.Heatmap"], function() {
        //初始化heatmap对象
        self.heatmap = new AMap.Heatmap(self.map, {
            radius: 25, //给定半径
            opacity: [0, 0.8]
        });
        //设置数据集
        self.heatmap.setDataSet({
            data: arr,
            max: 500
        });
        callback && callback.call(self, self.heatmap);
    });
};

methods.removeHeatmap = function () {
    if (this.heatmap) {
        this.map.remove(this.heatmap);
        this.heatmap = null;
    }
};

methods.showTraffic = function () {
    if (!this.map) {
        return false;
    }
    if (!this.aMapTraffic) {
        this.aMapTraffic = new AMap.TileLayer.Traffic({
            autoRefresh: true,
            opacity: 1,
            map: this.map
        });
    }
    this.aMapTraffic.show();
};

methods.hideTraffic = function () {
    if (this.aMapTraffic) {
        this.aMapTraffic.hide();
    }
};

methods.showSatellite = function () {
    if (!this.map) {
        return false;
    }
    if (!this.Satellite) {
        this.Satellite = new AMap.TileLayer.Satellite({
            opacity: 1,
            detectRetina: true,
            map: this.map
        });
    }
    this.Satellite.show();
};

methods.hideSatellite = function () {
    if (this.Satellite) {
        this.Satellite.hide();
    }
};

methods.showMapInfo = function (info, point) {
    if (typeof info === 'string') {
        var content = info;
    } else if (Array.isArray(info)) {
        content = info.join('<br />');
    } else {
        return;
    }
    if (!window.AMap) {
        return;
    }
    this.mapInfoWindow = new AMap.InfoWindow({
        content,
        offset: new AMap.Pixel(8, -28)
    });
    this.mapInfoWindow.open(this.map, point);
};

methods.toZoom = function (bestZoom) {
    if (!this.map) {
        return false;
    }
    bestZoom = bestZoom || 14;
    var zoom = this.map.getZoom();
    var zoomDiff = bestZoom - zoom;
    if (zoomDiff >= 6) {
        this.map.setZoom(zoom + 3);
    } else if (zoomDiff >= 4) {
        this.map.setZoom(zoom + 2);
    } else if (zoomDiff >= 2) {
        this.map.setZoom(zoom + 1);
    }
};

methods.getBestZoomByRadius = function (radius) {
    if (radius === undefined) {
        return 14;
    }
    var mapping = {
        500: 15,
        1000: 14,
        2000: 13,
        3000: 12,
        5000: 12
    };
    if (mapping[radius]) {
        return mapping[radius];
    }
    for (var i in mapping) {
        if (mapping.hasOwnProperty(i)) {
            if (radius < i) {
                return mapping[i];
            }
        }
    }
    return 14;
};

methods.addPoiPoints = function (points) {
    if (!window.AMap) {
        return false;
    }
    var self = this;
    this.poiPoints = this.poiPoints || [];
    points.forEach(function (p) {
        var point = [p.lng, p.lat];
        var marker = new AMap.Marker({
            map: self.map,
            position: point,
            icon: RED_LOC_ICON
        });
        marker.setAnimation('AMAP_ANIMATION_DROP');
        self.poiPoints.push(marker);
    });
};
methods.clearPoiPoints = function () {
    if (this.poiPoints) {
        this.poiPoints.forEach(function (item) {
            item.setMap(null);
        });
        this.poiPoints.length = 0;
    }
};
let computed = {};
let watch = {};
module.exports = {
    props: [],
    data: function () {
        var o = {};
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