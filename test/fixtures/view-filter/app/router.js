'use strict';

module.exports = app => {
  app.get('/async', function* () {
    yield this.render('async.tpl');
  });

  app.get('/sync', function* () {
    yield this.render('sync.tpl');
  });

  app.get('/async-native', function* () {
    yield this.render('async.tpl');
  });

  app.get('/error', function* () {
    yield this.render('error.tpl');
  });

  app.get('/fn-error', function* () {
    yield this.render('fn-error.tpl');
  });

  app.get('/helper', function* () {
    yield this.render('helper-filter.tpl');
  });
};
