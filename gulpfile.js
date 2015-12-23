// --------------------------------------------------
// Load Plugins
// --------------------------------------------------

var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    browserSync   = require('browser-sync'),
    notify        = require('gulp-notify'),
    rimraf        = require('rimraf'),
    sequence      = require('run-sequence'),
    spawn         = require('child_process').spawn,
    sass          = require('gulp-ruby-sass'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify');

// --------------------------------------------------
// General Config
// --------------------------------------------------

// Browsers to target when prefixing CSS.
var COMPATIBILITY = ['last 2 versions', 'ie >= 9'];

// File paths to various assets are defined here.
var PATHS = {
  pages: [
    '*.{md,html,yml,xml}',
    '{_data,_includes,_layouts,_pages,_posts}/**/*.{md,html,yml,xml}',
    '!_site/**/*.*',
    '!assets/**/*.*'
  ],
  javascript: [
    // jQuery
    'assets/vendor/jquery/dist/jquery.js',
    // Foundation for Sites
    'assets/vendor/foundation-sites/js/foundation.core.js', // all F6 components need this!
    // 'assets/vendor/foundation-sites/js/foundation.abide.js',
    // 'assets/vendor/foundation-sites/js/foundation.accordion.js',
    // 'assets/vendor/foundation-sites/js/foundation.accordionMenu.js',
    // 'assets/vendor/foundation-sites/js/foundation.drilldown.js',
    // 'assets/vendor/foundation-sites/js/foundation.dropdown.js',
    // 'assets/vendor/foundation-sites/js/foundation.dropdownMenu.js',
    // 'assets/vendor/foundation-sites/js/foundation.equalizer.js',
    // 'assets/vendor/foundation-sites/js/foundation.interchange.js',
    // 'assets/vendor/foundation-sites/js/foundation.magellan.js',
    // 'assets/vendor/foundation-sites/js/foundation.offcanvas.js',
    // 'assets/vendor/foundation-sites/js/foundation.orbit.js',
    // 'assets/vendor/foundation-sites/js/foundation.responsiveMenu.js',
    // 'assets/vendor/foundation-sites/js/foundation.responsiveToggle.js',
    // 'assets/vendor/foundation-sites/js/foundation.reveal.js',
    // 'assets/vendor/foundation-sites/js/foundation.slider.js',
    // 'assets/vendor/foundation-sites/js/foundation.sticky.js',
    // 'assets/vendor/foundation-sites/js/foundation.tabs.js',
    // 'assets/vendor/foundation-sites/js/foundation.toggler.js',
    // 'assets/vendor/foundation-sites/js/foundation.tooltip.js',
    // 'assets/vendor/foundation-sites/js/foundation.util.box.js',
    // 'assets/vendor/foundation-sites/js/foundation.util.keyboard.js',
    // 'assets/vendor/foundation-sites/js/foundation.util.mediaQuery.js',
    // 'assets/vendor/foundation-sites/js/foundation.util.motion.js',
    // 'assets/vendor/foundation-sites/js/foundation.util.nest.js',
    // 'assets/vendor/foundation-sites/js/foundation.util.timerAndImageLoader.js',
    // 'assets/vendor/foundation-sites/js/foundation.util.touch.js',
    // 'assets/vendor/foundation-sites/js/foundation.util.triggers.js',
    // Foundation for Sites dependencies
    // 'assets/vendor/what-input/what-input.js',
    // Additional vendor JavaScript for the site

    // Site's JavaScript
    'assets/js/app.js'
  ]
};

// --------------------------------------------------
// Custom Messages
// --------------------------------------------------

/**
 * Adding custom messages to output to the browserSync status
 */
var messages = {
  jekyll: '<span style="color: grey">Running:</span> jekyll',
  sass: '<span style="color: grey">Running:</span> sass',
  javascript: '<span style="color: grey">Running:</span> javascript'
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------

// Delete the "_site" folder
// This happens every time a build starts
gulp.task('clean', function(done) {
  rimraf('_site', done);
});


// --------------------------------------------------
// Sass
// --------------------------------------------------

/**
 * Compile Sass into CSS
 */
gulp.task('sass', function() {
  browserSync.notify(messages.sass);
  return sass('assets/scss/*.scss', {
      style: 'compressed',
      bundleExec: true
    })
    .on('error', function (err) {
      browserSync.notify(err);
    })
    .pipe(autoprefixer(COMPATIBILITY))
    // for live injecting
    .pipe(gulp.dest('_site/assets/css/'))
    // for future jekyll builds
    .pipe(gulp.dest('assets/css/'));
});

// --------------------------------------------------
// JavaScript
// --------------------------------------------------

/**
 * Concatenate and minify ALL the JavaScript files
 */

gulp.task('javascript', function() {
  browserSync.notify(messages.javascript);
  gulp.src(PATHS.javascript)
    .pipe(concat('all.js'))
    .pipe(uglify({ mangle: false }))
    // for live injecting
    .pipe(gulp.dest('_site/assets/js/'))
    // for future jekyll builds
    .pipe(gulp.dest('assets/js/'));
});

// --------------------------------------------------
// Jekyll
// --------------------------------------------------

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function(done) {
  browserSync.notify(messages.jekyll);
  // Spawn jekyll commands
  return spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
    .on('close', done);
});

// --------------------------------------------------
// Browser Sync
// --------------------------------------------------

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['jekyll-build'], function() {
  browserSync.init({
    server: {
      baseDir: '_site/'
    },
    xip: true,
    notify: true,
    open: false
  });
});

// --------------------------------------------------
// Build
// --------------------------------------------------

gulp.task('build', function(done) {
  sequence('clean', ['sass', 'javascript', 'jekyll-build'], done);
});

// --------------------------------------------------
// Watch
// --------------------------------------------------

/**
 * Watch files for changes, recompile/rebuild and
 * reload the browser
 */
gulp.task('watch', function() {
  gulp.watch(PATHS.pages, ['jekyll-build', browserSync.reload]);
  gulp.watch('assets/img/**/*', ['jekyll-build', browserSync.reload]);
  gulp.watch('assets/scss/**/*.scss', ['sass', browserSync.reload]);
  gulp.watch('assets/js/app.js', ['javascript', browserSync.reload]);
});

// --------------------------------------------------
// Default
// --------------------------------------------------

/**
 * Default task, running just `gulp` will build the site and
 * launch BrowserSync and watch files.
 */
gulp.task('default', ['build', 'browser-sync', 'watch']);
