# plover-assets-webpack


[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]


【插件】使用webpack对模块的前端JS资源进行编译。

## Configuration
### 资源匹配规则
 - 设置当前模块中**package.json**文件的**webpack**字段为`boolean`，表示是否使用webpack编译此模块资源文件：

```json
{
  "name": "myModule",
  "version": "0.1.0",
  "webpack": true
}
```

 - 也可以通过当前应用的**plover**配置信息中为**webpack**添加**match**匹配规则：

```js
// config/plover.js
module.exports = {
  applicationRoot: pathUtil.join(__dirname, '..'),
  configRoot: __dirname,
  webpack: {
     match: ['modules/**/*.js'],  // 配置需要webpack编译的资源文件匹配规则
  },
  // ...
}
```

**Note：**

如果两者都配置了匹配规则，则以当前模块的匹配规则为准。

### webpack配置信息
 1. 当前模块根目录是否存在**webpack.config**文件，若存在，则采用此配置文件信息；
 2. 若不存在，则采用应用的**plover**配置信息中**webpack**字段的配置信息。



[npm-image]: https://img.shields.io/npm/v/plover-assets-webpack.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/plover-assets-webpack
[travis-image]: https://img.shields.io/travis/plover-modules/plover-assets-webpack/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/plover-modules/plover-assets-webpack
[coveralls-image]: https://img.shields.io/codecov/c/github/plover-modules/plover-assets-webpack.svg?style=flat-square
[coveralls-url]: https://codecov.io/github/plover-modules/plover-assets-webpack?branch=master

