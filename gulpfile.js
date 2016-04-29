var gulp = require("gulp"),
  babel = require("gulp-babel"),
  concat = require("gulp-concat"),
  jshint = require("gulp-jshint"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify");

gulp.task("lint", function () {
  return gulp.src("index.js")
    .pipe(jshint({
      multistr: true
    }));
});

gulp.task("default", ["lint"], function () {
  return gulp.src(["node_modules/marked/marked.min.js", "index.js"])
    .pipe(concat("pliny.js"))
    .pipe(babel({
      sourceMap: false,
      presets: ["es2015"]
    }))
    .pipe(gulp.dest("./"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./"));
});