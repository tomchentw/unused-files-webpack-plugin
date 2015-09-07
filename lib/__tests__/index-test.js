"use strict";

var Path = require("path");
var test = require("tape");
var MemoryFS = require("memory-fs");
var webpack = require("webpack");

var UnusedFilesWebpackPlugin = require("../index");

var EXPECTED_FILENAME_LIST = [
  "CHANGELOG.md",
  "README.md",
  "lib/__tests__/index-test.js",
  "package.json",
];

test("UnusedFilesWebpackPlugin", function (t) {
  var compiler = webpack({
    context: Path.resolve(__dirname, "../../"),
    entry: {
      UnusedFilesWebpackPlugin: Path.resolve(__dirname, "../index.js"),
    },
    output: {
      path: __dirname, // It will be in MemoryFS :)
    },
    plugins: [new UnusedFilesWebpackPlugin()],
  });
  compiler.outputFileSystem = new MemoryFS();

  compiler.run(function (err, stats) {
    t.equal(err, null);

    var warnings = stats.compilation.warnings;
    t.equal(warnings.length, 1);

    var unusedFilesError = warnings[0];
    t.equal(unusedFilesError instanceof Error, true);

    var message = unusedFilesError.message;
    var containsExpected = EXPECTED_FILENAME_LIST.every(function (filename) {
      return message.match(filename);
    });
    t.equal(containsExpected, true);

    t.end();
  });
});
