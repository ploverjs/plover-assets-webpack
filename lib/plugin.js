'use strict';


module.exports = function(app) {
  const handler = require('./handler');
  app.ploverAssetsHandler.add('js', '.js', handler);
};

