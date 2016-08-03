'use strict';

module.exports = app => {
  app.get('/', function *() {
    try {
      yield this.render('disabled.tpl', { user: 'egg' });
    } catch(err) {
      this.status = 500;
      this.body = err;
    }
  });
};
