// --------------------------------------------------
// Load Plugins
// --------------------------------------------------

var $             = require('gulp-load-plugins')();
var argv          = require('yargs').argv;
var autoprefixer  = require('gulp-autoprefixer');
var browserSync   = require('browser-sync');
var collect       = require('gulp-rev-collector');
var gulp          = require('gulp');
var notify        = require('gulp-notify');
var rev           = require('gulp-rev');
var rimraf        = require('rimraf');
var sequence      = require('run-sequence');
var sass          = require('gulp-sass');
var spawn         = require('child_process').spawn;

// --------------------------------------------------
// General Config
// --------------------------------------------------

// Check for --production flag
var isProduction = !!(argv.production);

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
  ],
  assets: [
    'assets/css/app.css',
    'assets/js/all.js',
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
  jekyllincremental: '<span style="color: grey">Running:</span> jekyll incremental',
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
  var minifycss = $.if(isProduction, $.minifyCss());

  return gulp.src('assets/scss/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass()
      .on('error', $.sass.logError))
    .pipe(autoprefixer(COMPATIBILITY))
    .pipe(minifycss)
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    // for live injecting, for production builds we write the revised version
    .pipe($.if(!isProduction, gulp.dest('_site/assets/css/')))
    // for future jekyll builds
    .pipe(gulp.dest('assets/css/'))
    //auto-inject styles into browsers
    .pipe(browserSync.stream());
});

// --------------------------------------------------
// JavaScript
// --------------------------------------------------

/**
 * Concatenate and minify ALL the JavaScript files
 */

gulp.task('javascript', function() {
  browserSync.notify(messages.javascript);
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(PATHS.javascript)
    .pipe($.sourcemaps.init())
    .pipe($.concat('all.js'))
    .pipe($.if(isProduction, $.uglify({ mangle: false })))
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    // for live injecting, for production builds we write the revised version
    .pipe($.if(!isProduction, gulp.dest('_site/assets/js/')))
    // for future jekyll builds
    .pipe(gulp.dest('assets/js/'));
});

// --------------------------------------------------
// Jekyll
// --------------------------------------------------

/**
 * Build the Jekyll Site (full site builds)
 */
gulp.task('jekyll-build', function(done) {
  browserSync.notify(messages.jekyll);
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

/**
 * Incremental jekyll build
 */
gulp.task('jekyll-incremental', function(done) {
  browserSync.notify(messages.jekyllincremental);
  // Spawn jekyll commands
  return spawn('bundle', ['exec', 'jekyll', 'build', '--incremental'], {stdio: 'inherit'})
  .on('close', done);
});

// --------------------------------------------------
// Browser Sync
// --------------------------------------------------

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', function() {
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
// Revisioning
// --------------------------------------------------

/**
 * Revision all asset files and
 * write a manifest file
 */

gulp.task('revision', function() {
    return gulp.src(PATHS.assets, {base: 'assets'})
      .pipe(rev())
      // write revised assets to build dir
      .pipe(gulp.dest('_site/assets'))
      .pipe(rev.manifest())
      // write manifest to jekyll root
      .pipe(gulp.dest('./'));
});


/**
 * Replace all links to assets in files
 * from a manifest file
 */
gulp.task('rev:collect', ['revision'], function() {
  return gulp.src(['./rev-manifest.json',
    '_site/*.{html,xml,txt,json,css,js}',
    '_site/**/*.{html,xml,txt,json,css,js}',
    '!_site/assets/vendor'])
  .pipe(collect())
  .pipe(gulp.dest('_site'));
});


// --------------------------------------------------
// Build
// --------------------------------------------------

gulp.task('build', function(done) {
  if(isProduction) {
    sequence('clean', ['sass', 'javascript'], 'jekyll-build', 'rev:collect', done);
  } else {
    sequence('clean', ['sass', 'javascript'], 'jekyll-build', done);
  }
});

// --------------------------------------------------
// Watch
// --------------------------------------------------

/**
 * Watch files for changes, recompile/rebuild and
 * reload the browser
 */
gulp.task('watch', function() {
  gulp.watch(PATHS.pages, ['jekyll-incremental', browserSync.reload]);
  gulp.watch('assets/img/**/*', ['jekyll-build', browserSync.reload]);
  //no browser reload needed here, browserSync injects the stylesheet into browsers
  gulp.watch('assets/scss/**/*.scss', ['sass']);
  gulp.watch('assets/js/app.js', ['javascript', browserSync.reload]);
});

// --------------------------------------------------
// Default
// --------------------------------------------------

/**
 * Default task, running just `gulp` will build the site and
 * launch BrowserSync and watch files.
 */
gulp.task('default', function(done) {
  sequence('build', 'browser-sync', 'watch', done);
});
