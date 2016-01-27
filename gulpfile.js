var gulp         = require('gulp'),
    del          = require('del'),
    run          = require('gulp-run'),
    less         = require('gulp-less'),
    cssmin       = require('gulp-minify-css'),
    browserify   = require('browserify'),
    uglify       = require('gulp-uglify'),
    concat       = require('gulp-concat'),
    jshint       = require('gulp-jshint'),
    source       = require('vinyl-source-stream'),
    buffer       = require('vinyl-buffer'),
    reactify     = require('reactify'),
    glob         = require('glob'),
    environments = require('gulp-environments'),
    pack         = require('./package.json');

var development = environments.development;
var production  = environments.production;

gulp.task('clean', function(cb) {
    //del(['./public/app/build/**'], cb);
});

gulp.task('bower', function() {
    run('bower install').exec();
});

gulp.task('less', function() {
    return gulp.src(pack.paths.less)
        .pipe(less())
        .pipe(concat(pack.dest.style))
        .pipe(gulp.dest(pack.dest.dist_style));
});

gulp.task('less:min', function() {
    return gulp.src(pack.paths.less)
        .pipe(less())
        .pipe(concat(pack.dest.style))
        .pipe(cssmin())
        .pipe(gulp.dest(pack.dest.dist_style));
});

gulp.task('lint', function() {
    return gulp.src(pack.paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
    glob(pack.paths.js, function(err, files) {
        var opts = {
            entries: files,
            debug:   development()
        };

        return browserify(opts)
            .transform(reactify)
            .bundle()
            .pipe(development(source('bundle.js')))
            .pipe(production(source('bundle.min.js')))
            .pipe(buffer())
            .pipe(production(uglify()))
            .pipe(gulp.dest(pack.dest.dist_script));
    });
});

gulp.task('default', ['scripts', 'less']);
gulp.task('watch', ['default'], function() {
    return gulp.watch([pack.paths.js, pack.paths.less], ['default']);
});