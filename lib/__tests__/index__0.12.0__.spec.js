"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(
  require("babel-runtime/helpers/slicedToArray")
);

var _path = _interopRequireDefault(require("path"));

var _memoryFs = _interopRequireDefault(require("memory-fs"));

var _webpack = _interopRequireDefault(require("webpack"));

var _index = _interopRequireDefault(require("../index"));

var EXPECTED_FILENAME_LIST = [
  "CHANGELOG.md",
  "README.md",
  "src/__tests__/index.spec.js",
  "package.json"
];
describe("UnusedFilesWebpackPlugin module", function() {
  it(
    "should work as expected",
    function(done) {
      var compiler = (0, _webpack.default)({
        context: _path.default.resolve(__dirname, "../../"),
        entry: {
          UnusedFilesWebpackPlugin: _path.default.resolve(
            __dirname,
            "../index.js"
          )
        },
        output: {
          path: __dirname // It will be in MemoryFS :)
        },
        plugins: [new _index.default()]
      });
      compiler.outputFileSystem = new _memoryFs.default();
      compiler.run(function(err, stats) {
        expect(err).toBeFalsy();
        var warnings = stats.compilation.warnings;
        expect(warnings).toHaveLength(1);

        var _warnings = (0, _slicedToArray2.default)(warnings, 1),
          unusedFilesError = _warnings[0];

        expect(unusedFilesError).toBeInstanceOf(Error);
        var message = unusedFilesError.message;
        var containsExpected = EXPECTED_FILENAME_LIST.every(function(filename) {
          return message.match(filename);
        });
        expect(containsExpected).toBeTruthy();
        done();
      });
    },
    10000
  );
  describe("deprecated options.pattern", function() {
    it(
      "should work as expected",
      function(done) {
        var compiler = (0, _webpack.default)({
          context: _path.default.resolve(__dirname, "../../"),
          entry: {
            UnusedFilesWebpackPlugin: _path.default.resolve(
              __dirname,
              "../index.js"
            )
          },
          output: {
            path: __dirname
          },
          plugins: [
            new _index.default({
              pattern: "src/**/*.*"
            })
          ]
        });
        compiler.outputFileSystem = new _memoryFs.default();
        compiler.run(function(err, stats) {
          expect(err).toBeFalsy();
          var warnings = stats.compilation.warnings;
          expect(warnings).toHaveLength(1);

          var _warnings2 = (0, _slicedToArray2.default)(warnings, 1),
            unusedFilesError = _warnings2[0];

          expect(unusedFilesError).toBeInstanceOf(Error);
          var message = unusedFilesError.message;
          expect(message).toMatchSnapshot();
          done();
        });
      },
      10000
    );
  });
  describe("options.patterns", function() {
    it(
      "should work as expected for a single pattern",
      function(done) {
        var compiler = (0, _webpack.default)({
          context: _path.default.resolve(__dirname, "../../"),
          entry: {
            UnusedFilesWebpackPlugin: _path.default.resolve(
              __dirname,
              "../index.js"
            )
          },
          output: {
            path: __dirname
          },
          plugins: [
            new _index.default({
              patterns: ["src/**/*.*"]
            })
          ]
        });
        compiler.outputFileSystem = new _memoryFs.default();
        compiler.run(function(err, stats) {
          expect(err).toBeFalsy();
          var warnings = stats.compilation.warnings;
          expect(warnings).toHaveLength(1);

          var _warnings3 = (0, _slicedToArray2.default)(warnings, 1),
            unusedFilesError = _warnings3[0];

          expect(unusedFilesError).toBeInstanceOf(Error);
          var message = unusedFilesError.message;
          expect(message).toMatchSnapshot();
          done();
        });
      },
      10000
    );
    it(
      "should work as expected for an array of patterns",
      function(done) {
        var compiler = (0, _webpack.default)({
          context: _path.default.resolve(__dirname, "../../"),
          entry: {
            UnusedFilesWebpackPlugin: _path.default.resolve(
              __dirname,
              "../index.js"
            )
          },
          output: {
            path: __dirname
          },
          plugins: [
            new _index.default({
              patterns: ["src/**/*.*", "!**/__snapshots__/**/*.*"]
            })
          ]
        });
        compiler.outputFileSystem = new _memoryFs.default();
        compiler.run(function(err, stats) {
          expect(err).toBeFalsy();
          var warnings = stats.compilation.warnings;
          expect(warnings).toHaveLength(1);

          var _warnings4 = (0, _slicedToArray2.default)(warnings, 1),
            unusedFilesError = _warnings4[0];

          expect(unusedFilesError).toBeInstanceOf(Error);
          var message = unusedFilesError.message;
          expect(message).toMatchSnapshot();
          done();
        });
      },
      10000
    );
  });
});
