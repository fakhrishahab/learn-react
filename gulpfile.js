var gulp = require('gulp'),
	browserify = require('gulp-browserify'),
	plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	watch = require('gulp-watch'),
	del = require('del'),	
	webserver = require('gulp-webserver'),
	server = require('./server');

gulp.task('index', function(){
	gulp.src('src/views/*.*')
		.pipe(plumber())
		.pipe(gulp.dest('views'))
});

gulp.task('main', function(){
	gulp.src('src/js/*.js')
		.pipe(plumber())
		.pipe(browserify({ transform : 'reactify', debug : true}))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./public'))
});

gulp.task('createServer', function(){	
	server.listenServer()
});

gulp.task('watch', function(){
	gulp.watch('src/js/*.js', ['main'])
	gulp.watch('src/views/*.*', ['index'])
})

gulp.task('delete', function(cb){
	del('public', cb)
})

gulp.task('default', 
	[
		'delete',
		'createServer',
		'main',
		'index',
		'watch'
	]);
