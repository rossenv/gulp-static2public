'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
  return browserSync.init(null, {
    open: true,
    server: {
      baseDir: "public"
    },
    watchOptions: {
      debounceDelay: 1000
    }
  });
});

gulp.task('watch', ['build', 'browser-sync'], function () {
	gulp.watch('static_html/scss/**/*.scss', ['styles']);
	gulp.watch('static_html/js/**/*.js', ['js']);
	gulp.watch('static_html/**/*.html', ['html']);
	gulp.watch('static_html/fonts/**/*', ['fonts']);
	gulp.watch('static_html/img/**/*', ['images']);
	gulp.watch('static_html/*.ico', ['misc']);
	gulp.watch('bower.json', ['wiredep']);
	return gulp.watch('public/**/**', function(file) {
		if (file.type === "changed") {
			return browserSync.reload(file.path);
		}
	});
});


