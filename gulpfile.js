var gulp = require('gulp');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var historyApiFallback = require('connect-history-api-fallback');

var onError = function (err) {
  console.log(err);
  console.log('  ----------------------------------------------------------------------');
  console.log('\x1b[36m%s\x1b[0m', err);
  console.log('  ----------------------------------------------------------------------');
  process.stdout.write('\x07');
};

gulp.task('default', ['test'], function() {
  return gulp.start('browser-sync');
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

function logChange(event) {
  console.log('*************************************************');
  console.log('*** ' + event.path + ' was ' + event.type + ' ***');
}

