'use strict';

const path = require('path');

module.exports = function(appInfo) {
  const exports = {};
  
  exports.view = {
    dir: [ 'app/view', 'app/ext-view' ].map(p => path.join(appInfo.baseDir, p)).join(','),
  };

  return exports;
};
