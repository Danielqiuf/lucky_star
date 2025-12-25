import type { Middleware } from '../core/compose'
import type { ThrottleManager } from '../core/ThrottleManager'

/**
 * 拦截器 {请求节流}
 * @param tm
 */
export const createThrottle = (tm: ThrottleManager): Middleware => {
  return async (ctx, next) => {
    const throttle = ctx.config.meta?.throttle
    if (!throttle?.gapMs) {return next()}

    const key = throttle.key ?? 'GLOBAL'
    return tm.schedule(key, throttle.gapMs, () => next())
  }
}
