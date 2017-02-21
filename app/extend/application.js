'use strict';

const VIEW_ENGINE = Symbol('app#ViewEngine');
const engine = require('../../lib/engine');

module.exports = {

  /**
   * nunjucks environment
   * @member {Object} Application#nunjucks
   * @see https://mozilla.github.io/nunjucks/api.html#environment
   */
  get nunjucks() {
    if (!this[VIEW_ENGINE]) {
      this[VIEW_ENGINE] = engine(this);
    }
    return this[VIEW_ENGINE];
  },

};
