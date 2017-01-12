'use strict';

const path = require('path');

module.exports = appInfo => {
  const config = {};

  /**
   * View options
   * @member Config#view
   * @property {String} dir - full path of template dir, support multiple path by using comma, defaults to `{app_root}/app/view`.
   * @property {Boolean} cache - whether cache template, default to `true` except `false` at local env.
   */
  config.view = {
    dir: path.join(appInfo.baseDir, 'app/view'),
    cache: true,
  };

  return config;
};
