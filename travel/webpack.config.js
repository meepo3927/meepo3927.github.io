var webpack = require('webpack');
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var Webpack2Polyfill = require("webpack2-polyfill-plugin");

var JS_DIR = __dirname + '/js';
var JS_ENTRY_DIR = JS_DIR + '/entry';
var DIST_DIR = __dirname + '/dist';

var printOption = {
	modules: false,
	assets: false,
	children: false,
	chunkModules: false,
	chunkOrigins: false,
	errors: true,
	errorDetails: true
};

var prefixerConfig = {
	browsers: ["last 37 versions", "> 1%"],
	cascade: false
};

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
	// entries.webpackServer = ['webpack-dev-server/client?http://localhost:8899', 'webpack/hot/only-dev-server'];
	return entries;
}

var babelConfig = {
	presets: [
		["es2015",{"modules": false}]
	]
};

var func = function (env) {
	/**
	 * 插件
	 * @type {Array}
	 */
	var plugins = [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'commons',
			minChunks: 2
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			// echarts: 'echarts',
			Vue: 'vue'
		}),
		new Webpack2Polyfill()
	];

	var alias = {
		// 目录
		lib: JS_DIR + '/lib',
		util: JS_DIR + '/util',
		comp: JS_DIR + '/comp',
		extend: JS_DIR + '/extend',
		global: JS_DIR + '/global',
		store: JS_DIR + '/store',
		mixins: JS_DIR + '/mixins',
		// 基础库
		jquery$: 'lib/jquery-2.1.1.min.js',
		vue$: 'lib/vue.min.js',
		vuex$: 'lib/vuex-2.3.1.js',
		// vue$: 'lib/vue.js',
		velocity$: 'lib/velocity.min.js',

		// 工具,插件
		Promise$: 'lib/promise.js',
		mlayer$: 'lib/mlayer.js',
		autoComplete$: 'extend/jquery.autocomplete.js',
		echarts$: 'lib/echarts.min.js',
		ztree$: 'lib/jquery.ztree.core.min.js',
		// 通用
		polyfill$: JS_DIR + '/common/polyfill',
		common$: JS_DIR + '/common.js'
	};

	/**
	 * 监听
	 * @type {Boolean}
	 */
	var watch = false;
	var watchOptions = {};

	var jsRule = {
		test: /\.js$/,
		exclude: /(node_modules)/,
		loader: 'babel-loader',
		options: babelConfig
	};
	var babelQuery = JSON.stringify(babelConfig);
	var vueRule = {
		test: /\.vue$/,
		loader: 'vue-loader',
		options: {
			loaders: {
				js: 'babel-loader?' + babelQuery
			},
			postcss: [require('autoprefixer')(prefixerConfig)]
		}
	};
	var rules = [vueRule, jsRule];

	if (env === 'product' || env === 'prod') {
		// 生产环境
		plugins.push(new webpack.optimize.UglifyJsPlugin({
			comments: false
		}));
		plugins.push(new CleanWebpackPlugin(['dist', 'build'], {
			root: __dirname,
			verbose: true
		}));
	} else {
		// 开发环境
		watch = true;
		watchOptions = {
			ignored: /^(node_modules|less|scss|dist|images|css)$/,
			poll: 800
		};
	}

	var devServer = {
		contentBase: '.',
		port: 8899,
		inline: true,
		hot: true,
		compress: true,
		publicPath: '/dist/'
	};

	return {
		entry: getEntry(JS_ENTRY_DIR + '/*.js'),
		output: {
			path: DIST_DIR,
			publicPath: '/TD-nmtravel-web/Static_Full_Version/2.0/dist/',
			filename: '[name].js',
			chunkFilename: 'chunk.[name].js'
		},
		module: {
			noParse: /^(jquery|vue)$/,
			rules: rules
		},
		plugins: plugins,
		resolve: {
			alias: alias
		},
		stats: printOption,
		watch: watch,
		watchOptions: watchOptions
	}
};

module.exports = func;