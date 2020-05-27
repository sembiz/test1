const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const imageMin = require('gulp-imagemin');
const resize = require('gulp-image-resize');
const rename = require('gulp-rename');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const prefix = require('gulp-autoprefixer');
const uglify = require('gulp-uglify-es').default;
const cssMin = require('gulp-csso');

// Reduce images functions
gulp.task('clean-images', function() {
    return del('./img/optimized');
});

gulp.task('clean-dist', function() {
    return del('./dist');
});

gulp.task('reduce-images', ['clean-images'], function() {
    gulp.src('./img/*.{jpg, png}') 
        .pipe(resize({ 
            width: 800, 
            quality: 0.5
        }))
        .pipe(imageMin()) 
        .pipe(rename(function (path) { path.basename += "-optimized"; })) 
        .pipe(gulp.dest('./img/optimized'))
});

// Watching functions
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html"
        },
        logLevel: "warn",
        injectChanges: false
    });
});

gulp.task('html', function() {
    gulp.src(['./index.html', './restaurant.html'])
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('copy-icons', function() {
    gulp.src('./img/icons/*.*')
    .pipe(gulp.dest('dist/img/icons/'))
})

gulp.task('copy-images', function() {
    gulp.src('./img/optimized/*.*')
    .pipe(gulp.dest('dist/img/optimized/'))
})

gulp.task('copy-extras', function() {
    gulp.src(['./idb.js', './manifest.json', './sw.js'])
    .pipe(gulp.dest('dist/'))
})

gulp.task('css', function() {
    gulp.src('./css/*.css')
    .pipe(sourcemaps.init())
    .pipe(prefix())
    .pipe(cssMin())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('main-js', function() {
    gulp.src(['./js/dbhelper.js', './js/main.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('index.js', {newLine: '\r\n'}))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('single-js', function() {
    gulp.src(['./js/dbhelper.js', './js/restaurant_info.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('restaurant.js', {newLine: '\r\n'}))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('js', ['main-js', 'single-js'], function() {
    gulp.src('./dist/js/*.js')
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', function() {
    gulp.watch('./*.html', ['html']);
    gulp.watch('./css/*.css', ['css']);
    gulp.watch('./js/*.js', ['js']);
});

gulp.task('build', ['js', 'css', 'html', 'copy-icons', 'copy-images', 'copy-extras']);

gulp.task('start', ['browser-sync', 'build', 'watch']);
