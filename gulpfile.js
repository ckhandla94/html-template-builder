'use strict';
var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var data = require("gulp-data");
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
//var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var nunjucksRender = require('gulp-nunjucks-render');
var sass = require('gulp-sass');
sass.compiler = require('node-sass');

var src = "./src";
var dist = "./dist";


var config = {
	env : 'dev'
}

function noop(){
	return;
}

function getDataForFile(file) {
	var data = {};
	var file = path.parse(file.relative).name;
	try {
		data =  JSON.parse(fs.readFileSync(path.join('./src/html/pages', file+".json")));
	} catch (err) {
		try {
			data = require('./src/html/pages/'+ file);
		} catch (err) {
		}
	}
    return data;
}

gulp.task('clean', function () {
    return gulp.src(dist)
        .pipe(clean({force: true}));
});

gulp.task('copy', ['clean'], function() {
    return gulp.src(['./src/assets'])
    	.pipe(gulp.dest(dist))
	    .pipe(browserSync.reload({stream: true}));
});

gulp.task('html', ['clean'], function() {
    return gulp.src('./src/html/pages/*.+(html|nunjucks)')
    	.pipe(data(getDataForFile))
    	.pipe(nunjucksRender({
	        path: ['src/html/'] // String or Array
	    }))
	    .pipe(gulp.dest(dist))
	    .pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', ['clean'], function() {
    return gulp.src(['./src/sass/*.scss', '!./src/sass/common/*.scss'])
    	.pipe(sass().on('error', sass.logError))
    	.pipe(autoprefixer())
    	.pipe(gulp.dest(dist+'/assets/css'))
	    .pipe(browserSync.reload({stream: true}));
});



gulp.task('js', ['clean'], function () {
    return gulp.src([
        './src/js/*.js', 
        '!./src/js/*.min.js',

        './node_modules/jquery/dist/jquery.js',
        './node_modules/jquery/dist/jquery.min.js',

        './node_modules/bootstrap/dist/js/bootstrap.js',
        './node_modules/bootstrap/dist/js/bootstrap.min.js'
        ])
        .pipe(gulp.dest(dist+'/assets/js'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('css', ['clean'], function () {
    return gulp.src([
        './node_modules/bootstrap/dist/css/bootstrap.css',
        './node_modules/bootstrap/dist/css/bootstrap.min.css'
        ])
    	.pipe(gulp.dest(dist+'/assets/css'))
    	.pipe(browserSync.reload({stream: true}));
});

gulp.task('build-dev', ['copy', 'html', 'sass', 'css', 'js']);


gulp.task('min-js', ['clean'], function () {
    return gulp.src('./src/js/*.js')
    	.pipe(uglify())
    	.pipe(rename({
            suffix: '.min.js'
        }))
    	.pipe(gulp.dest(dist+'/assets/js/'));
});
gulp.task('min-css', ['clean'], function () {
    return gulp.src(['./src/css/*.css', '!./src/css/*.min.css'])
    	.pipe(minify())
    	.pipe(rename({
            suffix: '.min.css'
        }))
    	.pipe(gulp.dest(dist+'/assets/css/'));
});


gulp.task('build', ['build-dev',  'min-js', 'min-css']);


gulp.task('browser-sync', ['build-dev'], function() {
    browserSync.init({
        server: dist,
        watch: true,
    });
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('./src/sass/*.scss', ['sass']);
    gulp.watch(['./src/html/*'], ['html']);
    gulp.watch('./src/assets', ['assets'])
    gulp.watch(dist).on('change', browserSync.reload);
});

gulp.task('default', ['watch']);