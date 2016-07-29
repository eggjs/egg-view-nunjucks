'use strict';

module.exports = app => {
  const viewEngine = app.viewEngine;

  class ViewHelper extends app.Helper {
    // 防止 shtml sjs surl 处理过的字符串再被 escape，就不需要 `safe(sjs(foo))`
    shtml(str) {
      return this.safe(super.shtml(str));
    }

    surl(str) {
      return this.safe(super.surl(str));
    }

    sjs(str) {
      return this.safe(super.sjs(str));
    }

    /**
     * 生成隐藏的 CSRF 的 input 输入框，用于表单。
     * @method Helper#csrfTag
     * @example
     * ```html
     * <input type="hidden" name="_csrf" value="..." />
     * ```
     * @return {String} CSRF Tag 的 HTML 标签
     */
    csrfTag() {
      return this.safe(`<input type="hidden" name="_csrf" value="${this.ctx.csrf}" />`);
    }
  }

  // 让 Helper 里面包含 nunjucks 内置的 Filter 方法
  for (const filterName in viewEngine.filters) {
    if (ViewHelper.prototype[filterName] === undefined) {
      ViewHelper.prototype[filterName] = viewEngine.filters[filterName];
    }
  }

  return ViewHelper;
};
