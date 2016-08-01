'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
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
        baseDir: 'cache/default',
        plugin: true,
      });

      yield app.ready();

      templateFilePath = path.join(app.config.baseDir, 'app/views/home.tpl');
      templateContent = fs.readFileSync(templateFilePath, { encoding: 'utf-8' });
    });

    afterEach(() => {
      fs.writeFileSync(templateFilePath, templateContent);
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
  });

  describe('should render modified template in local env', () => {
    let app;
    let templateFilePath;
    let templateContent;

    beforeEach(function* () {
      mm(process.env, 'EGG_SERVER_ENV', 'local');

      app = mm.app({
        baseDir: 'cache/local',
        plugin: true,
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
