"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(
  require("babel-runtime/helpers/slicedToArray")
);

var _path = _interopRequireDefault(require("path"));

var _memoryFs = _interopRequireDefault(require("memory-fs"));

var _webpack = _interopRequireDefault(require("webpack"));

var _index = _interopRequireDefault(require("../index"));

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

        const _warnings = (0, _slicedToArray2.default)(warnings, 1),
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

          const _warnings2 = (0, _slicedToArray2.default)(warnings, 1),
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

          const _warnings3 = (0, _slicedToArray2.default)(warnings, 1),
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

          const _warnings4 = (0, _slicedToArray2.default)(warnings, 1),
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
