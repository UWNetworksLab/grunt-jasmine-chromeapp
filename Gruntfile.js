/*jslint node:true*/

module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jasmine_chromeapp: {
      selftest: {
        files: [ { src: ['test/*.js'] } ],
        scripts: ['test/selftest.js'],
        options: {
          // paths: 'test/selftest.js'
        }
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['jshint', 'jasmine_chromeapp']);

  grunt.registerTask('default', ['test']);
};
