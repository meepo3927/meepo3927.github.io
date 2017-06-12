let config = require('global/config');
let global = window.global || {};
let urlBase = config.gisUrlBase;
let arcUrlBase = urlBase + '/drawtourist.jsp';

exports.getUrl = function (options = {}) {
    let {type, name} = options;
    let cityId = global.cityId || $('#citySelect').val();
    var arr = [
        'opType=' + type,
        'sceneryName=' + encodeURIComponent(name),
        'cityId=' + cityId,
        'operatorCode=' + global.operatorCode
    ];

    if (options.sceneryId) {
        arr.push('sceneryId=' + options.sceneryId);
    }
    return arcUrlBase + '?' + arr.join('&');
};

exports.notice = function (data, options = {}) {
    let url = config.gisWebUrlBase + '/optScenery.action';
    return $.ajax({
        url,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'jsonpCallback',
        data,
    });
};

exports.openIframe = function (url, options = {}) {
    if (typeof url === 'object') {
        url = exports.getUrl(url);
    }
    var html = [
        '<div class="iframe-layer">',
            '<h4>' + options.title + '</h4>',
            '<div class="iframe-wrapper">',
                '<iframe class="arc-iframe" src="' + url + '"></iframe>',
            '</div>',
        '</div>'
    ].join('');
    return mlayer.html(html, {
        height: '92%',
        width: '94%',
        beforeClose: options.onClose
    });
};