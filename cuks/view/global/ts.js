'use strict'

module.exports = function(cuk) {
  const { helper } = cuk.pkg.core.lib

  return function (key, ...args) {
    if (!this.env.i18n) return key
    return this.env.i18n.t(key, { postProcess: 'sprintf', sprintf: args })
  }
}