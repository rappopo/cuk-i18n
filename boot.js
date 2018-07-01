'use strict'

const i18next = require('i18next')
const sprintf = require('i18next-sprintf-postprocessor')
const intvPlural = require('i18next-intervalplural-postprocessor')
const Detector = require('koa-i18next-detector').default

module.exports = function(cuk){
  let id = 'i18n',
    pkg = cuk.pkg[id],
    cfg = pkg.cfg.common
  const { _, debug, helper, path, fs } = cuk.lib

  pkg.lib.i18next = i18next

  return new Promise((resolve, reject) => {
    let opts = {
      whitelist: cfg.language.supported,
      fallbackLng: cfg.language.fallback,
      detection: {
        order: cfg.detector.method,
        caches: cfg.detector.cache
      },
//      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler
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

    helper('core:bootTrace')('%A Loading languages...', null)
    require('./lib/load_lang')(cuk)
    resolve(true)
  })
}