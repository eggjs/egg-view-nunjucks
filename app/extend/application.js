'use strict';

const VIEW_ENGINE = Symbol('app#ViewEngine');
const VIEW_HELPER = Symbol('app#ViewHelper');
const helper = require('../../lib/helper');
const engine = require('../../lib/engine');

module.exports = {

  /**
   * nunjucks environment
   * @member {Object} Application#viewEngine
   * @see https://mozilla.github.io/nunjucks/api.html#environment
   */
  get viewEngine() {
    if (!this[VIEW_ENGINE]) {
      this[VIEW_ENGINE] = engine(this);
    }
    return this[VIEW_ENGINE];
  },

  /**
   * view helper
   * @member {Object} Application#ViewHelper
   */
  get ViewHelper() {
    if (!this[VIEW_HELPER]) {
      this[VIEW_HELPER] = helper(this, this.viewEngine.filters);
    }
    return this[VIEW_HELPER];
  },
};
