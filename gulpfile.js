const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cssmin = require("gulp-cssmin");
const concat = require("gulp-concat");

function compileSass() {
  return gulp
    .src("sass/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("css"));
}

function minifyCss() {
  return gulp
    .src([
      "lib/normalize-css/normalize.css",
      "lib/TooltipStylesInspiration/css/tooltip-flip.css",
      "css/style.css",
    ])
    .pipe(concat("style.min.css"))
    .pipe(cssmin())
    .pipe(gulp.dest("css"));
}

const build = gulp.series(compileSass, minifyCss);

exports.default = build;
