"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.UnusedFilesWebpackPlugin = void 0;

var _asyncToGenerator2 = _interopRequireDefault(
  require("babel-runtime/helpers/asyncToGenerator")
);

var _keys = _interopRequireDefault(
  require("babel-runtime/core-js/object/keys")
);

var _extends2 = _interopRequireDefault(
  require("babel-runtime/helpers/extends")
);

var _path = _interopRequireDefault(require("path"));

var _glob = _interopRequireDefault(require("glob"));

var _util = _interopRequireDefault(require("util.promisify"));

let applyAfterEmit = (() => {
  var _ref = (0, _asyncToGenerator2.default)(function*(
    compiler,
    compilation,
    plugin
  ) {
    try {
      const globOptions = globOptionsWith(compiler, plugin.globOptions);
      const fileDepsMap = getFileDepsMap(compilation);
      const files = yield glob(plugin.options.pattern, globOptions);
      const unused = files.filter(
        it => !fileDepsMap[_path.default.join(globOptions.cwd, it)]
      );

      if (unused.length !== 0) {
        throw new Error(`
UnusedFilesWebpackPlugin found some unused files:
${unused.join(`\n`)}`);
      }
    } catch (error) {
      if (plugin.options.failOnUnused && compilation.bail) {
        throw error;
      }

      const errorsList = plugin.options.failOnUnused
        ? compilation.errors
        : compilation.warnings;
      errorsList.push(error);
    }
  });

  return function applyAfterEmit(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();

const glob = (0, _util.default)(_glob.default);

function globOptionsWith(compiler, globOptions) {
  return (0, _extends2.default)(
    {
      cwd: compiler.context
    },
    globOptions
  );
}

function getFileDepsMap(compilation) {
  const fileDepsBy = compilation.fileDependencies.reduce(
    (acc, usedFilepath) => {
      acc[usedFilepath] = true;
      return acc;
    },
    {}
  );
  const assets = compilation.assets;
  (0, _keys.default)(assets).forEach(assetRelpath => {
    const existsAt = assets[assetRelpath].existsAt;
    fileDepsBy[existsAt] = true;
  });
  return fileDepsBy;
}

class UnusedFilesWebpackPlugin {
  constructor(options = {}) {
    this.options = (0, _extends2.default)(
      {
        pattern: `**/*.*`
      },
      options,
      {
        failOnUnused: options.failOnUnused === true
      }
    );
    this.globOptions = (0, _extends2.default)(
      {
        ignore: `node_modules/**/*`
      },
      options.globOptions
    );
  }

  apply(compiler) {
    compiler.plugin(`after-emit`, (compilation, done) =>
      applyAfterEmit(compiler, compilation, this).then(done, done)
    );
  }
}

exports.UnusedFilesWebpackPlugin = UnusedFilesWebpackPlugin;
var _default = UnusedFilesWebpackPlugin;
exports.default = _default;
