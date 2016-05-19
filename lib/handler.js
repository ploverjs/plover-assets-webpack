'use strict';


const pathUtil = require('path');
const webpack = require('webpack');
const fs = require('mz/fs');
const pathToRegexp = require('path-to-regexp');
const getAnnotation = require('get-annotation');
const fmt = require('output-formatter');


const debug = require('debug')('plover-assets-webpack:handler');


module.exports = PloverAssetsHandlerWebpack;


function* PloverAssetsHandlerWebpack(path, source, info, options) {
  const settings = options.settings;

  if (!shouldCompile(path, info, settings)) {
    return false;
  }

  if (!getAnnotation(source, 'webpack.entry')) {
    if (settings.env === 'development') {
      console.warn(fmt.red(`missing annotation @webpack.entry in ${path} for webpack compiling`));    // eslint-disable-line
    }
    return false;
  }

  const config = loadWebpackConfig(path, info, settings);
  config.entry = path;
  config.output = Object.assign({}, config.output, {
    path: getOutputDir(info, settings),
    filename: pathUtil.basename(path)
  });

  debug('compile, path: %s\nconfig: %o', path, config);

  const work = new Promise((resolve, reject) => {
    webpack(config, (e, o) => {
      if (o && o.hasErrors()) {
        e = new Error(o.toJson().errors.join('\n'));
      }
      e ? reject(e) : resolve(o);
    });
  });

  yield work;

  const outpath = pathUtil.join(config.output.path, config.output.filename);
  return yield fs.readFile(outpath, 'utf-8');
}



function getOutputDir(info, settings) {
  return pathUtil.join(settings.applicationRoot, 'tmp', 'webpack', info.name);
}


/*
 * 判断是否需要使用webpack编译此资源文件
 */
function shouldCompile(path, info, settings) {
  // 如果设置了webpack，则以配置为准
  if (info.webpack || info.webpack === false) {
    return !!info.webpack;
  }

  // 否则由应用配置决定
  const config = settings.webpack || {};
  const match = config.match || [];
  const rules = match.map(rule => {
    if (typeof rule === 'string') {
      rule = pathToRegexp(rule);
    }
    return rule;
  });

  const rpath = pathUtil.relative(settings.applicationRoot, path);
  return rules.some(rule => rule.test(rpath));
}


function loadWebpackConfig(path, info, settings) {
  const o = {};
  let webpackConfigPath = null;
  try {
    webpackConfigPath = require.resolve(pathUtil.join(info.path, 'webpack.config'));
  } catch (e) {
    // ignore
  }

  // 模块如果配置了webpack.config，则以模块的配置为准
  // 否则使用应用配置
  if (webpackConfigPath) {
    Object.assign(o, require(webpackConfigPath));
  } else {
    Object.assign(o, settings.webpack);
  }

  return o;
}

