const gulp = require('gulp');
const ts = require('gulp-typescript');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

// Load TypeScript projects
const tsProjectMain = ts.createProject('tsconfig.json');
const tsProjectWebsite = ts.createProject('tsconfig.json');

// Paths to source and destination folders
const paths = {
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist/styles'
  },
  scripts: {
    src: 'src/scripts/**/*.ts',
    dest: 'dist/scripts'
  },
  websiteScripts: {
    src: 'src/website/**/*.ts',
    dest: 'dist/website'
  },
  html: {
    src: 'src/**/*.html',
    dest: 'dist/'
  },
  assets: {
    src: 'src/assets/**/*',
    dest: 'dist/assets'
  }
};

// Clean dist folder
async function clean() {
  const delModule = await import('del');
  return delModule.deleteAsync(['dist']);
}

// Compile SCSS to CSS with sourcemaps
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Compile main TypeScript files with sourcemaps
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(tsProjectMain())
    .js.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Compile website TypeScript files with sourcemaps
function websiteScripts() {
  return gulp.src(paths.websiteScripts.src)
    .pipe(sourcemaps.init())
    .pipe(tsProjectWebsite())
    .js.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.websiteScripts.dest))
    .pipe(browserSync.stream());
}

// Copy HTML files to dist
function html() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Copy static assets to dist
function assets() {
  return gulp.src(paths.assets.src)
    .pipe(gulp.dest(paths.assets.dest));
}


// Watch files and reload browser on change
function watch() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.websiteScripts.src, websiteScripts);
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.assets.src, assets);
}

// Build task: clean dist then compile everything in parallel
const build = gulp.series(
  clean,
  gulp.parallel(styles, scripts, websiteScripts, html, assets)
);


// Export tasks to CLI
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.websiteScripts = websiteScripts;
exports.html = html;
exports.assets = assets;
exports.watch = gulp.series(build, watch);
exports.build = build;
exports.default = build;
