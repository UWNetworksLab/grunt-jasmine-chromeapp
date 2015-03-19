# grunt-jasmine-chromeapp

> Run jasmine specs in a Chrome Packaged App

[![Build Status](https://api.shippable.com/projects/54d3c81a5ab6cc13528afac2/badge?branchName=master)](https://app.shippable.com/projects/54d3c81a5ab6cc13528afac2/builds/latest)

## Getting Started

This plugin requires Grunt ```~0.4.0```

If you haven't used Grunt before, be sure to check out the Getting Started guide, which explains how to create your grunt file.
Once you're familiar with the process, this plugin can be installed as:

```shell
npm install grunt-jasmine-chromeapp --save-dev
```

Once the plugin has been installed, it may be enabled with this line of JavaScript:
```javascript
grunt.loadNpmTasks('grunt-jasmine-chromeapp');
```

## The Jasmine ChromeApp Task

Run this task with the ```grunt jasmine_chromeapp``` command.

This automatically builds and maintains the spec runner and reports results back to the grunt console.
Starts chrome with a dynamically created packaged application which runs jasmine specs. The package
reports results back to a web server run by the plugin, which then reports back to the console.
This structure is chosen becasue selenium is unable to debug or instrument packaged applications
directly.

### Example specification of the jasmine-chromeapp task

An example `jasmine_chromeapp` task defined in your Gruntfiles.js
```
  jasmine_chromeapp:
    tcp:
      # Files that are copied into the Chrome App 'files' subdirectory.
      files: [
        {
          cwd: 'build/integration-tests/tcp/',
          src: ['**/*', '!jasmine_chromeapp/**/*'],
          dest: './',  # Relative to |options.outdir| specified below
          expand: true
        }
      ],
      # Script tags that are added to the HTML in the chrome app's main.html
      scripts: [
        'freedom-for-chrome/freedom-for-chrome.js',
        'tcp.core-env.spec.static.js'
      ],
      # Optional settings for the output path, and to keep the spec runner
      # alive after tests complete, which can be useful for debugging.
      options: {
        outdir: 'build/integration-tests/tcp/jasmine_chromeapp/',
        keepRunner: true
      }
```

## Customize your SpecRunner

Use your own files in the app to customize your tests.

### Options

#### files

Type: `{ cwd :string; src :string[]; dest :string; expand :boolean}[]`

This specifies the files copied into the ChromeApp that is used to run the jasmine tests. It has the same parameters as the [grunt-contrib-copy](https://github.com/gruntjs/grunt-contrib-copy) task.

Files of the form `cwd/src/*` get copied to `dest/files/src/*` if `expand` is true. If expand is false, they get copied to `dest/*`.

#### scripts

Type: `string[]`

This specifies the additional paths for `<script ... >` tags which get added to the `main.html`. This should include your JS spec files. The ordering of the script tags in the HTML follows the ordering specified in this parameter.

#### options.outDir
Type: `string`
Default: `.build`

The directory to stage the chrome app into. To debug bad paths, it is useful to have the `keepRunner` option set to true, and then explore path structure in `outDir`.

#### options.keepRunner
Type: `Boolean`
Default: `false`

Prevents the auto-generated app from being automatically deleted, and leave the browser open.

#### options.binary
Type: `String`
Default: `undefined`

Specify the locations of `google-chrome` to run for testing. Defaults to the [per-platform
default locations](https://code.google.com/p/selenium/wiki/ChromeDriver) specified by
chromedriver if not specified.

#### options.flags
Type: `Array`
Default: `[]`

Additional command-line flags to pass to chrome. These are appended to the default flags
used for instantiation: `--no-first-run`, `--force-app-mode`, `--apps-keep-chrome-alive-in-tests`,
`--load-and-launch-app`, and `--user-data-dir`.
`--no-startup-window` is also used for the Mac platform.

#### options.timeout
Type: `Number`
Default: `30000`

How many milliseconds to wait for the browser to start up before failing.
