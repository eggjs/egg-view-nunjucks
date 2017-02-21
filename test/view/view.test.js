'use strict';

const path = require('path');
const request = require('supertest');
const mm = require('egg-mock');
const assert = require('assert');

describe('test/view/view.test.js', () => {
  let app;

  before(function* () {
    app = mm.app({
      baseDir: 'example',
      customEgg: path.join(__dirname, '../fixtures/framework'),
    });
    yield app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should enable', () => {
    assert(app.nunjucks);
    assert(app.nunjucks.nunjucks);
    assert(app.nunjucks.app);
  });

  it('should render string', function* () {
    yield request(app.callback())
      .get('/string')
      .expect(200)
      .expect(/hi, egg/);
  });

  it('should render template', function* () {
    yield request(app.callback())
      .get('/')
      .expect(200)
      .expect(/hi, egg/);
  });

  it('should render template not found', function* () {
    yield request(app.callback())
      .get('/not_found')
      .expect(500)
      .expect(/Can\'t find not_found.tpl from /);
  });

  it('should render error', function* () {
    yield request(app.callback())
      .get('/error_string')
      .expect(500)
      .expect(/Template render error/i);
  });

  it('should inject helper/ctx/request', function* () {
    yield request(app.callback())
      .get('/inject')
      .expect(200)
      .expect(/ctx: true/)
      .expect(/request: true/)
      .expect(/helper: true/)
      .expect(/helperFn: true/);
  });

  it('should load filter.js', function* () {
    yield request(app.callback())
      .get('/filter')
      .expect(200)
      .expect(/hi, egg/);
  });

  it('should extend locals', function* () {
    yield request(app.callback())
      .get('/locals')
      .expect(200)
      .expect(/app, ctx, locals/);
  });

  describe('view disable', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir: 'view-disabled',
        customEgg: path.join(__dirname, '../fixtures/framework'),
      });
      return app.ready();
    });
    after(() => app.close());

    it('should disable view', function* () {
      assert(!app.nunjucks);
    });
  });

  describe('multi-dir', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir: 'multi-dir',
        customEgg: path.join(__dirname, '../fixtures/framework'),
      });
      return app.ready();
    });
    after(() => app.close());

    it('should support multi-dir config', function* () {
      yield request(app.callback()).get('/view').expect(200, 'hi, egg');
      yield request(app.callback()).get('/ext').expect(200, 'hi, ext egg');
    });
  });
});
