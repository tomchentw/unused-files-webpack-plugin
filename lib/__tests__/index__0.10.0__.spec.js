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
  it("should work as expected", function(done) {
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
  });
});
