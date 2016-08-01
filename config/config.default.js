'use strict';

const path = require('path');

module.exports = function(appInfo) {
  const exports = {};

  /**
   * View options
   * @member Config#view
   * @property {String} loadpath - full path of templates, defaults to `app/views`, multiple paths are supported when paths separated by commas.
   * @property {Boolean} cache - whether cache template, default to true but false at local env.
   */
  exports.view = {
    loadpath: path.join(appInfo.baseDir, 'app/views'),
    cache: true,
  };

  return exports;
};
