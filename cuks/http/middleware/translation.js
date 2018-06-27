'use script'

module.exports = function(cuk) {
  const { _ } = cuk.lib
  const pkg = cuk.pkg.i18n,
    cfg = pkg.cfg.common,
    i18next = pkg.lib.i18next

  const allowCookie = ctx => cfg.detector.method.indexOf('cookie') > -1
    && _.get(cuk.pkg, 'rest.cfg.common.mount') !== ctx.router.opts.prefix
  const allowSession = ctx => cfg.detector.method.indexOf('session') > -1
    && ctx.session

  return () => {
    return async (ctx, next) => {
      let i18n = i18next.cloneInstance({ initImmediate: false })
      ctx.i18n = i18n
      i18n.on('languageChanged', lang => {
        ctx.state[cfg.detector.fieldName] = lang
        ctx.set('Content-Language', lang)
        if (allowSession(ctx)) ctx.session[cfg.detector.fieldName] = lang
        if (allowCookie(ctx)) ctx.cookies.set(cfg.detector.fieldName, lang)
      })
      let lang
      if (allowSession(ctx)) lang = ctx.session[cfg.detector.fieldName]
      if (!lang && allowCookie(ctx))
        lang = ctx.cookies.get(cfg.detector.fieldName)
      if (!lang && i18next.services.languageDetector)
        lang = i18next.services.languageDetector.detect(ctx)
      i18n.changeLanguage(lang || i18next.options.fallbackLng[0])
      return next()
    }
  }
}