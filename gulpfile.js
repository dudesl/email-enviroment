var gulp = require('gulp');
var util = require('gulp-util');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var inlineCss = require('gulp-inline-css');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var sourcemaps  = require('gulp-sourcemaps');


var src = {
  'base' : 'src/',
  'styles' : 'src/styles',
  'images' : 'src/images'
}

var build = {
  'base' : 'build',
  'styles' : 'build/styles',
  'images' : 'build/images'
}

gulp.task('serve', ['build'], function() {

    browserSync.init({
        server: build.base
    });

    gulp.watch(src.styles + '/**/*.scss', ['build']).on('change', reload);;
    gulp.watch('*.html', ['build']).on('change', reload);;
});

// Compile scss into CSS & auto-inject into browsers
gulp.task('scssBuild', function() {
    return gulp.src(src.styles + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
          onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(build.styles))
        .pipe(browserSync.stream());
});

// Inline CSS
gulp.task('inlineDist', function() {
    return gulp.src('*.html')
        .pipe(inlineCss({
          preserveMediaQueries: true,
          applyStyleTags: true,
          applyLinkTags: true
        }))
        .pipe(gulp.dest(build.base));
});

// Optimiza y copia las imagenes a ./web-app/images
gulp.task('imageBuild', function() {
    return gulp.src(src.images + '/**/**.*')
        .pipe(gulp.dest(build.images))
});

gulp.task('build', function () {
  runSequence(
    'scssBuild', 'imageBuild','inlineDist'
  )
})
