'use strict';
var path = require('path');
var fs = require('fs');
var exists = require('fs-exists-sync')
var gulp = require('gulp');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var data = require("gulp-data");
var rename = require("gulp-rename");
var uglify = require('gulp-uglify-es').default;
var minify = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var nunjucksRender = require('gulp-nunjucks-render');
var importOnce = require('node-sass-import-once');
var sass = require('gulp-sass');
    sass.compiler = require('node-sass');
var flatten = require('gulp-flatten');
var concat = require('gulp-concat-multi');
var browserify = require('gulp-browserify');
var argv = require('yargs').argv;
var src = "./src";
var dist = "./dist";
var config = require('./config')(src);
const env = (argv.env || 'dev').trim().toLowerCase();

function noop() {
    return;
}

function getDataForFile(file) {
    var data = {};
    var file = path.parse(file.relative).name;

    try {
        data = JSON.parse(fs.readFileSync(path.join('./src/html/pages', file + ".json")));
    } catch (err) {
        try {
            data = require('./src/html/pages/' + file+"/"+ file);
        } catch (err) {
            //console.log(err);
        }
    }

   
    var default_data = {
        site_name : "Cadau",
        page_name : file,
        assets: function(path) {
            return "assets/" + path;
        },
        isPageCssExists : function(page_name){
            return exists(src+"/html/pages/"+page_name+"/"+page_name+".scss");
        }
    }

    return Object.assign(data, default_data);
}

gulp.task('clean', function() {
    return gulp.src(dist).pipe(clean({
        force: true
    }));
});

gulp.task('copy', ['clean'], function() {
    return gulp.src(['./src/assets/**/*.*'])
        .pipe(gulp.dest(dist+"/assets"))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('sass', ['clean'], function() {

    var options = {
        includePaths: [
            path.join(src, 'scss/common'),
            'node_modules'
        ],
        sourceMap: true,
        importer: importOnce,
        importOnce: {
            css: true,
        }
    }

    var bootstrap = concat(config.css)
    	.pipe(autoprefixer());
        if (env == 'prod') {
            bootstrap.pipe(minify());
        }
        bootstrap.pipe(gulp.dest(dist + '/assets/css/'))
    	.pipe(browserSync.reload({stream: true }));
    
    var css = gulp.src(['./src/scss/css/*.css'])
	    .pipe(autoprefixer())
	    .pipe(flatten())
        if (env == 'prod') {
            css.pipe(minify());
        }
        css.pipe(gulp.dest(dist + '/assets/css/'))
    	.pipe(browserSync.reload({stream: true }));

    var site = gulp.src(['./src/scss/styles.scss', './src/html/pages/**/*.scss'])
        .pipe(sass(options).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(flatten())
        if (env == 'prod') {
            site.pipe(minify());
        }
        site.pipe(gulp.dest(dist + '/assets/css/'))
        .pipe(browserSync.reload({stream: true }));

    return Promise.all([bootstrap, css, site]);
});

gulp.task('js', ['clean'], function() {
    var ignore = [
        //'popper.js'
    ];

    var bootstrap = concat({
            "vendor.js" : [path.join(src, 'js/vendor.js') ],
            "app.js" : [path.join(src, 'js/app.js') ],
        })
       .pipe(browserify({
            ignore: ignore
        }))
        if (env == 'prod') {
            bootstrap.pipe(uglify());
        }
        bootstrap.pipe(gulp.dest(dist + '/assets/js/'))
        .pipe(browserSync.reload({stream: true }));
    
    var site = gulp.src(['./src/js/*.js', ])
        .pipe(browserify({
            ignore: ignore
        }))
        .pipe(flatten())
        if (env == 'prod') {
            site.pipe(uglify())
        }
        site
        .pipe(gulp.dest(dist + '/assets/js'))
        .pipe(browserSync.reload({stream: true }));

    return Promise.all([site]);
});


gulp.task('html', ['clean', 'copy', 'sass', 'js'], function() {
    return gulp.src('./src/html/pages/**/*.+(html|nunjucks)').pipe(data(getDataForFile)).pipe(nunjucksRender({
        path: ['src/html/'] // String or Array
    }))
    .pipe(flatten())
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({stream: true }));
});

gulp.task('build', ['html']);

gulp.task('browser-sync', ['build'], function() {
    browserSync.init({
        server: dist,
        watch: true,
    });
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('./src/**/*', ['build']);
    //gulp.watch('./src/html/*', ['html']);
    //gulp.watch('./src/assets/*', ['assets'])
    gulp.watch(dist).on('change', browserSync.reload);
});

gulp.task('default', ['watch']);