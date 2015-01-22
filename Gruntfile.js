var fs = require('vinyl-fs'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    html2Js = require('gulp-ng-html2js'),
    streamqueue = require('streamqueue'),
    concat = require('gulp-concat')
    minifyHtml = require('gulp-minify-html'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    merge = require('merge-stream'),
    cssmin = require('gulp-cssmin'),
    child = require('child_process'),
    todo = require('gulp-todo'),
    jsdoc = require('gulp-jsdoc');

var config = require('./config/sources');
var childProcesses = {};
var reload;

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      main: {
        files: ['./public/index.html'],
        tasks: ['copy:main'],
        options: {
          livereload: true,
        }
      },
      scripts: {
        files: ['./public/**/*.js'],
        tasks: ['build:scripts'],
        options: {
          livereload: true,
        }
      },
      templates: {
        files: ['./public/**/*.tpl.html'],
        tasks: ['build:templates'],
        options: {
          livereload: true,
        }
      },
      styles: {
        files: ['./public/**/*.sass', './public/**/*.scss', './public/**/*.less'],
        tasks: ['build:styles'],
        options: {
          livereload: true,
        }
      },
      vendor: {
        files: ['./config/sources.js'],
        tasks: ['build:vendor'],
        options: {
          livereload: true,
        }
      },
      assets: {
        files: ['./public/assets/**/*'],
        tasks: ['copy:assets'],
        options: {
          livereload: true,
        }
      }
    },

    copy: {
      main: {
        cwd: './public',
        src: './index.html',
        dest: './dist',
        expand: true
      },
      assets: {
        src: ['./**/*'],
        dest: './dist/',
        cwd: './public/assets',
        expand: true
      }
    },

    clean: ['./dist/**/*']
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('reload', function () {
    reload.write('reload');
  });

  grunt.registerTask('build', function () {
    if (grunt.option('target') === 'prod') {
      grunt.task.run('clean');
    }

    grunt.task.run('copy');

    grunt.task.run('build:vendor');
    grunt.task.run('build:styles');
    grunt.task.run('build:scripts');
    grunt.task.run('build:templates');

    if (grunt.option('target') !== 'prod') {
      // grunt.task.run('karma:dev');
      grunt.task.run('watch');

      require('net').createServer(function(socket) {
        reload = socket;
      }).listen(9292);
    }
  });

  /*********************************************************
  *** SASS -> CSS
  *********************************************************/

  grunt.registerTask('build:styles', function () {
    var sass_css = fs.src(['./public/**/*.sass', './public/**/*.scss'])
      .pipe(sass())
      .pipe(concat('sass.css'));

    var less_css = fs.src('./public/**/*.less')
      .pipe(less())
      .pipe(concat('less.css'));

    var task = merge(sass_css, less_css)
      .pipe(concat('styles.css'));

    if (grunt.option('target') === 'prod') {
      task.pipe(cssmin());
    }

    task.pipe(fs.dest('./dist'))
    .on('end', this.async());
  });

  /*********************************************************
  *** JAVASCRIPT:USER
  *********************************************************/

  grunt.registerTask('build:scripts', function () {
    var task = fs.src('./public/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('scripts.js'));

    if (grunt.option('target') === 'prod') {
      task.pipe(uglify());
    }

    task.pipe(fs.dest('./dist'))
      .on('end', this.async());
  });

  /*********************************************************
  *** VENDOR
  *********************************************************/

  grunt.registerTask('build:vendor', function () {
    var styles = fs.src(config.css.vendor)
        .pipe(concat('main.css'));

    var less_css = fs.src(config.less.vendor)
        .pipe(less())
        .pipe(concat('less.css'));

    var less_and_css = merge(styles, less_css)
        .pipe(concat('vendor.css'))

    var scripts = fs.src(config.scripts.vendor)
        .pipe(concat('vendor.js'));

    merge(less_and_css, scripts)
      .pipe(fs.dest('./dist'))
      .on('end', this.async());
  });

  /*********************************************************
  *** TEMPLATES
  *********************************************************/

  grunt.registerTask('build:templates', function () {
    var task = fs.src('./public/**/*.tpl.html')
        .pipe(minifyHtml({
          empty: true,
          spare: true,
          quotes: true
        }))
        .pipe(html2Js({
          moduleName: 'templates',
          prefix: '/'
        }))
        .pipe(concat('templates.js'));

    if (grunt.option('target') === 'prod') {
      task.pipe(uglify());
    }

    task.pipe(fs.dest('./dist'))
      .on('end', this.async());
  });
};
