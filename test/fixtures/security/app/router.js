'use strict';

const stripIndent = require('common-tags').stripIndent;

module.exports = app => {
  app.get('/xss', function* () {
    const tpl = stripIndent`
      {{ url }}
      {{ url | safe }}
      {{ helper.surl(url) }}
      {{ html }}
    `;
    this.body = yield this.renderString(tpl, {
      url: 'http://eggjs.github.io/index.html?a=<div>',
      html: '<div id="a">\'a\'</div>',
    });
  });

  app.get('/sjs', function* () {
    const tpl = stripIndent`
      var foo = "{{ helper.sjs(foo) }}";
    `;
    this.body = yield this.renderString(tpl, {
      foo: '"hello"',
    });
  });

  app.get('/shtml', function* () {
    const tpl = stripIndent`
      {{helper.shtml(foo)}}
    `;
    this.body = yield this.renderString(tpl, {
      foo: '<img onload="xx"><h1>foo</h1>',
    });
  });

  app.get('/form_csrf', function* () {
    yield this.render('form_csrf.tpl');
  });

  app.get('/nonce', function* () {
    yield this.render('nonce.tpl');
  });

  app.get('/escape', function* () {
    yield this.render('escape.tpl', {
      foo: '<html>',
      arr: [ '<p>arr</p>' ],
      obj: { toString() { return '<p>obj</p>'; } },
    });
  });

  app.get('/sandbox', function* () {
    const tpl = this.query.tpl;
    const name = this.query.name;
    this.body = yield this.renderString(`hi, ${tpl}`, { name });
  });

  app.get('/sandbox/require', function* () {
    const tpl = '{{require(\'os\').platform()}}';
    const locals = { name: 'bar', require: module.require };
    this.body = yield this.renderString(tpl, locals);
  });

  app.get('/sandbox/require2', function* () {
    const tpl = '{{foo(\'os\').platform()}}';
    const locals = { name: 'bar', foo: module.require };
    this.body = yield this.renderString(tpl, locals);
  });

  app.get('/sandbox/module.request', function* () {
    const tpl = '{{m.require(\'os\').platform()}}';
    const locals = { name: 'bar', m: module };
    this.body = yield this.renderString(tpl, locals);
  });

  app.get('/sandbox/module.request2', function* () {
    const tpl = '{{m.f.b.require(\'os\').platform()}}';
    const locals = { name: 'bar', m: { f: { b: module } } };
    this.body = yield this.renderString(tpl, locals);
  });

  app.get('/sandbox/process.mainModule.require', function* () {
    const tpl = '{{m.f.b.require(\'os\').platform()}}';
    const locals = { name: 'bar', m: { f: { b: { require: process.mainModule.require } } } };
    this.body = yield this.renderString(tpl, locals);
  });

  app.get('/sandbox/fn.module.require', function* () {
    const tpl = '{{foo(\'os\').platform()}}';
    const locals = {
      name: 'bar',
      foo(f) {
        return module.require(f);
      },
    };
    this.body = yield this.renderString(tpl, locals);
  });
};
