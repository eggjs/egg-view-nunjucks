# egg-view-nunjucks

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-view-nunjucks.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-view-nunjucks
[travis-image]: https://img.shields.io/travis/eggjs/egg-view-nunjucks.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-view-nunjucks
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-view-nunjucks.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-view-nunjucks?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-view-nunjucks.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-view-nunjucks
[snyk-image]: https://snyk.io/test/npm/egg-view-nunjucks/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-view-nunjucks
[download-image]: https://img.shields.io/npm/dm/egg-view-nunjucks.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-view-nunjucks

[nunjucks](http://mozilla.github.io/nunjucks/) view plugin for egg.

## Install

```bash
$ npm i egg-view-nunjucks --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};
```

Set mapping in config

```js
// {app_root}/config/config.default.js
exports.view = {
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.nj': 'nunjucks',
  },
};
```

Render in controller

```js
// {app_root}/app/controller/test.js
exports.list = function* () {
  // this.body = yield this.renderString('{{ name }}', { name: 'local' });
  // not need to assign this.render to this.body
  yield this.render('test.nj', { name: 'view test' });
};
```

## Feature

### Filter

- `escape` filter is replaced by `helper.escape` which is provided by `egg-security` for better performance
- Add your filters to `app/extend/filter.js`, then they will be injected automatically to nunjucks

```js
// {app_root}/app/extend/filter.js
exports.hello = name => `hi, ${name}`;

// {app_root}/app/controller/test.js
exports.list = function* () {
  this.body = yield this.renderString('{{ name | hello }}', { name: 'egg' });
};
```

### Security

see [egg-security](https://github.com/eggjs/egg-security)

- auto inject `_csrf` attr to form field
- auto inject `nonce` attr to script tag

### Helper / Locals

- you can use `helper/ctx/request` in template, such as `helper.shtml('<div></div>')`
- nunjucks build-in filters is injected to helper, such as `helper.upper('test')`
- `helper.shtml/surl/sjs/escape` is auto wrapped with `safe`

### More

- `app.nunjucks` - nunjucks environment
- `app.nunjucks.cleanCache(fullPath/tplName)` to easy clean cache, can use with custom [egg-watcher](https://github.com/eggjs/egg-watcher)

## Configuration

see [config/config.default.js](config/config.default.js) for more detail.

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
