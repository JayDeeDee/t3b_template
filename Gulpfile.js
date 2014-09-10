var gulp = require('gulp');
var sassCompiler = require('./Build/Gulp-Tasks/Compilers/Css');
var jsCompiler = require('./Build/Gulp-Tasks/Compilers/Js');
var docsCompiler = require('./Build/Gulp-Tasks/Compilers/Docs');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('compile:css', function() {
	sassCompiler('dev');
});
gulp.task('compile:js', function() {
	jsCompiler.vendor('dev');
	jsCompiler.app('dev');
});
gulp.task('compile:dpcs', docsCompiler);