# plover-assets-webpack


[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]


【插件】使用webpack对模块的前端JS资源进行编译。


## 使用说明

### 1. 安装插件和webpack

```
npm install --save plover-assets-webpack webpack
```

### 2. 配置

按约定应用的webpack配置存放在`config/webpack.js`。 模块可以有自己的webpack配置，一般用于通用模块。


应用webpack配置示例：

```js
module.exports = {
  // 配置对modules目录下的前端js文件进行编译
  match: ['modules/**/*.js'],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },

  plugins: []
};


// 编译时生效的插件
if (process.env.PLOVER_ASSETS_BUILD) {
  const webpack = require('webpack');
  module.exports.plugins = exports.webpack.plugins.concat([
    new webpack.optimize.UglifyJsPlugin()
  ]);
}
```

[npm-image]: https://img.shields.io/npm/v/plover-assets-webpack.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/plover-assets-webpack
[travis-image]: https://img.shields.io/travis/ploverjs/plover-assets-webpack/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/ploverjs/plover-assets-webpack
[coveralls-image]: https://img.shields.io/codecov/c/github/ploverjs/plover-assets-webpack.svg?style=flat-square
[coveralls-url]: https://codecov.io/github/ploverjs/plover-assets-webpack?branch=master

