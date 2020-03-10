var webpack = require('webpack');
var util = require('./build/util');
var config = require('./build/config');
var Webpack2Polyfill = require("webpack2-polyfill-plugin");

const SERVER_PORT = config.SERVER_PORT;
const JS_DIR = config.JS_DIR;
const DIST_PATH = config.DIST_PATH;

module.exports = function (env) {
    let isProduction = (env === 'production');
    let moduleConfig = util.getModuleConfig(env, 'build');
    let r = {
        entry: util.getEntry(JS_DIR + '/entry/*.js'),
        output: {
            path: DIST_PATH,
            publicPath: isProduction ? config.productionPublicPath : config.developmentPublicPath,
            filename: '[name].js',
            chunkFilename: 'chunk.[name].[hash:8].js'
        },
        module: {
            rules: moduleConfig.rules
        },
        resolve: {
            alias: config.alias,
            extensions: ['.js', '.vue']
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'commons',
                minChunks: 2
            }),
            new webpack.ProvidePlugin(config.provide),
            new Webpack2Polyfill(),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: `"${env}"`
                }
            }),
            new webpack.DllReferencePlugin({
                context: DIST_PATH,
                manifest: require('./build/dll-manifest.json'),
                name: 'dll'
            })
        ],
        devServer: {
            port: SERVER_PORT,
            host: '0.0.0.0',
            historyApiFallback: true,
            noInfo: false,
            disableHostCheck: true,
            contentBase: config.SERVER_DIR,
            proxy: {
                "/api": "http://localhost:8333"
            }
        },
        devtool: '#cheap-module-source-map'
    }
    r.plugins = r.plugins.concat(moduleConfig.extractPlugins);
    if (isProduction) {
        r.devtool = false;
        // http://vue-loader.vuejs.org/en/workflow/production.html
        r.plugins = r.plugins.concat([
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: false,
                compress: {
                    warnings: false
                }
            }),
            new webpack.LoaderOptionsPlugin({
                minimize: true
            })
        ]);
    }
    return r;
};



