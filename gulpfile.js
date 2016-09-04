var gulp = require("gulp"),
  pkg = require("./package.json"),
  nt = require("notiontheory-basic-build").setup(gulp, pkg),
  js = nt.js("pliny-lib", "src", ["format"]),
  cat = nt.cat("pliny", ["node_modules/marked/lib/marked.js", "pliny-lib.js"], [js.build]);

gulp.task("format", [js.format]);
gulp.task("default", [js.default, cat.default]);
gulp.task("release", [cat.build]);