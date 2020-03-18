const glob = require('glob');
const path = require('path');
const config = require('./config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function getEntry(globPath) {
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        // pathname = path.join(dirname, basename);
        entries[basename] = entry;
    }
    return entries;
}
var getModuleConfig = function (env, command) {
    let rules = [];
    // JS loader
    let JSloader = {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
    };
    if (config.VERSION === 4) {
        JSloader.type = 'javascript/auto';
    }
    rules.push(JSloader);
    // 图片loader
    rules.push({
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
            name: 'img/[name]_[hash:7].[ext]'
        }
    });
    // 字体loader
    rules.push({
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
            name: 'fonts/[name].[hash:7].[ext]'
        }
    });
    // vue loader options
    var vueloaders = {};
    var extractPlugins = [];
    if (env === 'production') {
        if (command === 'build') {
            var myCSSExtract = new ExtractTextPlugin({
                filename: 'style.css',
                allChunks: true
            });
            vueloaders.css = myCSSExtract.extract([
                'vue-style-loader', 'css-loader', 'postcss-loader', 'less-loader'
            ]);
            extractPlugins.push(myCSSExtract);
            rules.push({
                test: /entry\.less$/,
                use: myCSSExtract.extract(['css-loader','postcss-loader','less-loader'])
            });
        } else if (command === 'dll') {
            var vendorCSSExtract = new ExtractTextPlugin({
                filename: 'vendor.css',
                allChunks: true
            });
            extractPlugins.push(vendorCSSExtract);
            rules.push({
                test: /vendor\.less$/,
                use: vendorCSSExtract.extract(['css-loader','postcss-loader','less-loader'])
            });
        }
    } else {
        rules.push({
            test: /vendor\.less$/,
            use: ['style-loader', 'css-loader','postcss-loader', 'less-loader']
        });
        rules.push({
            test: /entry\.less$/,
            use: ['style-loader', 'css-loader','postcss-loader', 'less-loader']
        });
    }
    // vue loader
    let vueloader = {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            loaders: vueloaders
        }
    };
    if (config.VERSION === 4) {
        vueloader.type = 'javascript/auto';
    }
    rules.push(vueloader);

    return {
        rules: rules,
        extractPlugins: extractPlugins
    };
};

module.exports = {
    getEntry,
    getModuleConfig
};