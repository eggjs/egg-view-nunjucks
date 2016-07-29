'use strict';

module.exports = function() {
  const exports = {};

  /**
   * View options
   * @member Config#view
   * @property {String} loadpath - 应用完整模板文件加载路径顺序
   * @property {Boolean} cache - 是否缓存模板, 本地开发为 false
   */
  exports.view = {
    cache: false,
  };

  return exports;
};
