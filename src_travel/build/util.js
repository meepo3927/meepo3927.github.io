const fs = require('fs');
const path = require('path');
const config = require('./config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function getEntry(dirPath) {
    var files = fs.readdirSync(dirPath);
    var entries = {};
    for (var i = 0; i < files.length; i++) {
        let fileName = files[i];
        let extname = path.extname(fileName);
        let basename = path.basename(fileName, extname);
        // Full Path
        entries[basename] = dirPath + fileName;
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