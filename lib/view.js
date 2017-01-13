'use strict';
const HELPER = Symbol('View#helper');

module.exports = class NunjucksView {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
  }

  render(name, locals) {
    return new Promise((resolve, reject) => {
      this.app.viewEngine.render(name, locals, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  renderString(tpl, locals) {
    return new Promise((resolve, reject) => {
      this.app.viewEngine.renderString(tpl, locals, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * view helper
   */
  get helper() {
    if (!this[HELPER]) {
      this[HELPER] = new this.app.ViewHelper(this.ctx);
    }
    return this[HELPER];
  }
};

