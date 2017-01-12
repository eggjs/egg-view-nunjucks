'use strict';

const request = require('supertest');
const fs = require('fs');
const path = require('path');
const mm = require('egg-mock');
const assert = require('assert');

describe('test/view/cache.test.js', () => {
  before(function() {
    this.timeout(5000);
  });

  afterEach(mm.restore);

  describe('should render cache template at prod', () => {
    let app;
    let templateFilePath;
    let templateContent;

    beforeEach(function* () {
      mm(process.env, 'EGG_SERVER_ENV', 'prod');

      app = mm.app({
        baseDir: 'cache/prod',
        customEgg: path.join(__dirname, '../../node_modules/egg'),
      });

      yield app.ready();

      templateFilePath = path.join(app.config.baseDir, 'app/view/home.tpl');
      templateContent = fs.readFileSync(templateFilePath, { encoding: 'utf-8' });
    });

    afterEach(() => {
      fs.writeFileSync(templateFilePath, templateContent);
      app.viewEngine.cleanCache();
    });

    it('use cache', function* () {
      yield request(app.callback())
        .get('/')
        .expect(200, /hi, egg/);

      fs.writeFileSync(templateFilePath, 'TEMPLATE CHANGED');

      yield request(app.callback())
        .get('/')
        .expect(200, /hi, egg/);
    });

    it('clean cache', function* () {
      yield request(app.callback())
        .get('/')
        .expect(200, /hi, egg/);

      yield request(app.callback())
        .get('/sub')
        .expect(200, /hi, sub egg/);

      fs.writeFileSync(templateFilePath, 'TEMPLATE CHANGED');

      const count = app.viewEngine.cleanCache();
      assert(count === 2);

      yield request(app.callback())
        .get('/')
        .expect(200, /TEMPLATE CHANGED/);
    });

    it('clean cache by name', function* () {
      yield request(app.callback())
        .get('/')
        .expect(200, /hi, egg/);

      fs.writeFileSync(templateFilePath, 'TEMPLATE CHANGED');

      const count = app.viewEngine.cleanCache('home.tpl');

      assert(count === 1);

      yield request(app.callback())
        .get('/')
        .expect(200, /TEMPLATE CHANGED/);
    });

    it('clean cache by path', function* () {
      yield request(app.callback())
        .get('/')
        .expect(200, /hi, egg/);

      fs.writeFileSync(templateFilePath, 'TEMPLATE CHANGED');

      const count = app.viewEngine.cleanCache(templateFilePath);

      assert(count === 1);

      yield request(app.callback())
        .get('/')
        .expect(200, /TEMPLATE CHANGED/);
    });
  });

  describe('should render modified template in local env', () => {
    let app;
    let templateFilePath;
    let templateContent;

    beforeEach(function* () {
      mm(process.env, 'EGG_SERVER_ENV', 'local');

      app = mm.app({
        baseDir: 'cache/local',
        customEgg: path.join(__dirname, '../../node_modules/egg'),
      });
      yield app.ready();

      templateFilePath = path.join(app.config.baseDir, 'app/view/home.tpl');
      templateContent = fs.readFileSync(templateFilePath, { encoding: 'utf-8' });
    });

    afterEach(() => {
      if (templateContent) {
        fs.writeFileSync(templateFilePath, templateContent);
      }
    });

    it('cache = false', function* () {
      yield request(app.callback())
        .get('/')
        .expect(200, /hi, egg/);

      fs.writeFileSync(templateFilePath, 'TEMPLATE CHANGED');

      yield request(app.callback())
        .get('/')
        .expect(200, /TEMPLATE CHANGED/);
    });
  });
});
