var gulp = require('gulp');

gulp.task('default', function() {
    gulp.start('html');
    gulp.start('libs');
    gulp.start('dntviewer');
    gulp.start('js');
});

// html templates
var templateCache = require('gulp-angular-templatecache');
var htmlmin = require('gulp-htmlmin');

gulp.task('lib-css', function () {
  return gulp.src('bower_components/angular-material/angular-material.min.css')
    .pipe(gulp.dest('min'));
});

gulp.task('html', function () {
  return gulp.src('ui/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(templateCache({root: 'ui/', filename: 'templates.min.js'}))
    .pipe(gulp.dest('min'));
});


// js files
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('js', function() {
  return gulp.src(['ui/**/*.js', 'services/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('min'))
})


// libs
gulp.task('libs', ['lib-css'], function() {
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
    ])
    .pipe(uglify())
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest('min'))
})

gulp.task('dntviewer', function() {
  return gulp.src([
      '../dntviewer/simplerreader.js',
      '../dntviewer/dntreader.js',
      '../dntviewer/dntranslations.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('dntviewer.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('min'))
})


// test
var Karma = require('karma').Server;
gulp.task('test', ['libs','default'], function (done) {
  process.env.LC_ALL='C'; // prevent invalid language tag errors
  
  return new Karma({
    configFile: __dirname + '/tests/karma.conf.js',
    singleRun: true
  }, function() { done(); }).start();
});


// test coverage
var Karma = require('karma').Server;
gulp.task('cover', ['default'], function (done) {
  return new Karma({
    configFile: __dirname + '/tests/karma.cover.conf.js',
    singleRun: true
  }, done).start();
});

// test on change
gulp.task('tdd', function (done) {
  new Karma({
    configFile: __dirname + '/tests/karma.conf.js',
  }, done).start();
});

// watcher
gulp.task('watch', ['default'], function() {
  var watcher = gulp.watch(['services/**/*.js', 'ui/**/*.js', 'ui/**/*.html', 'tests/**/*.js'], ['html','js','dntviewer']);
  watcher.on('change', logChange);
})

function logChange(event) {
  console.log('*************************************************');
  console.log('*** ' + event.path + ' was ' + event.type + ' ***');
}

