'use strict'

module.exports = function(cuk) {
  const { path } = cuk.pkg.core.lib
  return Promise.resolve({
    id: 'i18n',
    level: 9
  })
}