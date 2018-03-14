"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.UnusedFilesWebpackPlugin = void 0;

var _classCallCheck2 = _interopRequireDefault(
  require("babel-runtime/helpers/classCallCheck")
);

var _createClass2 = _interopRequireDefault(
  require("babel-runtime/helpers/createClass")
);

var _regenerator = _interopRequireDefault(require("babel-runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(
  require("babel-runtime/helpers/asyncToGenerator")
);

var _keys = _interopRequireDefault(
  require("babel-runtime/core-js/object/keys")
);

var _toConsumableArray2 = _interopRequireDefault(
  require("babel-runtime/helpers/toConsumableArray")
);

var _extends2 = _interopRequireDefault(
  require("babel-runtime/helpers/extends")
);

var _path = _interopRequireDefault(require("path"));

var _warning = _interopRequireDefault(require("warning"));

var _globAll = _interopRequireDefault(require("glob-all"));

var _util = _interopRequireDefault(require("util.promisify"));

var applyAfterEmit = (function() {
  var _ref = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(compiler, compilation, plugin) {
      var globOptions, fileDepsMap, files, unused, errorsList;
      return _regenerator.default.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                _context.prev = 0;
                globOptions = globOptionsWith(compiler, plugin.globOptions);
                fileDepsMap = getFileDepsMap(compilation);
                _context.next = 5;
                return globAll(
                  plugin.options.patterns || plugin.options.pattern,
                  globOptions
                );

              case 5:
                files = _context.sent;
                unused = files.filter(function(it) {
                  return !fileDepsMap[_path.default.join(globOptions.cwd, it)];
                });

                if (!(unused.length !== 0)) {
                  _context.next = 9;
                  break;
                }

                throw new Error(
                  "\nUnusedFilesWebpackPlugin found some unused files:\n".concat(
                    unused.join("\n")
                  )
                );

              case 9:
                _context.next = 17;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](0);

                if (!(plugin.options.failOnUnused && compilation.bail)) {
                  _context.next = 15;
                  break;
                }

                throw _context.t0;

              case 15:
                errorsList = plugin.options.failOnUnused
                  ? compilation.errors
                  : compilation.warnings;
                errorsList.push(_context.t0);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        },
        _callee,
        this,
        [[0, 11]]
      );
    })
  );

  return function applyAfterEmit(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();

var globAll = (0, _util.default)(_globAll.default);

function globOptionsWith(compiler, globOptions) {
  return (0, _extends2.default)(
    {
      cwd: compiler.context
    },
    globOptions
  );
}

function getFileDepsMap(compilation) {
  var fileDepsBy = []
    .concat((0, _toConsumableArray2.default)(compilation.fileDependencies))
    .reduce(function(acc, usedFilepath) {
      acc[usedFilepath] = true;
      return acc;
    }, {});
  var assets = compilation.assets;
  (0, _keys.default)(assets).forEach(function(assetRelpath) {
    var existsAt = assets[assetRelpath].existsAt;
    fileDepsBy[existsAt] = true;
  });
  return fileDepsBy;
}

var UnusedFilesWebpackPlugin =
  /*#__PURE__*/
  (function() {
    function UnusedFilesWebpackPlugin() {
      var options =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      (0, _classCallCheck2.default)(this, UnusedFilesWebpackPlugin);
      (0, _warning.default)(
        !options.pattern,
        '\n"options.pattern" is deprecated and will be removed in v4.0.0.\nUse "options.patterns" instead, which supports array of patterns and exclude pattern.\nSee https://www.npmjs.com/package/glob-all#notes\n'
      );
      this.options = (0, _extends2.default)({}, options, {
        patterns: options.patterns || options.pattern || ["**/*.*"],
        failOnUnused: options.failOnUnused === true
      });
      this.globOptions = (0, _extends2.default)(
        {
          ignore: "node_modules/**/*"
        },
        options.globOptions
      );
    }

    (0, _createClass2.default)(UnusedFilesWebpackPlugin, [
      {
        key: "apply",
        value: function apply(compiler) {
          var _this = this;

          compiler.plugin("after-emit", function(compilation, done) {
            return applyAfterEmit(compiler, compilation, _this).then(
              done,
              done
            );
          });
        }
      }
    ]);
    return UnusedFilesWebpackPlugin;
  })();

exports.UnusedFilesWebpackPlugin = UnusedFilesWebpackPlugin;
var _default = UnusedFilesWebpackPlugin;
exports.default = _default;
