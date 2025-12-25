import { AppError } from '../core/errors'

import type { Middleware } from '../core/compose'

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/**
 * 拦截器 {请求重试}
 */
export const createRetry = (): Middleware => {
  return async (ctx, next) => {
    const retry = ctx.config.meta?.retry
    if (!retry || retry.times <= 0) {return next()}

    let lastErr: any
    for (let i = 0; i <= retry.times; i++) {
      try {
        return await next()
      } catch (e: any) {
        lastErr = e
        const kind = e instanceof AppError ? e.kind : 'Unknown'

        // 只对“更可能短暂恢复”的错误重试
        const retryable =
          kind === 'NetworkOffline' || kind === 'Timeout' || kind === 'HttpError'

        if (!retryable || i === retry.times) {throw e}
        await sleep(retry.intervalMs)
      }
    }
    throw lastErr
  }
}
