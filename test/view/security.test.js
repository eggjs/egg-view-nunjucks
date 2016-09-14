'use strict';

const request = require('supertest');
const mm = require('egg-mock');
const cheerio = require('cheerio');
const expect = require('chai').expect;
const stripIndent = require('common-tags').stripIndent;

describe('test/view/security.test.js', () => {
  let app;

  before(function* () {
    app = mm.app({
      baseDir: 'security',
    });
    yield app.ready();
  });

  afterEach(mm.restore);

  it('should escape', function* () {
    // - https://snyk.io/vuln/npm:nunjucks:20160906
    // - https://github.com/mozilla/nunjucks/issues/835
    yield request(app.callback())
      .get('/escape')
      .expect(200)
      .expect(stripIndent`
        &lt;html&gt;
        &lt;p&gt;arr&lt;/p&gt;
        &lt;p&gt;obj&lt;/p&gt;
        --
        <html>
        <p>arr</p>
        <p>obj</p>
        --
        <html>
        <p>arr</p>
        <p>obj</p>
      `);
  });

  it('should render xss', function* () {
    yield request(app.callback())
      .get('/xss')
      .expect(200)
      .expect(stripIndent`
        http://eggjs.github.io/index.html?a=&lt;div&gt;
        http://eggjs.github.io/index.html?a=<div>
        http://eggjs.github.io/index.html?a=&lt;div&gt;
        &lt;div id=&quot;a&quot;&gt;&#39;a&#39;&lt;/div&gt;
      `);
  });

  it('should render sjs', function* () {
    yield request(app.callback())
      .get('/sjs')
      .expect(200)
      .expect('var foo = "\\x22hello\\x22";');
  });

  it('should render shtml', function* () {
    yield request(app.callback())
      .get('/shtml')
      .expect(200)
      .expect('<img><h1>foo</h1>');
  });

  it('should inject csrf hidden field in form', function* () {
    const result = yield request(app.callback())
      .get('/form_csrf')
      .expect(200);

    const $ = cheerio.load(result.text);
    expect($('#form1 input').length).to.equal(2);
    expect($('#form1 [name=_csrf]').attr('name')).to.equal('_csrf');
    expect($('#form1 [name=_csrf]').val().length).to.above(1);
    expect($('#form2 input').length).to.equal(1);
    expect($('#form2 input').attr('data-a')).to.equal('a');
    expect($('#form2 input').val().length).to.above(1);
  });

  it('should inject nonce attribute to script tag', function* () {
    const result = yield request(app.callback())
      .get('/nonce')
      .expect(200);

    const $ = cheerio.load(result.text);
    const expectedNonce = $('#input1').val();
    expect($('#script1').attr('nonce')).to.equal(expectedNonce);
    expect($('#script2').attr('nonce')).to.equal(expectedNonce);
    expect($('#script3').attr('nonce')).to.equal(expectedNonce);
  });
});
