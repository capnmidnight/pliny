function goh(name, fileName, moduleName, format){
}

var gulp = require("gulp"),
  pkg = require("./package.json"),
  marigold = require("marigold-build").setup(gulp, pkg),
  js = marigold.js({
    moduleName: "pliny",
    format: "umd",
    dependencies: ["format"],
    sourceMap: true,
    extractDocumentation: false,
    disableGenerators: true
  }),
  html = marigold.html(["*.pug"]),
  devServer = marigold.devServer([
      "src/**/*",
      "*.pug"
    ], [
      "!gulpfile.js",
      "*.js",
      "*.html"
    ]);

gulp.task("dev", devServer);

marigold.taskify([
    js,
    html
  ], {
    default: devServer
  });
