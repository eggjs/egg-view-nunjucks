'use strict';

const request = require('supertest');
const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const mm = require('egg-mock');

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
      });

      yield app.ready();

      templateFilePath = path.join(app.config.baseDir, 'app/views/home.tpl');
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
      expect(count).to.eql(2);

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

      expect(count).to.eql(1);

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

      expect(count).to.eql(1);

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
      });
      yield app.ready();

      templateFilePath = path.join(app.config.baseDir, 'app/views/home.tpl');
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
