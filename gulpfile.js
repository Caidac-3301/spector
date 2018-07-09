const gulp = require('gulp');
const watch = require('gulp-watch');

const settings = {
    copy: {
        files: ['src/views/**/*', 'src/public/**/*']
    },
    watch: {
        files: ['src/views/**/*', 'src/public/**/*']
    },
    base: './'
};

gulp.task('copy', function () {
    console.log('Running gulp copy');
    return gulp.src(settings.copy.files, {base: './src/'})
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function () {
    console.log('Running gulp watch');
    return gulp.src(settings.watch.files, {base: './src/'})
        .pipe(watch(settings.watch.files, {base: './src/'}))
        .pipe(gulp.dest('dist/'));
});
