var webpack = require('webpack');
var path = require('path');
var config = require('./config');
var util = require('./util.js');

const vendors = [
    'jquery',
    'vue',
    'dll_less',
    'echarts',
    'bootstrap',
    'select2',
    'ztree',
    'mlayer',
    'velocity',
    'polyfill'
];
const env = 'production';
let DIST_PATH = config.DIST_PATH + '/../bundle';
var moduleConfig = util.getModuleConfig(env, 'dll');
var plugins = [
    new webpack.DllPlugin({
        path: path.join(__dirname, 'dll-manifest.json'),
        name: '[name]',
        context: DIST_PATH
    }),
    new webpack.ProvidePlugin(config.provide)
];
if (config.VERSION === 2) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        compress: {
            warnings: false
        }
    }));
}
plugins = plugins.concat(moduleConfig.extractPlugins);
let dllConfig = {
    output: {
        path: DIST_PATH,
        filename: '[name].js',
        library: '[name]'
    },
    entry: {
        dll: vendors
    },
    plugins: plugins,
    module: {
        rules: moduleConfig.rules
    },
    resolve: {
        alias: config.alias
    }
};
if (config.VERSION === 4) {
    dllConfig.mode = 'production';
}
module.exports = dllConfig;