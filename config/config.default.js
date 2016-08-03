'use strict';

const path = require('path');

module.exports = function(appInfo) {
  const exports = {};

  /**
   * View options
   * @member Config#view
   * @property {String/Array} dir - full path of template dir, defaults to `{app_root}/app/views`.
   * @property {Boolean} cache - whether cache template, default to true except false at local env.
   */
  exports.view = {
    dir: path.join(appInfo.baseDir, 'app/views'),
    cache: true,
  };

  return exports;
};
