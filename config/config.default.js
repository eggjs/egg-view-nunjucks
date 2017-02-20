'use strict';

module.exports = {

  /**
   * View options
   * @member Config#view
   * @property {String} dir - full path of template dir, support multiple path by using comma, defaults to `{app_root}/app/view`.
   * @property {Boolean} cache - whether cache template, default to `true` except `false` at local env.
   */
  nunjucks: {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: false,
    lstripBlocks: false,
    cache: true,
  },

};
