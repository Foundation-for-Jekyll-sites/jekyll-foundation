var browserSync   = require('browser-sync');
var config        = require('../util/loadConfig').copy;
var gulp          = require('gulp');

gulp.task('copy', function() {
  browserSync.notify(config.notification);
  return gulp.src(config.assets)
    .pipe(gulp.dest(config.dist));
});
