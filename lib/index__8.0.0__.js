"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.UnusedFilesWebpackPlugin = void 0;

var _path = _interopRequireDefault(require("path"));

var _warning = _interopRequireDefault(require("warning"));

var _globAll = _interopRequireDefault(require("glob-all"));

var _util = _interopRequireDefault(require("util.promisify"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}

const globAll = (0, _util.default)(_globAll.default);

function globOptionsWith(compiler, globOptions) {
  return _extends(
    {
      cwd: compiler.context
    },
    globOptions
  );
}

function getFileDepsMap(compilation) {
  const fileDepsBy = [...compilation.fileDependencies].reduce(
    (acc, usedFilepath) => {
      acc[usedFilepath] = true;
      return acc;
    },
    {}
  );
  const { assets } = compilation;
  Object.keys(assets).forEach(assetRelpath => {
    const existsAt = assets[assetRelpath].existsAt;
    fileDepsBy[existsAt] = true;
  });
  return fileDepsBy;
}

async function applyAfterEmit(compiler, compilation, plugin) {
  try {
    const globOptions = globOptionsWith(compiler, plugin.globOptions);
    const fileDepsMap = getFileDepsMap(compilation);
    const files = await globAll(
      plugin.options.patterns || plugin.options.pattern,
      globOptions
    );
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
}

class UnusedFilesWebpackPlugin {
  constructor(options = {}) {
    (0, _warning.default)(
      !options.pattern,
      `
"options.pattern" is deprecated and will be removed in v4.0.0.
Use "options.patterns" instead, which supports array of patterns and exclude pattern.
See https://www.npmjs.com/package/glob-all#notes
`
    );
    this.options = _extends({}, options, {
      patterns: options.patterns || options.pattern || [`**/*.*`],
      failOnUnused: options.failOnUnused === true
    });
    this.globOptions = _extends(
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
