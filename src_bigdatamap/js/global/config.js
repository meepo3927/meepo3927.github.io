// From Webpack
let env = '';
try {
    env = process.env.NODE_ENV;
} catch(e) {
    env = 'production';
}

// 运行环境
let isProduction = (env === 'production');

// 全局Inject变量
let global = window.global || {};
let basePath = global.basePath || '';

// 用户信息
let user = {};

// Ajax请求路径
if (isProduction) {
    var ajaxUrlBase = basePath;
} else {
    ajaxUrlBase = basePath + '/mock';
}

const geoCoordMapArray = {
    '阿拉善':   [105.696202,38.846604],
    '巴彦淖尔': [107.393497,40.764374],
    '乌海':     [106.831229,39.679471],
    '鄂尔多斯': [109.804692,39.60246],
    '包头':     [109.854422,40.651275],
    '呼和浩特': [111.731234,40.841157],
    '乌兰察布': [113.143802,41.001969],
    '锡林郭勒': [116.0878,43.943579],
    '赤峰':     [118.968271,42.298042],
    '通辽':     [122.247302,43.646958],
    '兴安盟':   [122.044068,46.090117],
    '呼伦贝尔': [119.767403,49.223704]
};
const geoCoordMap = {};
for (let cityName in geoCoordMapArray) {
    let arr = geoCoordMapArray[cityName];
    geoCoordMap[cityName] = {
        lng: arr[0],
        lat: arr[1]
    };
}

const CREDIT_DEFINE = [
    {name: '信用度高', color: '#2D5EA1'},
    {name: '信用度中', color: '#3D8CB3'},
    {name: '信用度低', color: '#A0E7F9'}
];
const NMBIGDATA_URL_PREFIX = 'http://111.56.127.161:8080/nmbigdata';

module.exports = {
    env,
    basePath,
    user,
    ajaxUrlBase,
    mock: !isProduction,
    isProduction,
    geoCoordMapArray,
    geoCoordMap,
    CREDIT_DEFINE,
    NMBIGDATA_URL_PREFIX,
    themeColor: '#00CEC9'
};
