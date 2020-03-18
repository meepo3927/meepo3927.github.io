const webpack = require('webpack');
const config = require('./config.js');
const util = require('./util.js');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

const SERVER_PORT = config.SERVER_PORT;
const JS_DIR = config.JS_DIR;
const DIST_PATH = config.DIST_PATH;

let rules = [
    {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)|(lib\/)/,
        options: {
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
        use: ['vue-style-loader', 'css-loader','postcss-loader', 'less-loader']
    },
    {
        test: /\.less$/,
        use: ['vue-style-loader', 'css-loader','postcss-loader', 'less-loader']
    },
    {
        test: /\.vue$/,
        loader: 'vue-loader'
    }
];
module.exports = {
    mode: 'development',
    entry: util.getEntry(JS_DIR + '/entry/'),
    output: {
        path: DIST_PATH,
        publicPath: config.developmentPublicPath,
        filename: '[name].js',
        chunkFilename: 'chunk.[name].js'
    },
    module: {
        noParse: /(jquery|echarts)$/,
        rules: rules
    },
    resolve: {
        alias: config.alias,
        extensions: ['.js', '.vue']
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
    plugins: [
        new webpack.ProvidePlugin(config.provide),
        new webpack.DllReferencePlugin({
            context: DIST_PATH,
            manifest: require('./dll-manifest.json'),
            name: 'dll'
        }),
        new VueLoaderPlugin()
    ],
    devServer: {
        port: SERVER_PORT,
        host: '0.0.0.0',
        historyApiFallback: true,
        noInfo: false,
        disableHostCheck: true,
        contentBase: config.SERVER_DIR,
        proxy: {
            '/TD-common-web': 'http://localhost:8080'
        }
    },
    devtool: '#cheap-module-source-map'
};