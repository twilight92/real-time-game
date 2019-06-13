import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import minifyCSS from 'gulp-csso';
import del from 'del';
import bro from 'gulp-browserify';
import babel from 'babelify';

sass.compiler = require('node-sass');

const paths = {
    style : {
        src : 'assets/scss/styles.scss',
        dest : 'src/static/style',
        watch : 'assets/scss/**/*.scss'
    },
    js : {
        src : 'assets/js/main.js',
        dest: 'src/static/js',
        watch: 'assets/js/**/*.js'
    }
}

const clean = () => del(['src/static']);

const style = () =>
    gulp
        .src(paths.style.src)
        .pipe(sass())
        .pipe(
            autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            })
        )
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.style.dest));

const js = () =>
  gulp
    .src(paths.js.src)
    .pipe(
            bro({
                transform : [
                    babel.configure({
                        presets: ['@babel/preset-env']
                    })
                ]
            })
    )
    .pipe(gulp.dest(paths.js.dest));

const watchFiles = () => {
    gulp.watch(paths.style.watch, style);
    gulp.watch(paths.js.watch, js);
}

const dev = gulp.series([clean, style, js, watchFiles]);

export const build = gulp.series(clean, style, js);

export default dev;