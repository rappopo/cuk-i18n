'use strict'

module.exports = function(cuk) {
  const { helper } = cuk.pkg.core.lib

  const patchResRender = () => {
    const fn = (ctx, env) => {
      return async (view, context) => {
        try {
          context = helper('core:merge')(ctx.state, context)
          view = helper('view:resolveRoute')(view, ctx._matchedRouteName) + '.html'
          env.i18n = ctx.i18n
          const body = await env.render(view, context)
          delete env.i18n
          ctx.type = ctx.type || 'text/html'
          ctx.body = body
          return
        } catch (e) {
          cuk.pkg.view.trace('Render error: %', e.message)
        }
      }
    }
    if (cuk.pkg.view)
      cuk.pkg.view.cuks.core.helper.render = fn
  }

  const patchResRenderString = () => {
    const fn = (ctx, env) => {
      return async (view, context) => {
        try {
          context = helper('core:merge')(ctx.state, context)
          env.i18n = ctx.i18n
          let result = await env.renderString(string, context)
          delete env.i18n
          return result
        } catch (e) {
          cuk.pkg.view.pkg.trace('Render string error: %', e.message)
        }
      }
    }
    if (cuk.pkg.view)
      cuk.pkg.view.cuks.core.helper.renderString = fn
  }

  return () => {
    patchResRender()
    patchResRenderString()
    return 'Patching res.render & res.renderString'
  }

}