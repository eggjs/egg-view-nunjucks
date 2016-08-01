'use strict';

const path = require('path');

module.exports = function(appInfo) {
  const exports = {};

  /**
   * View options
   * @member Config#view
   * @property {String} loadpath - full path of template, default to `app/views`, support multi with comma
   * @property {Boolean} cache - whether cache template, default to true but false at local env.
   */
  exports.view = {
    loadpath: path.join(appInfo.baseDir, 'app/views'),
    cache: true,
  };

  return exports;
};
