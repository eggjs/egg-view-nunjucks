
2.1.4 / 2017-09-19
==================

**fixes**
  * [[`e311ae7`](http://github.com/eggjs/egg-view-nunjucks/commit/e311ae77a538f28df018447d4619b3ec66a2e859)] - fix: forbidden sandbox breakout by using constructor (#20) (TZ | 天猪 <<atian25@qq.com>>)

2.1.3 / 2017-06-30
==================

  * docs: improve code block in markdown (#19)

2.1.2 / 2017-06-01
==================

  * fix: revert async filter support at #15 (#18)

2.1.1 / 2017-05-10
==================

  * fix: async filter break helper (#16)

2.1.0 / 2017-04-28
==================

  * feat: support async filter (#15)

2.0.0 / 2017-02-22
==================

  * feat: [BREAKING_CHANGE] depend on egg-view (#11)
  * test: add custom tag showcase (#10)
  * feat: fix ci and adjust with new egg-bin test (#9)

1.0.0 / 2017-01-16
==================

  * publish 1.0.0

0.7.0 / 2017-01-13
==================

  * chore: code style (#8)

0.6.0 / 2016-11-03
==================

  * chore: update deps and test on node v7 (#7)
  * test: change chai.js to power-assert (#6)

0.5.0 / 2016-09-18
==================

  * feat: use egg-security escape to override nunjucks buildin (#5)

0.4.0 / 2016-09-13
==================

  * deps: update nunjucks@2.5.1 for security (#4)

0.3.0 / 2016-08-31
==================

  * feat: [BREAKING_CHANGE] app/views -> app/view (#3)
  * feat: [BREAKING_CHANGE] config.view.dir support multiple with comma (#3)

0.2.0 / 2016-08-17
==================

  * feat: [BREAKING_CHANGE] use loader.getLoadUnits from egg-core (#2)

0.1.0 / 2016-08-03
==================
  * init project
    - load `app/extend/filter.js`
    - egg-security
    - view helper
    - fill nunjucks build-in filters to helper
    - diff with @ali/nunjucks
      - dep on latest nunjucks version
      - loadpath -> dir
      - not listen watcher event


