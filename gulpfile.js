// --------------------------------------------------
// Load Plugins
// --------------------------------------------------

var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    browserSync   = require('browser-sync'),
    notify        = require('gulp-notify'),
    spawn         = require('child_process').spawn,
    sass          = require('gulp-ruby-sass'),
    concat        = require('gulp-concat'),
    minify        = require('gulp-minify');

// --------------------------------------------------
// General Config
// --------------------------------------------------

var config = {
  // the jekyll site destination
  docRoot: '_site/',
  // main scss files that import partials
  scssSrc: 'assets/scss/*.scss',
  // all scss files in the scss directory
  allScss: 'assets/scss/**/*.scss',
  // the destination directory for our css
  cssDest: 'assets/css/',
  // all js files the js directory
  allJs: 'assets/js/**/*.js',
  // vendor directory
  vendorSrc: 'assets/vendor/'
};

// --------------------------------------------------
// Custom Messages
// --------------------------------------------------

/**
 * Adding custom messages to output to the browserSync status
 */
var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> jekyll build',
  sassBuild: '<span style="color: grey">Running:</span> sass'
};

// --------------------------------------------------
// Jekyll
// --------------------------------------------------

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function(done) {
  browserSync.notify(messages.jekyllBuild);
  // Spawn jekyll commands
  return spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
    .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  browserSync.reload();
});

// --------------------------------------------------
// Browser Sync
// --------------------------------------------------

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync.init({
    server: {
      baseDir: config.docRoot
    },
    xip: true,
    notify: true,
    open: false
  });
});

// --------------------------------------------------
// Sass
// --------------------------------------------------

/**
 * Compile scss files from into both:
 *   _site/assets/css (for live injecting)
 *   assets/css (for future jekyll builds)
 */
gulp.task('sass', function() {
  browserSync.notify(messages.sassBuild);
  return sass(config.scssSrc, {
      style: 'compressed',
      bundleExec: true
    })
    .on('error', function (err) {
      browserSync.notify(err);
    })
    .pipe(autoprefixer(
      'last 2 versions',
      'ie >= 9',
      'and_chr >= 2.3'
    ))
    // for live injecting
    .pipe(gulp.dest(config.docRoot + config.cssDest))
    .pipe(browserSync.reload({stream: true}))
    // for future jekyll builds
    .pipe(gulp.dest(config.cssDest));
});

// --------------------------------------------------
// Watch
// --------------------------------------------------

/**
 * Watch scss files for changes & recompile
 * Watch html, md, and js files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function() {
  gulp.watch(config.allScss, ['sass']);
  gulp.watch(['**/*.{md,html}',
              '_data/**/*.yml',
              'assets/img/**/*',
              'assets/js/all.js',
              'gulpfile.js',
              '!assets/css/**/*,',
              '!_site/**/*'
             ], ['jekyll-rebuild']);
});

// --------------------------------------------------
// JavaScript
// --------------------------------------------------
gulp.task('js', function() {
  gulp.src([
            //jQuery
            config.vendorSrc + 'jquery/dist/jquery.min.js',
            /*
            / Foundation for Sites plugins
            / all require foundation.core.js, don't comment this out!
            */
            config.vendorSrc + 'foundation-sites/js/foundation.core.js',
            /*
            / Check util-map.json for plugin dependencies (assets/vendor/foundation-sites/js/)
            */
            // config.vendorSrc + 'foundation-sites/js/foundation.abide.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.accordion.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.accordionMenu.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.drilldown.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.dropdown.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.dropdownMenu.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.equalizer.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.interchange.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.magellan.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.offcanvas.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.orbit.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.responsiveMenu.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.responsiveToggle.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.reveal.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.slider.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.sticky.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.tabs.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.toggler.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.tooltip.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.util.box.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.util.keyboard.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.util.mediaQuery.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.util.motion.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.util.nest.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.util.timerAndImageLoader.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.util.touch.js',
            // config.vendorSrc + 'foundation-sites/js/foundation.util.triggers.js',
            /*
            /  App's js file
            */
            'assets/js/app.js'
          ])
    .pipe(concat('all.js'))           //outputs all.js
    .pipe(minify())                   //outputs all-min.js
    .pipe(gulp.dest('assets/js/'))
});

// --------------------------------------------------
// Default
// --------------------------------------------------

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['js', 'browser-sync', 'watch']);
