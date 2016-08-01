'use strict';

const path = require('path');
const View = require('./lib/view');
const helper = require('./lib/helper');
const engine = require('./lib/engine');

module.exports = app => {
  const coreLogger = app.loggers.coreLogger;
  const viewPaths = app.config.view.loadpath.split(',');
  coreLogger.info('[egg:plugin:view] loading templates from %j', viewPaths);

  // get nunjucks environment
  app.viewEngine = engine(app);

  // mount `View` class to app
  // egg will create an instance to `ctx.view` at every request
  // you can use `this.render` at controller
  app[Symbol.for('egg#view')] = View;

  app.ViewHelper = helper(app);

  // filter loader
  loadFilter();

  // load `app/extend/filters.js` from app/framework/plugin into nunjucks
  function loadFilter() {
    for (const dir of app.loader.loadDirs()) {
      const filters = app.loader.loadFile(path.join(dir, 'app/extend/filter.js')) || {};
      for (const name of Object.keys(filters)) {
        app.viewEngine.addFilter(name, filters[name]);
      }
    }
  }
};
