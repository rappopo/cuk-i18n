'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib

  return new Promise((resolve, reject) => {
    let cfg = _.get(cuk.pkg.i18n, 'cfg.common.detector', {})
    if (cfg.method.indexOf('path') === -1) return resolve('Disabled ⇒ Path detector')
    if (cuk.pkg.route) {
      _.each(helper('core:pkgs')(), p => {
        if (['static'].indexOf(p.id) > -1) return
        p.cfg.common.mount = `/:${cfg.fieldName}${p.cfg.common.mount === '/' ? '' :  p.cfg.common.mount}`
      })
    } else if (cuk.pkg.rest) {
      cuk.pkg.rest.cfg.common.mount = `/:${cfg.fieldName}${cuk.pkg.rest.cfg.common.mount}`
    }
    resolve('Enabled ⇒ Path detector')
  })
}