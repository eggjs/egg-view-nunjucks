'use strict';

const request = require('supertest');
const mm = require('egg-mock');
const stripIndent = require('common-tags').stripIndent;
const assert = require('power-assert');
const path = require('path');

describe('test/view/helper.test.js', () => {
  let app;
  let ctx;
  let helper;

  before(function* () {
    app = mm.app({
      baseDir: 'view-helper',
      customEgg: path.join(__dirname, '../../node_modules/egg'),
    });
    yield app.ready();
    ctx = app.mockContext();
    helper = ctx.view.helper;
  });

  afterEach(mm.restore);

  it('should use view helper', function* () {
    yield request(app.callback())
      .get('/helper')
      .expect(200)
      .expect(stripIndent`
        value: bar
        value: undefined
        value: bar
        value: bar
        /nunjucks_filters
      `);
  });

  it('should use override escape', function* () {
    yield request(app.callback())
      .get('/escape')
      .expect(200)
      .expect(stripIndent`
        <safe>
        &lt;escape2&gt;
        <helper-safe>
        &lt;helper&gt;
        &lt;helper-escape&gt;
        &lt;helper-escape&gt;
        &lt;helper2&gt;
      `);
  });

  it('should only export to view helper', function* () {
    assert(!app.Helper.prototype.csrfTag);
    assert(typeof helper.csrfTag === 'function');
    assert(typeof helper.safe === 'function');
  });

  describe('fill nunjucks filter to helper', function() {
    it('should merge nunjucks filter to view helper', function* () {
      yield request(app.callback())
        .get('/nunjucks_filters')
        .expect(200)
        .expect(/EGG/);
    });

    it('should work .safe', function() {
      const html = '<div>foo</div>';
      assert(helper.safe(html).toString() === html);
    });

    it('should work .escape', function() {
      assert(helper.escape('<div>foo</div>').toString() === '&lt;div&gt;foo&lt;/div&gt;');
    });

    it('should work safe & escape', function() {
      const out = helper.safe('<div>' + helper.escape('<span>') + '</div>');
      assert(out.toString() === '<div>&lt;span&gt;</div>');
    });

    it('should work .csrfTag', function() {
      mm(ctx, 'csrf', 'foobar');
      assert(helper.csrfTag().toString() === '<input type="hidden" name="_csrf" value="foobar" />');
    });
  });
});
