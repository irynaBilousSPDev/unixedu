const gulp = require('gulp');
const sassCompiler = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const isProd = process.env.NODE_ENV === 'production';

const paths = {
  styles: {
    src: 'assets/src/scss/main.scss',
    watch: 'assets/src/scss/**/*.scss',
    dest: 'assets/dist/css',
  },
  images: {
    src: 'assets/src/images/**/*.{png,svg,jpg,jpeg,webp,gif}',
    watch: 'assets/src/images/**/*',
    dest: 'assets/dist/images',
    base: 'assets/src/images',
  },
  scripts: {
    src: ['assets/src/js/modules/**/*.js', 'assets/src/js/main.js'],
    watch: 'assets/src/js/**/*.js',
    dest: 'assets/dist/js',
  },
  dist: 'assets/dist',
};

function clean() {
  return import('del').then(({ deleteAsync }) => deleteAsync([paths.dist]));
}

function styles() {
  let stream = gulp.src(paths.styles.src, { allowEmpty: true });

  if (!isProd) {
    stream = stream.pipe(sourcemaps.init());
  }

  stream = stream
    .pipe(
      sassCompiler({
        outputStyle: 'expanded',
      }).on('error', sassCompiler.logError)
    )
    .pipe(postcss([autoprefixer()]));

  if (isProd) {
    stream = stream.pipe(cleanCSS());
  }

  if (!isProd) {
    stream = stream.pipe(sourcemaps.write('.'));
  }

  return stream.pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  let stream = gulp.src(paths.scripts.src, { allowEmpty: true });

  if (!isProd) {
    stream = stream.pipe(sourcemaps.init());
  }

  stream = stream.pipe(concat('main.js'));

  if (isProd) {
    stream = stream.pipe(uglify());
  }

  if (!isProd) {
    stream = stream.pipe(sourcemaps.write('.'));
  }

  return stream.pipe(gulp.dest(paths.scripts.dest));
}

function images() {
  return gulp
    .src(paths.images.src, { allowEmpty: true, base: paths.images.base, encoding: false })
    .pipe(gulp.dest(paths.images.dest));
}

function watch() {
  gulp.watch(paths.styles.watch, styles);
  gulp.watch(paths.scripts.watch, scripts);
  gulp.watch(paths.images.watch, images);
}

const build = gulp.series(clean, gulp.parallel(styles, scripts, images));

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watch = gulp.series(build, watch);
exports.build = build;

