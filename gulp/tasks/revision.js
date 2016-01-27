var collect       = require('gulp-rev-collector');
var config        = require('../util/loadConfig').revision;
var gulp          = require('gulp');
var rev           = require('gulp-rev');

// Revision asset files in the source dir and write a manifest file
gulp.task('revision', function() {
    return gulp.src(config.revision.src, {base: 'assets'})
      .pipe(rev())
      // write revised assets to _site dir
      .pipe(gulp.dest(config.revision.dest))
      .pipe(rev.manifest())
      // write manifest to jekyll root
      .pipe(gulp.dest(config.revision.manifest.dest));
});

// Replace links to assets in files (_site dir) from a manifest file
gulp.task('rev:collect', ['revision'], function() {
  return gulp.src(config.collect.src)
  .pipe(collect())
  .pipe(gulp.dest(config.collect.dest));
});
