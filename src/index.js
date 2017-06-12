import {
  join as joinPath,
} from "path";

import {
  default as glob,
} from "glob";

export class UnusedFilesWebpackPlugin {
  constructor(options = {}) {
    this.options = {
      pattern: `**/*.*`,
      ...options,
      failOnUnused: options.failOnUnused === true,
    };

    this.globOptions = {
      ignore: `node_modules/**/*`,
      ...options.globOptions,
    };
  }

  apply(compiler) {
    compiler.plugin(`after-emit`, (compilation, done) =>
      this._applyAfterEmit(compiler, compilation, done)
    );
  }

  _applyAfterEmit(compiler, compilation, done) {
    const globOptions = this._getGlobOptions(compiler);
    const fileDepsMap = this._getFileDepsMap(compilation);
    const absolutePathResolver = it => joinPath(globOptions.cwd, it);
    const errorArray = this.options.failOnUnused ?
      compilation.errors :
      compilation.warnings;

    const handleError = err => {
      if (this.options.failOnUnused && compilation.bail) {
        return done(err);
      }

      errorArray.push(err);
      return done();
    };

    glob(this.options.pattern, globOptions, (err, files) => {
      if (err) {
        return handleError(err);
      }
      const unused = files.filter(filepath =>
        !(absolutePathResolver(filepath) in fileDepsMap)
      );
      if (unused.length === 0) {
        return done();
      }
      const error = new Error(`
UnusedFilesWebpackPlugin found some unused files:
${unused.join(`\n`)}`);

      return handleError(error);
    });
  }

  _getGlobOptions(compiler) {
    return {
      cwd: compiler.context,
      ...this.globOptions,
    };
  }

  _getFileDepsMap(compilation) {
    const fileDepsBy = compilation.fileDependencies.reduce((acc, usedFilepath) => {
      acc[usedFilepath] = usedFilepath;
      return acc;
    }, {});

    const { assets } = compilation;
    Object.keys(assets).forEach(assetRelpath => {
      const existsAt = assets[assetRelpath].existsAt;
      fileDepsBy[existsAt] = existsAt;
    });
    return fileDepsBy;
  }
}

export default UnusedFilesWebpackPlugin;
