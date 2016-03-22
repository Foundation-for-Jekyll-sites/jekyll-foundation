var browserSync = require('browser-sync');
var config      = require('../util/loadConfig').browsersync;
var gulp        = require('gulp');

gulp.task('browser-sync', function() {
  browserSync.init({
    notify: config.notify,
    open: config.open,
    port: config.port,
    server: {
      baseDir: config.server.basedir
    },
    xip: config.xip
  });
});
