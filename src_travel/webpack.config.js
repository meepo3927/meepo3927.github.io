var webpack = require('webpack');
var util = require('./build/util');
var config = require('./build/config');
var Webpack2Polyfill = require("webpack2-polyfill-plugin");
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

const SERVER_PORT = config.SERVER_PORT;
const JS_DIR = config.JS_DIR;
const DIST_PATH = config.DIST_PATH;

module.exports = function (env) {
    process.env.NODE_ENV = env;
    let isProduction = (env === 'production');
    let moduleConfig = util.getModuleConfig(env, 'build');
    let r = {
        entry: util.getEntry(JS_DIR + '/entry/'),
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
                "/TD-common-web": "http://localhost:8080"
            }
        },
        devtool: '#cheap-module-source-map'
    }
    r.plugins = r.plugins.concat(moduleConfig.extractPlugins);
    if (isProduction) {
        r.devtool = false;
        // http://vue-loader.vuejs.org/en/workflow/production.html
        r.plugins.push(new ParallelUglifyPlugin({
            cacheDir: './jscached/',
            uglifyJS: {
                output: {
                    comments: false
                },
                compress: {
                    warnings: false
                }
            }
        }));
    }
    return r;
};



