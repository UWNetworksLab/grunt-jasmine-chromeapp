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
          outDir: '.build/self-test1/'
        }
      },
      selftest2: {
        files: [
          { cwd: 'test', src: ['selftest.js'] },
          { src: ['test/helper.js'], dest: 'test/helper.js' }
        ],
        scripts: ['selftest.js'],
        options: {
          outDir: '.build/self-test2/'
        }
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['jshint', 'jasmine_chromeapp']);

  grunt.registerTask('default', ['test']);
};
