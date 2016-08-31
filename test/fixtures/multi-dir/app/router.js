'use strict';

module.exports = app => {
  app.get('/view', function *() {
    yield this.render('home.tpl', { user: 'egg' });
  });

  app.get('/ext', function *() {
    yield this.render('ext.tpl', { user: 'egg' });
  });
};
