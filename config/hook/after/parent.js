'use strict'

module.exports = function (cuk) {
  const { _, helper, config } = cuk.pkg.core.lib
  const cfg = _.get(config('i18n'), 'detector', {})

  return new Promise((resolve, reject) => {
    if (cfg.method.indexOf('path') === -1) return resolve('Disabled ⇒ Path detector')
    if (cuk.pkg.route) {
      _.each(helper('core:pkgs')(), p => {
        if (['static'].indexOf(p.id) > -1) return
        p.cfg.mount = `/:${cfg.fieldName}${p.cfg.mount === '/' ? '' : p.cfg.mount}`
      })
    } else if (cuk.pkg.rest) {
      cuk.pkg.rest.cfg.mount = `/:${cfg.fieldName}${cuk.pkg.rest.cfg.mount}`
    }
    resolve('Enabled ⇒ Path detector')
  })
}
