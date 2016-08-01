'use strict';

const nunjucks = require('nunjucks');

module.exports = app => {
  const config = app.config.view;
  const viewPaths = config.loadpath.split(',');

  const options = Object.assign({
    noCache: config.cache !== true,
  }, config);
  delete options.cache;

  const engine = new nunjucks.Environment(getFileLoader(options), options);

  engine.nunjucks = nunjucks;

  /**
   * clean template cache
   * @param {String} [target] - full path or template name
   * @return {Number} clean count
   */
  engine.cleanCache = target => {
    let count = 0;
    for (const loader of engine.loaders) {
      if (target) {
        // support full path && tpl name
        const name = loader.pathsToNames[target] || target;
        if (loader.cache[name]) {
          count++;
          loader.cache[name] = null;
        }
      } else {
        for (const name in loader.cache) {
          count++;
          loader.cache[name] = null;
        }
      }
    }
    return count;
  };

  /**
   * get security fileloader, will auto inject csrf && nonce
   * @param {Object} options - see http://mozilla.github.io/nunjucks/api.html#loader
   * @return {nunjucks.FileSystemLoader} FileSystemLoader
   */
  function getFileLoader(options) {
    const fileLoader = new nunjucks.FileSystemLoader(viewPaths, options);
    const originFn = fileLoader.getSource;
    fileLoader.getSource = name => {
      const result = originFn.call(fileLoader, name);
      if (result) {
        const config = app.config.security;
        // auto inject `_csrf` attr to form field, rely on `app.injectCsrf` provided by `security` plugin
        if (!(config.csrf === false || config.csrf.enable === false)) {
          result.src = app.injectCsrf(result.src);
        }
        // auto inject `nonce` attr to script tag, rely on `app.injectNonce` provided by `security` plugin
        if (!(config.csp === false || config.csp.enable === false)) {
          result.src = app.injectNonce(result.src);
        }
      }
      return result;
    };
    return fileLoader;
  }

  return engine;
};
