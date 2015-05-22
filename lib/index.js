"use strict";

var Path = require("path");
var glob = require("glob");

function UnusedFilesWebpackPlugin (_options_) {
  var options = this.options = _options_ || {};
  options.pattern = options.pattern || "**/*.*";

  var globOptions = this.globOptions = options.globOptions || {};
  globOptions.ignore = "node_modules/**/*";
}

UnusedFilesWebpackPlugin.prototype.apply = function(compiler) {
  var fn = this._applyAfterEmit.bind(this, compiler);
  compiler.plugin("after-emit", fn);
};

UnusedFilesWebpackPlugin.prototype._applyAfterEmit = function(compiler, compilation, done) {
  var globOptions = this.globOptions;
  if (null == globOptions.cwd) {
    globOptions = Object.create(this.globOptions, {
      cwd: {
        value: compiler.context,
      },
    });
  }

  glob(this.options.pattern, globOptions, onGlobResult);

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

        compilation.warnings.push(new Error(errmsg));
      }
    }
    done();
  }
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
