var browserSync   = require('browser-sync');
var config        = require('../util/loadConfig').jekyll;
var gulp          = require('gulp');
var isProduction  = require('../util/isProduction');
var spawn         = require('cross-spawn');

gulp.task('jekyll-build', function(done) {
  browserSync.notify(config.notification);
  // Spawn jekyll commands
  if (isProduction) {
    return spawn('bundle', ['exec', 'jekyll', 'build',
      '--config', '_config.yml,_config-production.yml'], {stdio: 'inherit'})
    .on('close', done);
  } else {
    return spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
    .on('close', done);
  }
});

gulp.task('jekyll-incremental', function(done) {
  browserSync.notify(config.notificationIncremental);
  // Spawn jekyll commands
  return spawn('bundle', ['exec', 'jekyll', 'build', '--incremental'], {stdio: 'inherit'})
  .on('close', done);
});
