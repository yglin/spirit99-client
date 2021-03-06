// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-07-11 using
// generator-karma 1.0.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine"
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-audio/app/angular.audio.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/lodash/lodash.js',
      'bower_components/angular-datepicker/dist/angular-datepicker.js',
      'bower_components/FroalaWysiwygEditor/js/froala_editor.min.js',
      'bower_components/FroalaWysiwygEditor/js/plugins/block_styles.min.js',
      'bower_components/FroalaWysiwygEditor/js/plugins/char_counter.min.js',
      'bower_components/FroalaWysiwygEditor/js/plugins/colors.min.js',
      'bower_components/FroalaWysiwygEditor/js/plugins/entities.min.js',
      'bower_components/FroalaWysiwygEditor/js/plugins/file_upload.min.js',
      'bower_components/FroalaWysiwygEditor/js/plugins/font_family.min.js',
      'bower_components/FroalaWysiwygEditor/js/plugins/font_size.min.js',
      'bower_components/FroalaWysiwygEditor/js/plugins/fullscreen.min.js',
      'bower_components/FroalaWysiwygEditor/js/plugins/inline_styles.min.js',
      'bower_components/FroalaWysiwygEditor/js/plugins/lists.min.js',
      'bower_components/FroalaWysiwygEditor/js/plugins/media_manager.min.js',
      'bower_components/FroalaWysiwygEditor/js/plugins/tables.min.js',
      'bower_components/FroalaWysiwygEditor/js/plugins/urls.min.js',
      'bower_components/FroalaWysiwygEditor/js/plugins/video.min.js',
      'bower_components/angular-froala/src/angular-froala.js',
      'bower_components/angular-google-maps/dist/angular-google-maps.js',
      'bower_components/angular-material/angular-material.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/angular-promise-extras/angular-promise-extras.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-scroll/angular-scroll.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-truncate-2/src/truncate.js',
      'bower_components/angular.validators/angular.validators.js',
      'bower_components/ngFitText/src/ng-FitText.js',
      'bower_components/ngstorage/ngStorage.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      "app/scripts/**/*.js",
      "test/mock/**/*.js",
      "test/spec/**/*.js"
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      "PhantomJS"
    ],

    // Which plugins to enable
    plugins: [
      "karma-phantomjs-launcher",
      "karma-jasmine"
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
