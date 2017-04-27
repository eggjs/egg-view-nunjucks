'use strict';

const path = require('path');
const request = require('supertest');
const mm = require('egg-mock');

describe('test/view/filter.test.js', () => {
  let app;

  before(function* () {
    app = mm.app({
      baseDir: 'view-filter',
      customEgg: path.join(__dirname, '../fixtures/framework'),
    });
    yield app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should render with async filter', function* () {
    yield request(app.callback())
      .get('/async')
      .expect(200)
      .expect('eggegg');
  });

  it('should render with sync filter', function* () {
    yield request(app.callback())
      .get('/sync')
      .expect(200)
      .expect('eggegg');
  });

  it('should render with node7 native async filter', function* () {
    yield request(app.callback())
      .get('/async-native')
      .expect(200)
      .expect('eggegg');
  });
});
