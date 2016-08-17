module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['PhantomJS'],
    port: 9876,
    files: [
      '../min/libs.min.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      
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