import path from "path";
import nativeGlob from "glob";
import promisify from "util.promisify";

const glob = promisify(nativeGlob);

function globOptionsWith(compiler, globOptions) {
  return {
    cwd: compiler.context,
    ...globOptions
  };
}

function getFileDepsMap(compilation) {
  const fileDepsBy = compilation.fileDependencies.reduce(
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

    const files = await glob(plugin.options.pattern, globOptions);
    const unused = files.filter(
      it => !fileDepsMap[path.join(globOptions.cwd, it)]
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

export class UnusedFilesWebpackPlugin {
  constructor(options = {}) {
    this.options = {
      pattern: `**/*.*`,
      ...options,
      failOnUnused: options.failOnUnused === true
    };

    this.globOptions = {
      ignore: `node_modules/**/*`,
      ...options.globOptions
    };
  }

  apply(compiler) {
    compiler.plugin(`after-emit`, (compilation, done) =>
      applyAfterEmit(compiler, compilation, this).then(done, done)
    );
  }
}

export default UnusedFilesWebpackPlugin;
