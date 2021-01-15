'use strict';
const path = require('path');
const fs = require('fs');

function hackRender(engine) {
  // const originRender = engine.render.bind(engine);
  const originRenderString = engine.renderString.bind(engine);

  // engine.render = function(name, context, callback) {
  //   originRender(name, context, function(err, html) {
  //     if (err) {
  //       return callback(err);
  //     }
  //     return callback(html);
  //   });
  // };

  engine.renderString = function(str, context, cb) {
    str = originRenderString(str, context, function(err, html) {
      if (err) {
        return cb(err);
      }
      return cb(html);
    });
  };
}

module.exports = app => {
  app.get('/', function* () {
    yield this.render('home.tpl', { user: 'egg' });
  });

  const engine = app.nunjucks;

  app.get('/string', function* () {
    hackRender(engine);
    this.body = yield this.renderString('hi, {{ user }}', { user: 'egg' }, {
      viewEngine: 'nunjucks',
    });
  });

  app.get('/string_options', function* () {
    this.body = yield this.renderString(
      fs.readFileSync(path.resolve(__dirname, './view/layout.tpl')).toString(),
      { user: 'egg' },
      { path: path.resolve(__dirname, './view/layout.tpl') }
    );
  });

  app.get('/inject', function* () {
    yield this.render('inject.tpl', { user: 'egg' });
  });

  app.get('/filter', function* () {
    this.body = yield this.renderString('{{ user | hello }}', { user: 'egg' });
  });

  app.get('/filter/include', function* () {
    yield this.render('include-test.tpl', { list: [ 'egg', 'yadan' ] });
  });

  app.get('/not_found', function* () {
    try {
      yield this.render('not_found.tpl', {
        user: 'egg',
      });
    } catch (e) {
      this.status = 500;
      this.body = e.toString();
    }
  });

  app.get('/locals', function* () {
    this.locals = { b: 'ctx' };
    this.body = yield this.renderString('{{ a }}, {{ b }}, {{ c }}', { c: 'locals' });
  });


  app.get('/error_string', function* () {
    try {
      this.body = yield this.renderString('{{a');
    } catch (err) {
      this.status = 500;
      this.body = err;
    }
  });
};
