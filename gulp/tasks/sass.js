var $             = require('gulp-load-plugins')();
var autoprefixer  = require('gulp-autoprefixer');
var browserSync   = require('browser-sync');
var config        = require('../util/loadConfig').sass;
var gulp          = require('gulp');
var isProduction  = require('../util/isProduction');
var sass          = require('gulp-sass');

gulp.task('sass', function() {
  browserSync.notify(config.notification);
  var minifycss = $.if(isProduction, $.cssnano());

  return gulp.src(config.src)
    .pipe($.sourcemaps.init())
    .pipe($.sass()
      .on('error', $.sass.logError))
    .pipe(autoprefixer(config.compatibility))
    .pipe(minifycss)
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    // for live injecting (for production builds we write the revised version)
    .pipe($.if(!isProduction, gulp.dest(config.dev.dest)))
    // for future jekyll builds
    .pipe(gulp.dest(config.dest))
    //auto-inject styles into browsers
    .pipe(browserSync.stream());
});
