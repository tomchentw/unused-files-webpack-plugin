"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.UnusedFilesWebpackPlugin = void 0;

var _path = _interopRequireDefault(require("path"));

var _warning = _interopRequireDefault(require("warning"));

var _globAll = _interopRequireDefault(require("glob-all"));

var _util = _interopRequireDefault(require("util.promisify"));

var applyAfterEmit = (function() {
  var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(compiler, compilation, plugin) {
      var globOptions, fileDepsMap, files, unused, errorsList;
      return regeneratorRuntime.wrap(
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

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(_next, _throw);
        }
      }
      function _next(value) {
        step("next", value);
      }
      function _throw(err) {
        step("throw", err);
      }
      _next();
    });
  };
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
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

var globAll = (0, _util.default)(_globAll.default);

function globOptionsWith(compiler, globOptions) {
  return _extends(
    {
      cwd: compiler.context
    },
    globOptions
  );
}

function getFileDepsMap(compilation) {
  var fileDepsBy = []
    .concat(_toConsumableArray(compilation.fileDependencies))
    .reduce(function(acc, usedFilepath) {
      acc[usedFilepath] = true;
      return acc;
    }, {});
  var assets = compilation.assets;
  Object.keys(assets).forEach(function(assetRelpath) {
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

      _classCallCheck(this, UnusedFilesWebpackPlugin);

      (0, _warning.default)(
        !options.pattern,
        '\n"options.pattern" is deprecated and will be removed in v4.0.0.\nUse "options.patterns" instead, which supports array of patterns and exclude pattern.\nSee https://www.npmjs.com/package/glob-all#notes\n'
      );
      this.options = _extends({}, options, {
        patterns: options.patterns || options.pattern || ["**/*.*"],
        failOnUnused: options.failOnUnused === true
      });
      this.globOptions = _extends(
        {
          ignore: "node_modules/**/*"
        },
        options.globOptions
      );
    }

    _createClass(UnusedFilesWebpackPlugin, [
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
