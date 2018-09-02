'use script'

module.exports = function (cuk) {
  const { _ } = cuk.pkg.core.lib
  const pkg = cuk.pkg.i18n,
    cfg = pkg.cfg.common,
    i18next = pkg.lib.i18next

  const allowCookie = ctx => cfg.detector.method.indexOf('cookie') > -1
    && _.get(cuk.pkg, 'rest.cfg.common.mount') !== ctx.router.opts.prefix
  const allowSession = ctx => cfg.detector.method.indexOf('session') > -1
    && ctx.session

  const setLang = (ctx, lang) => {
    ctx.set('Content-Language', lang)
    if (allowSession(ctx)) ctx.session[cfg.detector.fieldName] = lang
    if (allowCookie(ctx)) ctx.cookies.set(cfg.detector.fieldName, lang)
  }

  return () => {
    return async (ctx, next) => {
      let i18n = i18next.cloneInstance({ initImmediate: false })
      ctx.i18n = i18n
      ctx.t = i18n.t
      ctx.ts = (key, ...args) => {
        return i18n.t(key, { postProcess: 'sprintf', sprintf: args })
      }
      i18n.on('languageChanged', lang => {
        setLang(ctx, lang)
      })
      let lang = i18next.services.languageDetector
        ? i18next.services.languageDetector.detect(ctx)
        : null
      i18n.changeLanguage(lang || i18next.options.fallbackLng[0])
      return next()
    }
  }
}