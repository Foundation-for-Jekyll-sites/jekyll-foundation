var $             = require('gulp-load-plugins')();
var browserSync   = require('browser-sync');
var config        = require('../util/loadConfig').javascript;
var gulp          = require('gulp');
var isProduction  = require('../util/isProduction');
var uglify        = require('gulp-uglify');

gulp.task('javascript', function() {
  browserSync.notify(config.notification);

  return gulp.src(config.src)
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.concat(config.filename))
    .pipe($.if(isProduction, uglify({ mangle: false })))
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    // Write the file to source dir and build dir
    .pipe(gulp.dest(config.dest.jekyllRoot))
    .pipe(gulp.dest(config.dest.buildDir));
});
