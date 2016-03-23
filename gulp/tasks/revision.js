var collect       = require('gulp-rev-collector');
var config        = require('../util/loadConfig').revision;
var gulp          = require('gulp');
var rev           = require('gulp-rev');

// Revision asset files in the source dir and write the rev-manifest.json
gulp.task('revision', function() {
    return gulp.src(config.revision.src, {base: 'assets'})
      .pipe(rev())
      // Write revised assets into the build dir
      .pipe(gulp.dest(config.revision.dest))
      .pipe(rev.manifest())
      // Write rev-manifest.json to jekyll root
      .pipe(gulp.dest(config.revision.manifest.dest));
});

// Replace links to assets in files (build dir) from the rev-manifest.json
gulp.task('rev:collect', ['revision'], function() {
  return gulp.src(config.collect.src)
  .pipe(collect())
  .pipe(gulp.dest(config.collect.dest));
});
