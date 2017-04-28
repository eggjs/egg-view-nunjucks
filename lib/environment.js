'use strict';

const path = require('path');
const nunjucks = require('nunjucks');
const FileLoader = require('./file_loader');
const createHelper = require('./helper');
const co = require('co');
const is = require('is-type-of');

const LOAD_FILTER = Symbol('NunjucksEnvironment#loadFilter');
const FILTER_WRAPPER = Symbol('NunjucksEnvironment#filterWrapper');
/**
 * Extend nunjucks environment, see {@link https://mozilla.github.io/nunjucks/api.html#environment}
 */
class NunjucksEnvironment extends nunjucks.Environment {

  constructor(app) {
    const fileLoader = new FileLoader(app);
    super(fileLoader, app.config.nunjucks);

    this.app = app;

    // monkey patch `escape` with `app.helper.escape` provided by `egg-security` for better performance
    nunjucks.lib.escape = app.Helper.prototype.escape;

    this.ViewHelper = createHelper(app, this.filters);

    this[LOAD_FILTER]();
  }

  /**
   * clean template cache
   * @param {String} [name] - full path
   * @return {Number} clean count
   */
  cleanCache(name) {
    let count = 0;
    for (const loader of this.loaders) {
      if (name) {
        // support full path && tpl name
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
  }

  // load `app/extend/filter.js` from app/framework/plugin into nunjucks
  [LOAD_FILTER]() {
    for (const unit of this.app.loader.getLoadUnits()) {
      const filterPath = path.join(unit.path, 'app/extend/filter.js');
      const filters = this.app.loader.loadFile(filterPath) || {};
      for (const key of Object.keys(filters)) {
        this.addFilter(key, this[FILTER_WRAPPER](filters[key]), true);
        // add filters to helper
        if (this.ViewHelper.prototype[key] == null) {
          this.ViewHelper.prototype[key] = filters[key];
        }
      }
    }
  }

  [FILTER_WRAPPER](filterFn) {
    return (...args) => {
      if (!is.function(args[args.length - 1])) {
        return filterFn(...args);
      }

      // use Promise.resolve instead co, when support node native async/await
      const callback = args.pop();
      co(filterFn(...args))
        .then(val => callback(null, val))
        .catch(err => callback(err, null));
    };
  }
}

module.exports = NunjucksEnvironment;
