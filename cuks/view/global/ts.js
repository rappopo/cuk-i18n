'use strict'

module.exports = function(cuk) {
  const { helper } = cuk.pkg.core.lib

  return ctx => {
    return (key, ...args) => {
      if (!ctx.i18n) return key
      return ctx.i18n.t(key, { postProcess: 'sprintf', sprintf: args })
    }
  }
}