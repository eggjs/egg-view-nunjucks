'use strict';

const FileSystemLoader = require('nunjucks').FileSystemLoader;

/**
 * exnted nunjucks FileSystemLoader, will auto inject csrf && nonce
 */
class EggFileSystemLoader extends FileSystemLoader {

  /**
   * @constructor
   * @param {Application} app - application instance
   */
  constructor(app) {
    super(app.config.view.root, { noCache: app.config.nunjucks.noCache });
    this.app = app;
  }

  getSource(name) {
    const result = super.getSource(name);
    if (result) {
      const config = this.app.config.security;
      // auto inject `_csrf` attr to form field, rely on `app.injectCsrf` provided by `security` plugin
      if (!(config.csrf === false || config.csrf.enable === false)) {
        result.src = this.app.injectCsrf(result.src);
      }
      // auto inject `nonce` attr to script tag, rely on `app.injectNonce` provided by `security` plugin
      if (!(config.csp === false || config.csp.enable === false)) {
        result.src = this.app.injectNonce(result.src);
      }
    }
    return result;
  }
}

module.exports = EggFileSystemLoader;
