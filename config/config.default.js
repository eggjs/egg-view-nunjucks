'use strict';

const path = require('path');

module.exports = function(antx) {
  const exports = {};

  /**
   * View options
   * @member Config#view
   * @property {String} loadpath - 应用完整模板文件加载路径顺序
   * @property {Boolean} cache - 是否缓存模板, 本地开发为 false
   */
  exports.view = {
    loadpath: path.join(antx.baseDir, 'app/views'),
    cache: true,
  };

  return exports;
};
