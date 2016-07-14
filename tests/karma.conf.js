module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['PhantomJS'],
    port: 9876,
    files: [
      '../bower_components/angular/angular.min.js',
      '../bower_components/angular-route/angular-route.min.js',
      '../bower_components/angular-animate/angular-animate.min.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      
      '../min/libs.min.js',
      
      '../../dntviewer/simplerreader.js',
      '../../dntviewer/dntreader.js',
      '../../dntviewer/dntranslations.js',
      
      '../app.js',
      
      '../min/app.min.js',
      // '../ui/**/*.js',
      // '../services/*.js',
      
      'spec-setup.js',
      'service-specs/**/*.js',
      'ui-specs/**/*.js'
    ]
  });
};