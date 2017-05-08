var gulp = require("gulp"),
  pkg = require("./package.json"),
  marigold = require("marigold-build").setup(gulp, pkg),
  js = marigold.js({
    entry: "src/index.js",
    dependencies: ["format"],
    moduleName: "pliny",
    disableGenerators: true
  });

marigold.taskify([js], {});
