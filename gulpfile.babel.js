import gulp from 'gulp';
import sass from 'gulp-sass';

const paths = {
    style : {
        src : 'assets/scss/style.scss',
        dest : 'src/static/style'
    }
}

export function style(){
    return gulp
        .src(paths.style.src)
        .pipe(sass())
        .pipe(gulp.dest(paths.style.dest));
}
