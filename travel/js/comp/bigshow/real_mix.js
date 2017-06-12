
var tool = require('util/tool');
var config = require('global/config');
var request = require('util/request.js').default;
var URL = require('util/url');

let myInstance = [];
let loopTimer;
let loopRequestTimer;
const loopRequestInterval = 60;
const loopRefreshInterval = 6;

let realMixData;

const loopRequest = function () {
    loopRequestTimer = setTimeout(() => {
        realMixData = null;

        loopRequest();
    }, loopRequestInterval * 1000);
};

const sendRequest = function (callback) {
    callback = callback || function () {};
    if (realMixData) {
        return callback(randomIt(realMixData));
    }
    let id = URL.query().id || 7112;

    request.getAttractionSource1(id).then((data) => {
        request.getAttractionSource12(id).then((data2) => {
            data = data.concat(data2.map((v) => {
                if (v.cityDesc) {
                    v.provinceName = v.cityDesc;
                }

                return v;
            }));
            realMixData = [data, data2];
            callback(randomIt(realMixData));
        });
    });
};

const run = () => {

    sendRequest((r) => {
        myInstance.forEach((v) => {
            v.fetchRender(r);
        });

        loopRefresh();
    });
};

const loopRefresh = function () {
    loopTimer = setTimeout(() => {
        run();
    }, loopRefreshInterval * 1000);
};

const HHHT_ADD = 100;

const randomHHHT = () => {
    let n = parseInt(10 * Math.random());
    if (n <= 3) {
        return 0;
    }
    if (n <= 6) {
        return 1;
    }
    return n - 3;
};

const randomIt = (data) => {
    let data0 = data[0] || [];
    let list = [];
    for (let i = 0; i < data0.length; i++) {
        let item = tool.extend({}, data0[i]);
        // 系数
        item.userNum = Math.ceil(item.userNum / config.bigShowRatio);
        if (item.cityDesc === '呼和浩特') {
            
            item.userNum += HHHT_ADD + randomHHHT();
        } else {
            item.userNum += parseInt((data0.length - i) / 3, 10);
        }
        
        list.push(item);
    }
    return [
        list,
        data[1]
    ];
};

const created = function () {
    
};
const mounted = function () {
    myInstance.push(this);
    if (myInstance.length === 2) {
        run();
    }
    if (myInstance.length === 1) {
        loopRequest();
    }
};
const activated = function () {};
const deactivated = function () {};
const beforeDestroy = function () {
    for (let i = 0; i < myInstance.length; i++) {
        if (myInstance[i] === this) {
            myInstance.splice(i, 1);
            break;
        }
    }
};


let methods = {};
let computed = {};
module.exports = {
    props: [],
    data: function () {
        var o = {};
        return o;
    },
    methods,
    computed,
    created,
    mounted,
    activated,
    deactivated,
    beforeDestroy
};