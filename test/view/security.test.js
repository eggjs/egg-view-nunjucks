'use strict';

const path = require('path');
const mm = require('egg-mock');
const cheerio = require('cheerio');
const assert = require('assert');
const stripIndent = require('common-tags').stripIndent;

describe('test/view/security.test.js', () => {
  let app;

  before(function* () {
    app = mm.app({
      baseDir: 'security',
      framework: path.join(__dirname, '../fixtures/framework'),
    });
    yield app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should escape', function* () {
    // - https://snyk.io/vuln/npm:nunjucks:20160906
    // - https://github.com/mozilla/nunjucks/issues/835
    yield app.httpRequest()
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
    yield app.httpRequest()
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
    yield app.httpRequest()
      .get('/sjs')
      .expect(200)
      .expect('var foo = "\\x22hello\\x22";');
  });

  it('should render shtml', function* () {
    yield app.httpRequest()
      .get('/shtml')
      .expect(200)
      .expect('<img><h1>foo</h1>');
  });

  it('should inject csrf hidden field in form', function* () {
    const result = yield app.httpRequest()
      .get('/form_csrf')
      .expect(200);

    const $ = cheerio.load(result.text);
    assert($('#form1 input').length === 2);
    assert($('#form1 [name=_csrf]').attr('name') === '_csrf');
    assert($('#form1 [name=_csrf]').val().length > 1);
    assert($('#form2 input').length === 1);
    assert($('#form2 input').attr('data-a') === 'a');
    assert($('#form2 input').val().length > 1);
  });

  it('should inject nonce attribute to script tag', function* () {
    const result = yield app.httpRequest()
      .get('/nonce')
      .expect(200);

    const $ = cheerio.load(result.text);
    const expectedNonce = $('#input1').val();
    assert($('#script1').attr('nonce') === expectedNonce);
    assert($('#script2').attr('nonce') === expectedNonce);
    assert($('#script3').attr('nonce') === expectedNonce);
  });
});
