'use strict'

const i18next = require('i18next')
const sprintf = require('i18next-sprintf-postprocessor')
const intvPlural = require('i18next-intervalplural-postprocessor')
const Detector = require('koa-i18next-detector').default

module.exports = function (cuk) {
  const { _, helper, config } = cuk.pkg.core.lib
  const pkg = cuk.pkg['i18n']
  const cfg = config('i18n')

  pkg.lib.i18next = i18next

  return new Promise((resolve, reject) => {
    let opts = {
      whitelist: cfg.language.supported,
      fallbackLng: cfg.language.fallback,
      detection: {
        order: cfg.detector.method,
        caches: cfg.detector.cache
      }
    }
    _.each(['querystring', 'param', 'cookie', 'header', 'session'], m => {
      opts.detection['lookup' + _.upperFirst(m)] = cfg.detector.method.indexOf(m) > -1
        ? cfg.detector.fieldName
        : false
    })
    if (_.isString(cfg.language.fixed) && !_.isEmpty(cfg.language.fixed)) opts.lng = cfg.language.fixed

    i18next
      .use(new Detector())
      .use(sprintf)
      .use(intvPlural)
      .init(opts)

    helper('core:trace')('|  |- Loading languages...')
    require('./lib/load_lang')(cuk)
    resolve(true)
  })
}
