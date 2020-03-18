define(['global/dev'], function (dev) {
    var chart = {
        theme: 'vintage',
        geoBackgroundColor: '#2F4050'
    };
    const getNetType = () => {
        let host = location.hostname;
        if (host.indexOf('218.202') >= 0 || host.indexOf('111.56.127.') >= 0) {
            return 'internet';
        }

        if (host.indexOf('nm135') >= 0) {
            return 'internet';
        }
        if (host.indexOf('localhost') >= 0) {
            return 'internet';
        }
        return 'oa';
    };
    const getUserFlag = () => {
        if (!userCode) {
            return 'null';
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
        return 'null';
    };
    let global = window.global || {};
    let basePath = global.basePath || '/TD-nmtravel-web';
    let staticPath = global.staticPath || '';
    let staticVersion = global.version || '1';
    let imgPath = staticPath + '/images';
    let isProduction = (dev.env === 'production');
    let nettype = getNetType();
    let userCode = global.operatorCode;
    let gisUrlBase = 'http://218.202.107.162:9106/TouristMnt';
    if (nettype === 'oa') {
        gisUrlBase = 'http://10.221.137.131:9106/TouristMnt';
    }
    if (userCode === 'null') {
        userCode = global.user_id;
    }
    let user = {
        flag: getUserFlag(),
        auth: (global.city === '400') ? 'all' : 'city',
        code: userCode || '',
        cityId: global.city,
        id: global.user_id
    };
    user.olen = user.id ? user.id.length : 0;
    let winScreen = window.screen;
    let screen = {
        isBig: (winScreen.width > 1880)
    };
    const POSTGRE_HOST = 'http://111.56.127.161:8080';
    const I = '-';
    const NUM = '~!' + ['@', '$'].join('#');
    return {
        dev: !isProduction,
        screen,
        nettype,
        gisUrlBase,
        basePath,
        staticPath,
        staticVersion,
        imgPath,
        user,
        loopRenderInterval: 15,
        root: basePath,
        ajaxlocal: false,
        ajaxPath: basePath + '/InnerGate',
        factor: 1.0,
        chart: chart,
        mainColor: '#eee',
        uploadUrl: '/upload.action',
        homeMap: {
            0: '全部',
            1: '省内',
            2: '省外',
            3: '境外'
        },
        bigShowDate: '2017-05-15',
        bigShowRatio: 1,
        gisToken: {
            timestamp: global.timestamp || '',
            signature: global.signature || ''
        },
        passkey: ['TR', 'AV', 'EL','20', '19'].join('') + I + NUM
    };
});