import { AppError } from '../core/errors'

import type { Middleware } from '../core/compose'
import type { NetworkService } from '../core/NetworkService'

/**
 * 拦截器 {网络状态}
 * @param net
 */
export const createNetworkGuard = (net: NetworkService): Middleware => {
  return async (_, next) => {
    const ok = await net.isOnline()
    if (!ok) {
      throw new AppError('当前网络不可用', { kind: 'NetworkOffline' })
    }
    return next()
  }
}
