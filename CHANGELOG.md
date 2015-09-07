<a name"1.3.0"></a>
## 1.3.0 (2015-09-07)


#### Features

* **options:** add failOnUnused to enable generating error ([7b7620d8](https://github.com/tomchentw/unused-files-webpack-plugin/commit/7b7620d8), closes [#3](https://github.com/tomchentw/unused-files-webpack-plugin/issues/3))


<a name"1.2.0"></a>
## 1.2.0 (2015-07-11)


#### Features

* **globOptions:** makes ignore option overidable ([6b630944](https://github.com/tomchentw/unused-files-webpack-plugin/commit/6b630944), closes [#1](https://github.com/tomchentw/unused-files-webpack-plugin/issues/1))


#### Breaking Changes

* globOptions.ignore is now overridable

    If you choose to override globOptions with new ignore option,
    make sure you'll include `node_modules/**/*` for the new ignore.

 ([6b630944](https://github.com/tomchentw/unused-files-webpack-plugin/commit/6b630944))


## 1.1.0 (2015-05-22)


#### Bug Fixes

* **UnusedFilesWebpackPlugin:**
  * use objectAssign for default values ([f8a2b6f2](https://github.com/tomchentw/unused-files-webpack-plugin/commit/f8a2b6f28825ee6e3898c9f4b60f3e6a22d55bcb))
  * include emitted assets in fileDepsMap ([896e8e23](https://github.com/tomchentw/unused-files-webpack-plugin/commit/896e8e233557de43618ad700b40ed773db73f691))


## 1.0.0 (2015-05-22)


#### Features

* **UnusedFilesWebpackPlugin:** use glob to select files ([f8e081e8](https://github.com/tomchentw/unused-files-webpack-plugin/commit/f8e081e835344820c419dc37162c8028af7ba3f9))

