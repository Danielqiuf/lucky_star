import type { Middleware } from '../core/compose'

/**
 * 拦截器 {日志}
 */
export const createLogger = (): Middleware => {
  return async (ctx, next) => {
    const meta = ctx.config.meta
    const logOn = meta?.log && !meta?.silent
    if (logOn) {
      // 注意：小程序 console 量大可能影响性能，建议只在 dev 或按接口开
      // eslint-disable-next-line no-console
      console.log('[REQ]', ctx.id, ctx.config.method, ctx.config.url, {
        query: ctx.config.query,
        body: ctx.config.body,
        meta,
      })
    }

    const res = await next()

    if (logOn) {
      // eslint-disable-next-line no-console
      console.log('[RES]', ctx.id, res.raw.status, res.raw.data)
    }
    return res
  }
}
