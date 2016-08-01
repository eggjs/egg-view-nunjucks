'use strict';

const VIEW_ENGINE = Symbol('app#ViewEngine');
const VIEW_HELPER = Symbol('app#ViewHelper');
const View = require('../../lib/view');
const helper = require('../../lib/helper');
const engine = require('../../lib/engine');

module.exports = {
  // mount `View` class to app
  // egg will create an instance to `ctx.view` at every request
  // you can use `this.render` at controller
  get [Symbol.for('egg#view')]() {
    return View;
  },

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
