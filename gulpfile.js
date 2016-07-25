var gulp = require("gulp"),
  nt = require("notiontheory-basic-build").setup(gulp),
  tasks = nt.js(
    "pliny",
    ["src/**/*.js"],
    ["node_modules/marked/lib/marked.js"]);

gulp.task("default", [tasks.dev]);
gulp.task("debug", [tasks.debug]);
gulp.task("release", [tasks.release]);