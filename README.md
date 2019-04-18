# unused-files-webpack-plugin
> Glob all files that are not compiled by webpack under webpack's context

[![Version][npm-image]][npm-url] [![Travis CI][travis-image]][travis-url]

## Installation

```bash
npm i --save-dev unused-files-webpack-plugin
```

## Requirements

* Node `^8.9.4`
* Webpack `^4.0.0`


## Usage

### `webpack.config.js`

```js
const { UnusedFilesWebpackPlugin } = require("unused-files-webpack-plugin");

module.exports = {
  plugins: [
    new UnusedFilesWebpackPlugin(options),
  ],
};
```


## Options

```js
new UnusedFilesWebpackPlugin(options)
```

### options.patterns

The (array of) pattern(s) to glob all files within the context.

* Default: `["**/*.*"]`
* Directly pass to [`glob-all(patterns)`](https://github.com/jpillora/node-glob-all#api)

### options.failOnUnused

Emit _error_ instead of _warning_ in webpack compilation result.

* Default: `false`
* Explicitly set it to `true` to enable this feature

### options.globOptions

The options object pass to second parameter of `glob-all`.

* Default: `{ignore: "node_modules/**/*"}`
* Directly pass to [`glob-all(pattern, globOptions)`](https://github.com/jpillora/node-glob-all#api), which then pass to [`glob(…, globOptions)`](https://github.com/isaacs/node-glob#options)

#### globOptions.ignore

Ignore pattern for glob. Can be a String or an Array of String.

* Default: `"node_modules/**/*"`
* Pass to: [`options.ignore`](https://github.com/isaacs/node-glob#options)

#### globOptions.cwd

Current working directory for glob. If you don't set explicitly, it defaults to the `context` specified by your webpack compiler at runtime.

* Default: `webpackCompiler.context`
* Pass to: [`options.cwd`](https://github.com/isaacs/node-glob#options)
* See also: [`context` in webpack](https://webpack.js.org/configuration/entry-context/#context)


## Contributing

[![devDependency Status][david-dm-image]][david-dm-url]

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


[npm-image]: https://img.shields.io/npm/v/unused-files-webpack-plugin.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/unused-files-webpack-plugin
[travis-image]: https://img.shields.io/travis/tomchentw/unused-files-webpack-plugin.svg?style=flat-square
[travis-url]: https://travis-ci.org/tomchentw/unused-files-webpack-plugin

[david-dm-image]: https://img.shields.io/david/dev/tomchentw/unused-files-webpack-plugin.svg?style=flat-square
[david-dm-url]: https://david-dm.org/tomchentw/unused-files-webpack-plugin#info=devDependencies

