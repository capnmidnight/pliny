function makeBuild(name, dir) {
  return {
    name,
    entry: "src/${dir}/index.js",
    moduleName: "pliny",
    format: "umd",
    dependencies: ["format"],
    sourceMap: true,
    extractDocumentation: false,
    disableGenerators: true
  };
}

function makeTest(name, dir, extractDocumentation) {
  return marigold.js({
    entry: `tests/${dir}.js`,
    name,
    extractDocumentation,
    disableGenerators: true,
    moduleName: "Hello",
    format: "umd",
    sourceMap: false
  });
}

var gulp = require("gulp"),
  pkg = require("./package.json"),
  marigold = require("marigold-build").setup(gulp, pkg),

  client = marigold.js({
    entry: "src/client/index.js",
    name: "pliny",
    moduleName: "pliny",
    format: "umd",
    dependencies: ["format"],
    sourceMap: true,
    extractDocumentation: false,
    disableGenerators: true
  }),

  extractor = marigold.js({
    entry: "src/extractor/index.js",
    name: "pliny-extractor",
    moduleName: "plinyExtractor",
    format: "umd",
    dependencies: ["format"],
    sourceMap: true,
    extractDocumentation: false,
    disableGenerators: true
  }),

  formatter = marigold.js({
    entry: "src/formatter/index.js",
    name: "pliny-formatter",
    moduleName: "plinyFormatter",
    format: "umd",
    dependencies: ["format"],
    sourceMap: true,
    extractDocumentation: false,
    disableGenerators: true
  }),

  testRecording = makeTest("testRecording", "recording", true),
  testExtractingShim = makeTest("testExtractingShim", "recording", false),
  testExtracting = makeTest("testExtracting", "extracting", false),
  testFormatting = makeTest("testFormatting", "formatting", false)

  html = marigold.html(["*.pug"]),

  devServer = marigold.devServer([
      "src/**/*",
      "test/**/*",
      "*.pug"
    ], [
      "!gulpfile.js",
      "*.js",
      "*.html"
    ], {
      url: "pliny/testFormatting.html"
    });

gulp.task("dev", devServer);

marigold.taskify([
    client,
    extractor,
    formatter,
    testRecording,
    testExtractingShim,
    testExtracting,
    testFormatting,
    html
  ], {
    default: devServer
  });
