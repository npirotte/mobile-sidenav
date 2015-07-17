var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('default', ['js', 'less']);

gulp.task('js', function()
{
  gulp.src('./src/*.js')
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename({
       extname: '.min.js'
     }))
    .pipe(gulp.dest('./dist'))
});

gulp.task('less', function()
{
  gulp
    .src("./src/MobileSideNav.less")
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist'))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(rename({
       extname: '.min.css'
     }))
    .pipe(gulp.dest('./dist'));
});