'use strict';

module.exports = (app, buildInFilters) => {
  class ViewHelper extends app.Helper {
    // wrap `shtml/sjs/surl`, so you don't need `safe(sjs(foo))` to prevent unexpected escape
    shtml(str) {
      return this.safe(super.shtml(str));
    }

    surl(str) {
      return this.safe(super.surl(str));
    }

    sjs(str) {
      return this.safe(super.sjs(str));
    }

    // buildInFilters.escape is wrapped with `safe`
    escape(str) {
      return this.safe(buildInFilters.escape(str));
    }

    /**
     * get hidden filed for `csrf`
     * @return {String} html string
     */
    csrfTag() {
      return this.safe(`<input type="hidden" name="_csrf" value="${this.ctx.csrf}" />`);
    }
  }

  // fill view helper with nunjucks build-in filters
  for (const key in buildInFilters) {
    if (ViewHelper.prototype[key] == null) {
      ViewHelper.prototype[key] = buildInFilters[key];
    }
  }

  return ViewHelper;
};
