var gulp = require('gulp');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var remember = require('gulp-remember');
var cached = require('gulp-cached');
var babel   = require('gulp-babel');
var ngAnnotate = require('gulp-ng-annotate');
var historyApiFallback = require('connect-history-api-fallback');

var onError = function (err) {
  console.log(err);
  console.log('  ----------------------------------------------------------------------');
  console.log('\x1b[36m%s\x1b[0m', err);
  console.log('  ----------------------------------------------------------------------');
  process.stdout.write('\x07');
};

gulp.task('default', ['build', 'watch', 'test'], function() {
  return gulp.start('browser-sync');
});

gulp.task('build', ['html', 'libs', 'dntviewer', 'js']);

// html templates
var templateCache = require('gulp-angular-templatecache');
var htmlmin = require('gulp-htmlmin');

gulp.task('html', function () {
  return gulp.src('ui/**/*.html')
    .pipe(plumber(onError))
    .pipe(cached('dngearsim html'))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(templateCache({root: 'ui/', filename: 'templates.min.js'}))
    .pipe(remember('dngearsim html')) 
    .pipe(gulp.dest('min'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: '../',
            middleware: [
              historyApiFallback({ index: '/dngearsim/index/index.html' })
            ]
        },
        open: false,
        port: 8080,
        injectChanges: false,
    });
});

// js files
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('js', function() {
  return gulp.src(['ui/**/*.js', 'services/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(plumber(onError))
    .pipe(cached('dngearsim js'))
    .pipe(ngAnnotate())
    .pipe(babel({
       presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(remember('dngearsim js')) 
    .pipe(concat('app.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('min'))
})

// libs
gulp.task('libs', function() {
  return gulp.src([
      'bower_components/lz-string/libs/lz-string.min.js',
      'bower_components/angular/angular.min.js',
      'bower_components/angular-route/angular-route.min.js',
      'bower_components/angular-animate/angular-animate.min.js',
      'bower_components/angular-aria/angular-aria.min.js',
      'bower_components/angulartics/dist/angulartics.min.js',
      'bower_components/angulartics-google-analytics/dist/angulartics-ga.min.js',
      'bower_components/firebase/firebase.js',
      'bower_components/underscore/underscore-min.js',
      'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
      'bower_components/file-saver/FileSaver.min.js'
    ])
    .pipe(uglify())
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest('min'))
})

gulp.task('dntviewer', function() {
  return gulp.src([
      'bower_components/dntviewer/simplerreader.js',
      'bower_components/dntviewer/dntreader.js',
      'bower_components/dntviewer/dntranslations.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(babel({
       presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(concat('dntviewer.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('min'))
})


// test
var Karma = require('karma').Server;
gulp.task('test', ['build'], function (done) {
  process.env.LC_ALL='C'; // prevent invalid language tag errors
  
  return new Karma({
    configFile: __dirname + '/tests/karma.conf.js',
    singleRun: true
  }, done).start();
});


// test coverage
var Karma = require('karma').Server;
gulp.task('cover', ['html', 'libs', 'dntviewer', 'js'], function (done) {
  return new Karma({
    configFile: __dirname + '/tests/karma.cover.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('reload-js', ['js'], function(done) {
  browserSync.reload();

  return new Karma({
    configFile: __dirname + '/tests/karma.conf.js',
    singleRun: true
  }, done).start();
});
gulp.task('reload-html', ['html'], function() {
  browserSync.reload();
});

// watcher
gulp.task('watch', function() {
  var watcher = gulp.watch(['services/**/*.js', 'ui/**/*.js', 'tests/**/*.js', 'app.js'], ['reload-js']);
  watcher.on('change', logChange);

  watcher = gulp.watch(['index/index.html', 'ui/**/*.html'], ['reload-html']);
  watcher.on('change', logChange);
})

function logChange(event) {
  console.log('*************************************************');
  console.log('*** ' + event.path + ' was ' + event.type + ' ***');
}

