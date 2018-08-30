const del = require('del');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = ts.createProject('tsconfig.build.json');

gulp.task('clean-dist', () => {
  return del(['dist/**']);
});

gulp.task('build-src', function () {
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js
    .pipe(sourcemaps.write('.', {
      sourceRoot: (file) => { return file.cwd + '/src'; }
}))
.pipe(gulp.dest('dist'));
});

// Setup the project ready for development
gulp.task('symlink', function() {
  // Copy over our git hooks
  return gulp.src('.github/hooks/*.sh').pipe(gulp.dest('.git/hooks', {overwrite: false} ));
});

gulp.task('default', ['clean-dist', 'build-src']);

gulp.task('watch', function() {
  gulp.watch('src/**/*.ts', ['clean-dist']);
});
