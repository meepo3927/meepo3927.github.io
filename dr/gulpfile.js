// base, util
var gulp = require('gulp');
var concat = require('gulp-concat');
// less
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
// sass
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

/**
 * 构建目标文件
 * @type {String}
 */
var cssDistDir = 'css';

/**
 * less源文件目录
 * @type {String}
 */
var lessDir = 'less';

var prefixerConfig = {
	browsers: ["last 37 versions", "> 1%"],
	cascade: false
};

/**
 * 将less编译成css
 */
gulp.task('less', function () {
	gulp.src([lessDir + '/entry.less'])
		.pipe(plumber({} ,true, function (err) {
			console.log(err);
			this.emit('end');
		}))
		.pipe(less())
		.pipe(autoprefixer(prefixerConfig))
		.pipe(concat('less.min.css'))
		.pipe(gulp.dest(cssDistDir))
		.pipe(browserSync.reload({stream:true}));
});

/**
 * 监听less文件变化, 执行less任务
 */
gulp.task('watch-less', function () {
	gulp.watch([
		lessDir + '/**/*.less'
	], ['less']);
});

/**
 * scss
 */
var scssDir = 'scss';

gulp.task('scss', function () {
	gulp.src([scssDir + '/entry.scss'])
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer(prefixerConfig))
		.pipe(concat('scss.min.css'))
		.pipe(gulp.dest(cssDistDir))
		.pipe(browserSync.reload({stream:true}));
});

/**
 * 监听less文件变化, 执行less任务
 */
gulp.task('watch-scss', function () {
	gulp.watch([
		scssDir + '/**/*.scss'
	], ['scss']);
});

var JS_DIST_DIR = 'dist';
var JS_SRC_DIR = 'js';
gulp.task('watch-js', function () {
	var src = [
		JS_DIST_DIR + '/**/*.js'
		// JS_SRC_DIR + '/**/*.js',
		// JS_SRC_DIR + '/**/*.vue'
	];
	gulp.watch(src)
		.on('change', function () {
			browserSync.reload();
		});
});

gulp.task('browser-sync', function () {
	browserSync.init({
		port: 9527,
		ui: false,
		online: false,
		ghostMode: false,
		server: {
			baseDir: './'
		}
	});
});

gulp.task('watch', ['watch-less', 'watch-scss', 'watch-js']);

gulp.task('build', ['less', 'scss']);

gulp.task('default', ['build', 'browser-sync', 'watch']);