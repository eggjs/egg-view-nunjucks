'use strict';

module.exports = app => {
  app.get('filter', '/async', function *() {
    yield this.render('async.tpl');
  });

  app.get('filter', '/sync', function* () {
    yield this.render('sync.tpl');
  });
};
