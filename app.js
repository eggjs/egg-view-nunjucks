'use strict';

const nunjucks = require('nunjucks');
const path = require('path');

const View = require('./lib/view');
const helper = require('./lib/helper');

module.exports = app => {
  const coreLogger = app.loggers.coreLogger;
  const viewPaths = app.config.view.loadpath.split(',');
  coreLogger.info('[egg:plugin:view] loading templates from %j', viewPaths);

  const options = Object.assign({
    noCache: app.config.view.cache !== true,
  }, app.config.view);

  // 配置 nunjucks 的 env 实例
  app.viewEngine = new nunjucks.Environment(getFileLoader(options), options);

  /**
   * 暴露 nunjucks 方便自定义 tag 调用
   */
  app.viewEngine.nunjucks = nunjucks;

  // 挂载 View 类到 app 上
  // egg 将在每次请求的时候, 实例化一个 view 对象到 ctx.view
  // 在 controller 里面的 this.render 即 ctx.view.render
  app[Symbol.for('egg#view')] = View;

  // view 级别的 Helper, 避免污染
  app.ViewHelper = helper(app);

  // 加载 filter 文件
  loadFilter();

  // 获取安全的 fileloader
  function getFileLoader(options) {
    // 安全的加载模板文件, 会主动注入 csrf 和 nonce
    const fileLoader = new nunjucks.FileSystemLoader(viewPaths, options);
    const originFn = fileLoader.getSource;
    fileLoader.getSource = name => {
      const result = originFn.call(fileLoader, name);
      if (result) {
        const config = app.config.security;
        // form表单自动插入`_csrf`域, 依赖于security插件实现的app.injectCsrf方法
        // istanbul ignore else
        if (!(config.csrf === false || config.csrf.enable === false)) {
          result.src = app.injectCsrf(result.src);
        }
        // script标签自动插入`nonce`属性, 依赖于security插件实现的app.injectNonce方法
        // istanbul ignore else
        if (!(config.csp === false || config.csp.enable === false)) {
          result.src = app.injectNonce(result.src);
        }
      }
      return result;
    };
    return fileLoader;
  }

  // 加载各个应用/框架/插件下的 filter.js
  function loadFilter() {
    // 获取 egg 的所有加载目录，包括应用，框架，插件
    for (const dir of app.loader.loadDirs()) {
      // 加载 filter 文件
      const filters = app.loader.loadFile(path.join(dir, 'app/extend/filter.js')) || {};
      for (const name of Object.keys(filters)) {
        app.viewEngine.addFilter(name, filters[name]);
      }
    }
  }
};
