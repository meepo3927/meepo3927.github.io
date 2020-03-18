const webpack = require('webpack');
const path = require('path');
const config = require('./config.js');
const util = require('./util.js');
const ExtractTextPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

process.env.NODE_ENV = 'production';

const plugins = [
    new webpack.ProvidePlugin(config.provide),
    new webpack.DllReferencePlugin({
        context: config.DIST_PATH,
        manifest: require('./dll-manifest.json'),
        name: 'dll'
    }),
    new VueLoaderPlugin(),
    new ExtractTextPlugin({
        filename: 'style.css',
        chunkFilename: "chunk.style.css"
    })
];
const rules = [
    {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)|(lib\/)/,
        options: {
            cacheDirectory: true,
            plugins: [
                "babel-plugin-syntax-dynamic-import",
                "babel-plugin-transform-runtime",
                ["babel-plugin-transform-es2015-modules-commonjs", {
                    loose: true
                }]
            ],
            presets: [["env", {
              "modules": false,
              "targets": {
                "browsers": ["> 1%", "last 100 versions"]
              }
            }]]
        }
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
        test: /entry\.scss$/,
        use: [
            ExtractTextPlugin.loader,
            'css-loader','postcss-loader','less-loader'
        ]
    },
    {
        test: /\.less$/,
        use: [
            'vue-style-loader', 'css-loader', 'postcss-loader', 'less-loader'
        ]
    },
    {
        test: /\.vue$/,
        loader: 'vue-loader'
    }
];
module.exports = {
    mode: 'production',
    entry: util.getEntry(config.JS_DIR + '/entry/'),
    output: {
        path: config.DIST_PATH,
        publicPath: config.productionPublicPath,
        filename: '[name].js',
        chunkFilename: 'chunk.[name]_[chunkhash:8].js'
    },
    plugins: plugins,
    module: {
        noParse: /(jquery|echarts)$/,
        rules: rules
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: {
                    chunks: 'async',
                    minChunks: 1,
                    name: true
                },
                commons: {
                    name: "commons",
                    filename: 'commons.js',
                    chunks: "initial",
                    minChunks: 1
                }
            }
        }
    },
    resolve: {
        alias: config.alias,
        extensions: ['.js', '.vue']
    },
    performance: {
        hints: false
    },
    devtool: false
};
