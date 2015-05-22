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

  var fileDepsBy = compilation.fileDependencies.reduce(function (acc, usedFilepath) {
    acc[usedFilepath] = usedFilepath;
    return acc;
  }, {});
  var absolutePathResolver = Path.join.bind(Path, globOptions.cwd);

  function onGlobResult (err, files) {
    if (err) {
      compilation.errors.push(err);
    } else {
      var unused = files.filter(function (filepath) {
        return !(absolutePathResolver(filepath) in fileDepsBy);
      });
      if (unused.length) {
        var errmsg = "UnusedFilesWebpackPlugin found some unused files:\n" + unused.join("\n");

        compilation.warnings.push(new Error(errmsg));
      }
    }
    done();
  }
};


module.exports = UnusedFilesWebpackPlugin;
