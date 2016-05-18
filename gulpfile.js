var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    del = require('del'),
    reload = browserSync.reload,
    runSequence = require('run-sequence')

var src = {
  'base'   : 'src',
  'styles' : 'src/styles',
  'images' : 'src/images',
  'html'   : 'src/html',
  'content': 'src/content'
}

var build = {
    'base'   : 'build',
    'styles' : 'build/styles',
    'images' : 'build/images',
    'content': 'build/content'
}

var dist = {
    'base' : 'dist'
}

gulp.task('serve', ['build'], function() {

    browserSync.init({
        server: build.base
    });

    gulp.watch(src.styles + '/**/*.scss', ['build']).on('change', reload);;
    gulp.watch('*.html', ['build']).on('change', reload);;
});

gulp.task('compileBuild', function () {
  // Hacer variable el archivo de datos
  // Acá en lugar de leer un archivo se puede hacer una llamada a una api con algun módulo externo
  // var templateData = JSON.parse(fs.readFileSync(src.content + '/data_rsys_MLC.json')),
  var templateData = {},
	options = {
		ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
    // batch : src.components
		// partials : {
		// 	footer : '<footer>{{{banner_mobile_title}}}</footer>'
		// },
		// helpers : {
		// 	capitals : function(str){
		// 		return str.toUpperCase();
		// 	}
		// }
	}

	return gulp.src(src.base + '/*.html')
		.pipe($.compileHandlebars(templateData, options))
		.pipe(gulp.dest(build.base));
});

// Compile scss into CSS & auto-inject into browsers
gulp.task('scssBuild', function() {
    return gulp.src(src.styles + '/**/*.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
          onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe($.sourcemaps.write('maps'))
        .pipe(gulp.dest(build.styles))
        .pipe(browserSync.stream());
});

// Inline CSS
gulp.task('inlineDist', function() {
    return gulp.src(build.base + '/*.html')
        .pipe($.inlineCss({
          preserveMediaQueries: true,
          applyStyleTags: true,
          applyLinkTags: true
        }))
        .pipe(gulp.dest(dist.base));
});

// Optimiza y copia las imagenes a ./web-app/images
gulp.task('imageBuild', function() {
    return gulp.src(src.images + '/**/**.*')
        .pipe(gulp.dest(build.images))
});


gulp.task('cleanBuild', function() {
    del.sync([build.base + '*']);
});

gulp.task('cleanDist', function() {
    del.sync([dist.base + '*']);
});


gulp.task('build', function () {
  runSequence(
    'cleanBuild', 'scssBuild', 'imageBuild', 'compileBuild'
  )
})

gulp.task('dist', function () {
  runSequence(
    'cleanDist', 'inlineDist'
  )
})
