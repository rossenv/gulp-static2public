'use strict';

var gulp = require('gulp');

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('static_html/*.html')
    .pipe(wiredep({
      directory: 'bower_components',
      exclude: [],
      ignorePath: /^\/|\.\.\//
    }))
    .pipe(gulp.dest('static_html'));
});
