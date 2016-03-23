var $             = require('gulp-load-plugins')();
var browserSync   = require('browser-sync');
var config        = require('../util/loadConfig').copy;
var gulp          = require('gulp');
var isProduction  = require('../util/isProduction');

gulp.task('copy', function() {
  browserSync.notify(config.notification);
  return gulp.src(config.assets)
    // Write to build dir only for development builds
    // For production builds the revision task writes the assets into the build dir
    .pipe($.if(!isProduction, gulp.dest(config.dist)));
});
