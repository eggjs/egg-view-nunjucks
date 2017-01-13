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
      customEgg: path.join(__dirname, '../../node_modules/egg'),
    });
    yield app.ready();
  });

  afterEach(mm.restore);

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
      .expect(/template not found/);
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
    it('should disable view, cms, locals', function* () {
      const app = mm.app({
        baseDir: 'view-disabled',
        customEgg: path.join(__dirname, '../../node_modules/egg'),
      });
      assert(!app.viewEngine);
      yield request(app.callback())
        .get('/')
        .expect(/AssertionError/)
        .expect(/should enable view plugin/)
        .expect(500);
    });
  });

  describe('multi-dir', () => {
    it('should support multi-dir config', function* () {
      const app = mm.app({
        baseDir: 'multi-dir',
        customEgg: path.join(__dirname, '../../node_modules/egg'),
      });
      yield request(app.callback()).get('/view').expect(200, 'hi, egg');
      yield request(app.callback()).get('/ext').expect(200, 'hi, ext egg');
    });
  });
});
