var browserSync   = require('browser-sync');
var config        = require('../util/loadConfig').jekyll;
var gulp          = require('gulp');
var isProduction  = require('../util/isProduction');
var spawn         = require('cross-spawn');

gulp.task('jekyll-build', function(done) {
  var processEnv = process.env;
  if (isProduction) {
    processEnv.JEKYLL_ENV = 'production';
  }

  browserSync.notify(config.notification);

  // Spawn jekyll commands
  return spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit', env:processEnv})
    .on('close', done);
});
