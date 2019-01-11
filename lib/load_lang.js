'use strict'

module.exports = function (cuk) {
  const { _, helper, path } = cuk.pkg.core.lib
  const pkg = cuk.pkg.i18n
  const cfg = helper('core:config')('i18n')

  helper('core:bootFlat')({
    pkgId: 'i18n',
    name: '',
    ext: '.json, .yml',
    parentAction: opt => {
      let lang = []
      _.each(opt.files, f => {
        let d = {}
        const ext = path.extname(f)
        const base = path.basename(f, ext)
        if (_.get(cfg, 'language.supported', {}).indexOf(base) === -1) return
        lang.push(base)
        if (ext === '.yml' && cuk.pkg.util) {
          d = helper('util:ymlReadFile')(f)
        } else {
          try { d = require(f) } catch (e) {}
        }
        pkg.lib.i18next.addResourceBundle(base, opt.pkg.id, d || {})
      })
      helper('core:trace')('|  |  |- %s => %s', opt.pkg.id, lang.join(', '))
    }
  })
}
