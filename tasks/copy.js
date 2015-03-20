/*jslint node:true */

/**
 * @fileOverview A small copy library that uses grunt. With code from:
 *  https://github.com/gruntjs/grunt-contrib-copy/tasks/copy.js
 *  (https://github.com/gruntjs/grunt-contrib-copy/blob/master/LICENSE-MIT)
 * But with additional support for a relative destination directory, and turned
 * into a JS function instead of a grunt task.
 *
 * @author <a href="http://www.github.com/iislucas">iislucas</a>.
 */

/**
 * @function copyFiles
 * @summary Copies <tt>files</tt> to <tt>rootDest</tt>. See:
 * https://github.com/gruntjs/grunt-contrib-copy#usage-examples
 * for the files structure and options.
 * @type {Function}
 * @param {Object} files - grunt-contrib-copy style files section.
 * @param {string} rootDest - root of targets of each file's dest directory.
 * Default is current working directory.
 * @param {Object} options - grunt-contrib-copy style options.
 */
var copyFiles = module.exports = (function () {
  'use strict';

  var grunt = require('grunt'),
      chalk = require('chalk'),
      path = require('path'),
      fs = require('fs'),
      fileSyncCmp = require('file-sync-cmp');

  var setDefaultParams = function(obj, defaultParams) {
    for(var param in defaultParams) {
      if(defaultParams.hasOwnProperty(param) && !(param in obj)) {
        obj[param] = defaultParams[param];
      }
    }
  };

  var detectDestType = function(dest) {
    if (grunt.util._.endsWith(dest, '/')) { return 'directory';
    } else { return 'file'; }
  };

  var unixifyPath = function(filepath) {
    if (process.platform === 'win32') { return filepath.replace(/\\/g, '/');
    } else { return filepath; }
  };

  var syncTimestamp = function(src, dest) {
    var stat = fs.lstatSync(src);
    if (path.basename(src) !== path.basename(dest)) { return; }
    if (stat.isFile() && !fileSyncCmp.equalFiles(src, dest)) { return; }
    fs.utimesSync(dest, stat.atime, stat.mtime);
  };

  var copyFiles = function(files, rootDest, options) {
    if(!options) { options = {}; }
    setDefaultParams(options, {
      encoding: grunt.file.defaultEncoding,
      // processContent/processContentExclude deprecated renamed to
      // process/noProcess
      processContent: false,
      processContentExclude: [],
      timestamp: false,
      mode: false,
    });

    var copyOptions = {
      encoding: options.encoding,
      process: options.process || options.processContent,
      noProcess: options.noProcess || options.processContentExclude,
    };

    var dirs = {};
    var tally = {
      dirs: 0,
      files: 0,
    };

    files.forEach(function(filePair) {
      if (!filePair.dest) { filePair.dest = './'; }
      var dest = unixifyPath(path.join(rootDest, filePair.dest));
      var isExpandedPair = filePair.orig.expand || false;

      filePair.src.forEach(function(src) {
        var fullSrcPath = unixifyPath(
            filePair.cwd ? path.join(filePair.cwd, src) : src);
        if (detectDestType(dest) === 'directory') {
          dest = (isExpandedPair) ? dest : path.join(dest, src);
        }

        if (grunt.file.isDir(fullSrcPath)) {
          grunt.verbose.writeln('Creating ' + chalk.cyan(dest));
          grunt.file.mkdir(dest);
          if (options.mode !== false) {
            fs.chmodSync(dest, (options.mode === true) ?
                fs.lstatSync(fullSrcPath).mode : options.mode);
          }

          if (options.timestamp) {
            dirs[dest] = fullSrcPath;
          }

          tally.dirs++;
        } else {
          grunt.verbose.writeln('Copying ' + chalk.cyan(fullSrcPath) + ' -> ' +
              chalk.cyan(dest));
          grunt.file.copy(fullSrcPath, dest, copyOptions);
          syncTimestamp(fullSrcPath, dest);
          if (options.mode !== false) {
            fs.chmodSync(dest, (options.mode === true) ?
                fs.lstatSync(fullSrcPath).mode : options.mode);
          }
          tally.files++;
        }
      });
    });

    if (options.timestamp) {
      Object.keys(dirs).sort(function (a, b) {
        return b.length - a.length;
      }).forEach(function (dest) {
        syncTimestamp(dirs[dest], dest);
      });
    }

    if (tally.dirs) {
      grunt.log.write('Created ' + chalk.cyan(tally.dirs.toString()) +
          (tally.dirs === 1 ? ' directory' : ' directories'));
    }

    if (tally.files) {
      grunt.log.write((tally.dirs ? ', copied ' : 'Copied ') +
          chalk.cyan(tally.files.toString()) +
          (tally.files === 1 ? ' file' : ' files'));
    }

    grunt.log.writeln();
  };

  return copyFiles;
})();
