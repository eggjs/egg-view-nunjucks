'use strict';

const path = require('path');
const mm = require('egg-mock');

describe('test/view/filter.test.js', () => {
  let app;

  before(function* () {
    app = mm.app({
      baseDir: 'view-filter',
      framework: path.join(__dirname, '../fixtures/framework'),
    });
    yield app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should render with async filter', function* () {
    yield app.httpRequest()
      .get('/async')
      .expect(200)
      .expect('eggegg');
  });

  it('should render with sync filter', function* () {
    yield app.httpRequest()
      .get('/sync')
      .expect(200)
      .expect('eggegg');
  });

  it('should render with node7 native async filter', function* () {
    yield app.httpRequest()
      .get('/async-native')
      .expect(200)
      .expect('eggegg');
  });

  it('should render with filter run error', function* () {
    yield app.httpRequest()
      .get('/error')
      .expect(500);

    yield app.httpRequest()
      .get('/fn-error')
      .expect(500);
  });

  it('should inject filter to helper', function* () {
    yield app.httpRequest()
      .get('/helper')
      .expect(200)
      .expect('eggegg');
  });
});
