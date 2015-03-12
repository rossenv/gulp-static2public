'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var inject = require('gulp-inject'),
		data = require('gulp-data'),
		debug = require('gulp-debug');

var neat = require('node-neat').includePaths;
var bourbon = require('node-bourbon').includePaths


var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

function handleCSSError(err) {
    notify().write('\nERROR IN SASS ---------------\n'+err.message+'\n /ERROR ---------------');
    this.emit('end');
}

gulp.task('styles', ['wiredep'],  function () {
    return gulp.src('static_html/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'compressed',
            // includePaths: require('node-bourbon').includePaths
            includePaths: bourbon.concat(neat)
        }))
        .on('error', handleCSSError)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
        .pipe($.size());
});

gulp.task('js', function () {
    return gulp.src('static_html/js/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe(gulp.dest('public/js'))
        .pipe($.size());
});

gulp.task('partials', function () {
  return gulp.src('static_html/partials/**/*.html')
    .pipe(gulp.dest('public/partials'))
    .pipe($.size());
});

gulp.task('html', function () {
    var assets;
    return gulp.src('static_html/*.html')
        .pipe(assets = $.useref.assets())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest('public'))
        .pipe($.size());
});

gulp.task('clear-cache', function (done) {
        return $.cache.clearAll(done);
});

gulp.task('images', function () {
    return gulp.src('static_html/img/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('public/img'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return gulp.src('static_html/fonts/*.{eot,svg,ttf,woff}')
        .pipe(gulp.dest('public/css/fonts'))
        .pipe($.size());
});

gulp.task('misc', function () {
    return gulp.src(['static_html/**/*.{ico,json}'])
        .pipe(gulp.dest('public'))
        .pipe($.size());
});


gulp.task('clean', function (done) {
    $.del('public', done);
});

gulp.task('update-readme', function () {
	return gulp.src('./readme.md')
	.pipe(inject(
		gulp.src(['./bower.json'], {read: true}), {
			starttag: '### Bower Dependencies',
			endtag: '### Installing & running',
			transform: function (filepath, file, i, length) {
				var dep = JSON.parse(String(file.contents)).dependencies,
					devDep = JSON.parse(String(file.contents)).devDependencies,
					strDep = '';

				if (undefined != dep) {
					for (var prop in dep) {
						strDep += prop + ': ' + dep[prop] + '\n';
					}
				}

				if (undefined != devDep) {
					for (var prop in devDep) {
						strDep += prop + ': ' + devDep[prop] + '\n';
					}
				}

				return strDep;
			}
		}
	))
	.pipe(gulp.dest('./'))
	.pipe($.size());
});

gulp.task('build', ['styles', 'js', 'html', 'partials', 'images', 'fonts', 'misc', 'update-readme']);
