var $             = require('gulp-load-plugins')();
var browserSync   = require('browser-sync');
var config        = require('../util/loadConfig').javascript;
var gulp          = require('gulp');
var isProduction  = require('../util/isProduction');

gulp.task('javascript', function() {
  browserSync.notify(config.notification);
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(config.src)
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.concat(config.filename))
    .pipe($.if(isProduction, $.uglify({ mangle: false })))
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    .pipe(gulp.dest(config.dest.jekyllRoot))
    .pipe(gulp.dest(config.dest.buildDir));
});
