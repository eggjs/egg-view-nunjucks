'use strict';

const path = require('path');
const nunjucks = require('nunjucks');
const FileLoader = require('./file_loader');
const createHelper = require('./helper');

const LOAD_FILTER = Symbol('NunjucksEnvironment#loadFilter');

/**
 * Extend nunjucks environment, see {@link https://mozilla.github.io/nunjucks/api.html#environment}
 */
class NunjucksEnvironment extends nunjucks.Environment {

  constructor(app) {
    const fileLoader = new FileLoader(app);
    super(fileLoader, app.config.nunjucks);

    this.app = app;

    this[LOAD_FILTER]();

    // monkey patch `escape` with `app.helper.escape` provided by `egg-security` for better performance
    nunjucks.lib.escape = app.Helper.prototype.escape;

    this.ViewHelper = createHelper(app, this.filters);
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
      for (const name of Object.keys(filters)) {
        this.addFilter(name, filters[name]);
      }
    }
  }
}

module.exports = NunjucksEnvironment;
