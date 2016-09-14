'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const mm = require('egg-mock');
const stripIndent = require('common-tags').stripIndent;


describe('test/view/helper.test.js', () => {
  let app;
  let ctx;
  let helper;

  before(function* () {
    app = mm.app({
      baseDir: 'view-helper',
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
    expect(app.Helper.prototype.csrfTag).to.be.undefined;
    expect(helper.csrfTag).to.be.a.function;
    expect(helper.safe).to.be.a.function;
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
      expect(helper.safe(html).toString()).to.eql(html);
    });

    it('should work .escape', function() {
      expect(helper.escape('<div>foo</div>').toString()).to.eql('&lt;div&gt;foo&lt;/div&gt;');
    });

    it('should work safe & escape', function() {
      const out = helper.safe('<div>' + helper.escape('<span>') + '</div>');
      expect(out.toString()).to.eql('<div>&lt;span&gt;</div>');
    });

    it('should work .csrfTag', function() {
      mm(ctx, 'csrf', 'foobar');
      expect(helper.csrfTag().toString()).to.eql('<input type="hidden" name="_csrf" value="foobar" />');
    });
  });
});
