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

    this.patchNunjucks();

    this.ViewHelper = createHelper(app, this.filters);
  }

  patchNunjucks() {
    // monkey patch `escape` with `app.helper.escape` provided by `egg-security` for better performance
    nunjucks.lib.escape = this.app.Helper.prototype.escape;

    // TODO: Monkey Patch, remove this after nunjucks fixed
    // http://disse.cting.org/2016/08/02/2016-08-02-sandbox-break-out-nunjucks-template-engine
    nunjucks.runtime.memberLookup = function(obj, val) {
      if (obj == null) return null;
      if (val === 'constructor' || val === 'prototype') return null;
      // forbidden __xxxx__ properties
      if (/^__\w{1,100}__$/.test(val)) return null;

      const member = obj[val];
      if (typeof member === 'function') {
        // forbidden require
        if (member === module.require) {
          return null;
        }
        return function() {
          return member.apply(obj, arguments);
        };
      }
      return member;
    };

    nunjucks.runtime.callWrap = function(obj, name, context, args) {
      if (!obj) {
        throw new Error('Unable to call `' + name + '`, which is undefined or falsey');
      }
      if (typeof obj !== 'function') {
        throw new Error('Unable to call `' + name + '`, which is not a function');
      }
      // forbidden require
      if (obj === module.require) {
        throw new Error('Unable to call `' + name + '`, which is an invalid function');
      }

      return obj.apply(context, args);
    };
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
        /* istanbul ignore else */
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
        this.addFilter(key, filters[key]);
      }
    }
  }
}

module.exports = NunjucksEnvironment;
