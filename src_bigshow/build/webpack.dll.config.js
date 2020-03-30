const webpack = require('webpack');
const path = require('path');
const config = require('./config.js');
const ExtractTextPlugin = require('mini-css-extract-plugin');
process.env.NODE_ENV = 'production';
//////////////// 打包文件
const vendors = [
    'jquery',
    'vue',
    'polyfill',
    'echarts',
    'lib/echarts-gl.min.js'
    // 'lodash'
];
const DIST_PATH = config.DIST_PATH + '/../bundle';
const plugins = [
    new webpack.DllPlugin({
        path: path.join(__dirname, 'dll-manifest.json'),
        name: '[name]',
        context: DIST_PATH
    }),
    new webpack.ProvidePlugin(config.provide),
    new ExtractTextPlugin({
        filename: 'vendor.css'
    })
];
const rules = [
    {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|echarts$|jquery$|lodash$)/
    },
    {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
            name: 'img/[name]_[hash:7].[ext]'
        }
    },
    {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
            name: 'fonts/[name].[hash:7].[ext]'
        }
    },
    {
        test: /vendor\.less$/,
        use: [
            ExtractTextPlugin.loader,
            'css-loader','postcss-loader','less-loader'
        ]
    }
];
module.exports = {
    mode: 'production',
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
        noParse: /(jquery|echarts|lodash)$/,
        rules: rules
    },
    resolve: {
        alias: config.alias
    }
};
