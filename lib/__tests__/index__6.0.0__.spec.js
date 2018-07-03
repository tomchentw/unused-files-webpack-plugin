"use strict";

var _path = _interopRequireDefault(require("path"));

var _memoryFs = _interopRequireDefault(require("memory-fs"));

var _webpack = _interopRequireDefault(require("webpack"));

var _index = _interopRequireDefault(require("../index"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

const EXPECTED_FILENAME_LIST = [
  `CHANGELOG.md`,
  `README.md`,
  `src/__tests__/index.spec.js`,
  `package.json`
];
describe(`UnusedFilesWebpackPlugin module`, () => {
  it(
    `should work as expected`,
    done => {
      const compiler = (0, _webpack.default)({
        context: _path.default.resolve(__dirname, `../../`),
        entry: {
          UnusedFilesWebpackPlugin: _path.default.resolve(
            __dirname,
            `../index.js`
          )
        },
        output: {
          path: __dirname // It will be in MemoryFS :)
        },
        plugins: [new _index.default()]
      });
      compiler.outputFileSystem = new _memoryFs.default();
      compiler.run((err, stats) => {
        expect(err).toBeFalsy();
        const warnings = stats.compilation.warnings;
        expect(warnings).toHaveLength(1);

        const _warnings = _slicedToArray(warnings, 1),
          unusedFilesError = _warnings[0];

        expect(unusedFilesError).toBeInstanceOf(Error);
        const message = unusedFilesError.message;
        const containsExpected = EXPECTED_FILENAME_LIST.every(filename =>
          message.match(filename)
        );
        expect(containsExpected).toBeTruthy();
        done();
      });
    },
    10000
  );
  describe(`deprecated options.pattern`, () => {
    it(
      `should work as expected`,
      done => {
        const compiler = (0, _webpack.default)({
          context: _path.default.resolve(__dirname, `../../`),
          entry: {
            UnusedFilesWebpackPlugin: _path.default.resolve(
              __dirname,
              `../index.js`
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
        compiler.run((err, stats) => {
          expect(err).toBeFalsy();
          const warnings = stats.compilation.warnings;
          expect(warnings).toHaveLength(1);

          const _warnings2 = _slicedToArray(warnings, 1),
            unusedFilesError = _warnings2[0];

          expect(unusedFilesError).toBeInstanceOf(Error);
          const message = unusedFilesError.message;
          expect(message).toMatchSnapshot();
          done();
        });
      },
      10000
    );
  });
  describe(`options.patterns`, () => {
    it(
      `should work as expected for a single pattern`,
      done => {
        const compiler = (0, _webpack.default)({
          context: _path.default.resolve(__dirname, `../../`),
          entry: {
            UnusedFilesWebpackPlugin: _path.default.resolve(
              __dirname,
              `../index.js`
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
        compiler.run((err, stats) => {
          expect(err).toBeFalsy();
          const warnings = stats.compilation.warnings;
          expect(warnings).toHaveLength(1);

          const _warnings3 = _slicedToArray(warnings, 1),
            unusedFilesError = _warnings3[0];

          expect(unusedFilesError).toBeInstanceOf(Error);
          const message = unusedFilesError.message;
          expect(message).toMatchSnapshot();
          done();
        });
      },
      10000
    );
    it(
      `should work as expected for an array of patterns`,
      done => {
        const compiler = (0, _webpack.default)({
          context: _path.default.resolve(__dirname, `../../`),
          entry: {
            UnusedFilesWebpackPlugin: _path.default.resolve(
              __dirname,
              `../index.js`
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
        compiler.run((err, stats) => {
          expect(err).toBeFalsy();
          const warnings = stats.compilation.warnings;
          expect(warnings).toHaveLength(1);

          const _warnings4 = _slicedToArray(warnings, 1),
            unusedFilesError = _warnings4[0];

          expect(unusedFilesError).toBeInstanceOf(Error);
          const message = unusedFilesError.message;
          expect(message).toMatchSnapshot();
          done();
        });
      },
      10000
    );
  });
});
