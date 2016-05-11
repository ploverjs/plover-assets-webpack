'use strict';


module.exports = PloverAssetsHandlerWebpack;


function* PloverAssetsHandlerWebpack(path, source, info, options) {
  return '/* compiled */\n' + source;
}

