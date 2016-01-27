var config      = require('../util/loadConfig').clean;
var del         = require('del');
var gulp        = require('gulp');

gulp.task('clean', function(done) {
  del(config);
  done();
});
