"use strict";

var Path = require("path");

var objectAssign = require("object-assign");
var glob = require("glob");

function UnusedFilesWebpackPlugin (_options_) {
  var options = this.options = _options_ || {};
  options.pattern = options.pattern || "**/*.*";
  options.failOnUnused = options.failOnUnused === true;

  var globOptions = this.globOptions = objectAssign({
    ignore: "node_modules/**/*"
  }, options.globOptions);
}

UnusedFilesWebpackPlugin.prototype.apply = function(compiler) {
  var fn = this._applyAfterEmit.bind(this, compiler);
  compiler.plugin("after-emit", fn);
};

UnusedFilesWebpackPlugin.prototype._applyAfterEmit = function(compiler, compilation, done) {
  var globOptions = this._getGlobOptions(compiler);

  glob(this.options.pattern, globOptions, onGlobResult.bind(this));

  var fileDepsMap = this._getFileDepsMap(compilation);

  var absolutePathResolver = Path.join.bind(Path, globOptions.cwd);

  function onGlobResult (err, files) {
    if (err) {
      compilation.errors.push(err);
    } else {
      var unused = files.filter(function (filepath) {
        return !(absolutePathResolver(filepath) in fileDepsMap);
      });
      if (unused.length) {
        var errmsg = "UnusedFilesWebpackPlugin found some unused files:\n" + unused.join("\n");
        var error = new Error(errmsg);

        if (this.options.failOnUnused) {
          compilation.errors.push(error);
        } else {
          compilation.warnings.push(error);
        }
      }
    }
    done();
  }
};

UnusedFilesWebpackPlugin.prototype._getGlobOptions = function (compiler) {
  var globOptions = objectAssign({}, this.globOptions);
  if (null == globOptions.cwd) {
    globOptions.cwd = compiler.context;
  }
  return globOptions;
};

UnusedFilesWebpackPlugin.prototype._getFileDepsMap = function (compilation) {
  var fileDepsBy = {};
  compilation.fileDependencies.forEach(function (usedFilepath) {
    fileDepsBy[usedFilepath] = usedFilepath;
  });

  Object.keys(compilation.assets).forEach(function (assetRelpath) {
    var existsAt = this[assetRelpath].existsAt;
    fileDepsBy[existsAt] = existsAt;
  }, compilation.assets);

  return fileDepsBy;
};

module.exports = UnusedFilesWebpackPlugin;
