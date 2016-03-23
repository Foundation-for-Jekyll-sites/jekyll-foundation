var browserSync   = require('browser-sync');
var config        = require('../util/loadConfig').jekyll;
var gulp          = require('gulp');
var isProduction  = require('../util/isProduction');
var spawn         = require('cross-spawn');

gulp.task('jekyll-build', function(done) {
  browserSync.notify(config.notification);
  // Spawn jekyll commands
  return spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
    .on('close', done);
});
