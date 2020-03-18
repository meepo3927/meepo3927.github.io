(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }

    var colorPalette = [
        '#4693DB',
        '#F25A15',
        '#61a0a8',
        '#3366CC',
        '#91c7ae',
        '#749f83',
        '#c4ccd3',
        '#bda29a',
        '#6e7074',
        '#546570',
        '#ca8622'
    ];
    var theme = {
        color: colorPalette,
        // backgroundColor: '#333',
        title: {
            left: 'center'
        }
    };

    echarts.registerTheme('six', theme);
    return theme;
}));