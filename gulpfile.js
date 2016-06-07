var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var htmlmin = require('gulp-htmlmin');

gulp.task('default', function() {
    gulp.start('html');
});

gulp.task('html', function () {
  return gulp.src('ui/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(templateCache({root: 'ui/'}))
    .pipe(gulp.dest('ui'));
});
