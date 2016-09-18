'use strict';

const path = require('path');
const nunjucks = require('nunjucks');

module.exports = app => {
  const coreLogger = app.loggers.coreLogger;
  const config = app.config.view;
  const viewPaths = config.dir.split(',').map(dir => dir.trim());

  coreLogger.info('[egg:plugin:view] loading templates from %j', viewPaths);

  const options = Object.assign({
    noCache: config.cache !== true,
  }, config);
  delete options.cache;

  const fileLoader = getFileLoader(viewPaths, options);
  const engine = new nunjucks.Environment(fileLoader, options);

  engine.nunjucks = nunjucks;

  // monkey patch `escape` with `app.helper.escape` provided by `egg-security` for better performance
  nunjucks.lib.escape = app.Helper.prototype.escape;

  // filter loader
  loadFilter();

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
   * @param {Array} searchPaths - paths to look for templates
   * @param {Object} options - see http://mozilla.github.io/nunjucks/api.html#loader
   * @return {nunjucks.FileSystemLoader} FileSystemLoader
   */
  function getFileLoader(searchPaths, options) {
    const fileLoader = new nunjucks.FileSystemLoader(searchPaths, options);
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

  // load `app/extend/filter.js` from app/framework/plugin into nunjucks
  function loadFilter() {
    const dirs = app.loader.getLoadUnits().map(unit => unit.path);
    for (const dir of dirs) {
      const filters = app.loader.loadFile(path.join(dir, 'app/extend/filter.js')) || {};
      for (const name of Object.keys(filters)) {
        engine.addFilter(name, filters[name]);
      }
    }
  }

  return engine;
};
