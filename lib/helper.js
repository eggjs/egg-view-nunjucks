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

    // don't use `super.helper.escape` directly due to `SafeString` checking
    // see https://github.com/mozilla/nunjucks/blob/master/src/filters.js#L119
    // buildInFilters.escape is `nunjucks.filters.escape` which will call `nunjucks.lib.escape`
    // and `nunjucks.lib.escape` is overrided with `app.Helper.escape` at `lib/engine.js` for better performance
    escape(str) {
      return buildInFilters.escape(str);
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
