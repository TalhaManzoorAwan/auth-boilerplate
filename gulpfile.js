var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');

gulp.task('styles', function() {
    gulp.src('public/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css/'));
});

//gulp.task('compress', function() {
//    gulp.src('public/libs/**/*.js')
//        .pipe(minify({
//            ext:{
//                min:'.js'
//            },
//            ignoreFiles: ['.combo.js', '.min.js']
//        }))
//        .pipe(gulp.dest('./public/images/'))
//});

var jsFiles = [
        'public/libs/jquery/dist/jquery.min.js',
        'public/libs/angular/angular.min.js',
        'public/libs/angular-route/angular-route.min.js',
        'public/libs/angular-material/angular-material.min.js',
        'public/libs/angular-aria/angular-aria.min.js',
        'public/libs/angular-animate/angular-animate.min.js',
        'public/libs/angular-messages/angular-messages.min.js',
        'public/libs/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
        'public/libs/intl-tel-input/build/js/intlTelInput.js',
        'public/libs/angular-bindonce/bindonce.js',
        'public/libs/highcharts/highcharts.js',
        'public/libs/highcharts/modules/exporting.js',
        'public/libs/ng-file-upload/ng-file-upload.min.js',
        'public/libs/angular-base64-upload/dist/angular-base64-upload.min.js',
        'public/libs/datatables.net/js/jquery.dataTables.min.js',
        'public/libs/angular-datatables/dist/angular-datatables.min.js'

             ],
    jsDest = 'public/dist/js/';

gulp.task('compress-js', function() {
    return gulp.src(jsFiles)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});



var cssFiles = [
        'public/libs/bootstrap/dist/css/bootstrap.min.css',
        'public/libs/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/libs/intl-tel-input/build/css/intlTelInput.css',
        'public/libs/angular-datatables/dist/css/angular-datatables.min.css',
        'public/libs/angular-material/angular-material.min.css',
        'public/libs/angular-material/layouts/angular-material.layouts.min.css',
        'public/libs/angular-material/layouts/angular-material.layout-attributes.min.css',
        'public/libs/font-awesome/css/font-awesome.min.css',
        'public/libs/bootstrap-social/bootstrap-social.css'
],
    cssDest = 'public/dist/css/';


gulp.task('compress-css', function() {
    return gulp.src(cssFiles)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(cssDest))
        .pipe(rename('vendor.min.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest(cssDest));
});



var sourceFiles = [
        'public/js/MainCtrl.js','public/js/ToastService.js','public/js/customfilter.js','public/js/appRoutes.js',
        'public/packages/**/*.js'
    ],
    sourceDest = 'public/dist/js/';

gulp.task('compress-source', function() {
    return gulp.src(sourceFiles)
        .pipe(concat('source.js'))
        .pipe(gulp.dest(sourceDest))
        .pipe(rename('source.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(sourceDest));
});


gulp.task('default',function() {
    gulp.watch('public/sass/**/*.scss',['styles']);
    gulp.watch('public/libs/**/*.js',['compress-js']);
    gulp.watch('public/libs/**/*.css',['compress-css']);
    gulp.watch('public/packages/**/*.js',['compress-source']);
});