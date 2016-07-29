'use strict';
const HELPER = Symbol('View#helper');

module.exports = class NunjucksView {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
    this.engine = this.app.viewEngine;
  }

  render(name, locals) {
    return new Promise((resolve, reject) => {
      // 调用 nunjucks 渲染
      this.engine.render(name, locals, function(err, result) {
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
      this.engine.renderString(tpl, locals, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * view 级别的 Helper, 避免污染
   */
  get helper() {
    if (!this[HELPER]) {
      this[HELPER] = new this.app.ViewHelper(this.ctx);
    }
    return this[HELPER];
  }
};

