define([], function () {
    var chart = {
        theme: 'vintage'
    };
    const getNetType = () => {
        let host = location.hostname;
        if (host.indexOf('218.202') >= 0) {
            return 'internet';
        }

        if (host.indexOf('nm139') >= 0) {
            return 'internet';
        }
        return 'oa';
    };
    const getUserFlag = () => {
        if (!userCode) {
            return 'undefined';
        }
        if (isNaN(userCode)) {
            return userCode;
        }
        let len = userCode.length;
        if (len === 3) {
            return 'city';
        } else if (len === 4) {
            return 'scenery';
        }
        return 'unknown';
    };
    let global = window.global || {};
    let webroot = global.basePath || '/TD-nmtravel-web';
    let dev = (location.port === '8899');
    let gisWebUrlBase = 'http://218.202.107.162:9106/TouristMnt';
    let nettype = getNetType();
    let userCode = global.operatorCode;
    let gisUrlBase = gisWebUrlBase;
    if (nettype === 'oa') {
        gisUrlBase = 'http://10.221.137.131:9106/TouristMnt';
    }
    let user = {
        flag: getUserFlag(),
        code: userCode || ''
    };
    return {
        dev,
        nettype,
        gisWebUrlBase,
        gisUrlBase,
        user,
        loopRenderInterval: 15,
        root: webroot,
        ajaxlocal: false,
        ajaxPath: webroot + '/InnerGate',
        factor: 1.0,
        chart: chart,
        mainColor: '#eee',
        bigShowDate: '2017-05-15',
        bigShowRatio: 0.75
    };
});