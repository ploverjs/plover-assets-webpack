'use strict';


const pathUtil = require('path');
const fs = require('mz/fs');
const getAnnotation = require('get-annotation');

const debug = require('debug')('plover-assets-webpack:handler');


module.exports = PloverAssetsHandlerWebpack;


const cache = new Map();


function* PloverAssetsHandlerWebpack(path, source, info, options) {
  if (!getAnnotation(source, 'webpack.entry')) {
    return false;
  }

  let item = cache.get(path);
  if (!item) {
    const webpack = require('webpack');
    const config = loadWebpackConfig(path, info, options.settings);
    const compiler = webpack(config);
    const outpath = pathUtil.join(config.output.path, config.output.filename);
    item = { compiler: compiler, config: config, outpath: outpath };
    cache.set(path, item);
  }

  debug('compile, path: %s\nconfig: %o', path, item.config);
  const defer = new Promise((resolve, reject) => {
    item.compiler.run((e, o) => {
      if (o && o.hasErrors()) {
        e = new Error(o.toJson().errors.join('\n'));
      }
      e ? reject(e) : resolve(o);
    });
  });

  yield defer;

  return yield fs.readFile(item.outpath, 'utf-8');
}


function loadWebpackConfig(path, info, settings) {
  const configPath = (settings.assets || {}).webpackConfigPath ||
      pathUtil.join(settings.applicationRoot, 'config/webpack.config.js');

  const config = {};

  if (fs.existsSync(configPath)) {
    Object.assign(config, require(configPath));
  }

  config.entry = path;
  const outputDir = pathUtil.join(settings.applicationRoot, 'tmp', 'webpack', info.name);
  config.output = Object.assign({}, config.output, {
    path: outputDir,
    filename: pathUtil.basename(path)
  });

  return config;
}
