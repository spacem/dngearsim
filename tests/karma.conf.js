module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['PhantomJS'],
    port: 9876,
    files: [
      '../min/libs.min.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      
      '../min/dntviewer.min.js',
      
      '../app.js',
      '../ui/**/*.js',
      '../services/*.js',
      
      'spec-setup.js',
      'service-specs/**/*.js',
      'ui-specs/**/*.js'
    ]
  });
};