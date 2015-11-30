var gulp = require('gulp');
var util = require('gulp-util');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var inlineCss = require('gulp-inline-css');
var sass = require('gulp-sass');
var swift = require('ui-swift');
var runSequence = require('run-sequence');
var sourcemaps  = require('gulp-sourcemaps');

gulp.task('serve', ['build'], function() {

    browserSync.init({
        server: '.'
    });

    gulp.watch('styles/scss/*.scss', ['scssBuild']);
    gulp.watch('*.html', ['build']);
});


// Compile scss into CSS & auto-inject into browsers
gulp.task('scssBuild', function() {
    return gulp.src('styles/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
          onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('styles'))
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
        .pipe(gulp.dest('./build/'));
});

gulp.task('uploadStatics', function () {
    swift({
        'department': 'ui',
        'user': 'app_ui-mails_boilerplate',
        'password': 'L0jkAHejnD',
        'friendlyUrl': 'email',
        'container': 'statics',
        'folder': 'img',
        'version': '0.0.0',
        'verbose': true
    });
});

// Optimiza y copia las imagenes a ./web-app/images
gulp.task('imageBuild', function() {
    return gulp.src('img/**/**.*')
        .pipe(gulp.dest('build/img'))
});

gulp.task('build', function () {
  runSequence(
    'scssBuild', 'imageBuild','inlineDist'
  )
})
