'use strict';

const request = require('supertest');
const mm = require('egg-mock');

describe('test/view/custom.test.js', () => {
  let app;

  before(function* () {
    app = mm.app({
      baseDir: 'custom-tag',
    });
    yield app.ready();
  });

  afterEach(mm.restore);

  it('should render markdown with custom tag', function* () {
    yield request(app.callback())
      .get('/markdown')
      .expect(200)
      .expect('<h2 id="hi-egg">hi egg</h2>\n');
  });
});
