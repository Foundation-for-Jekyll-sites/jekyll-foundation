var browserSync = require('browser-sync');
var config      = require('../util/loadConfig').watch;
var gulp        = require('gulp');

// Watch files for changes, recompile/rebuild and reload the browser
gulp.task('watch', function() {
  gulp.watch(config.pages, ['jekyll-incremental', browserSync.reload]);
  gulp.watch(config.images, ['jekyll-incremental', browserSync.reload]);
  gulp.watch(config.javascript, ['javascript', browserSync.reload]);
  //no browser reload needed here, browserSync injects the stylesheet into browsers
  gulp.watch(config.sass, ['sass']);
});
