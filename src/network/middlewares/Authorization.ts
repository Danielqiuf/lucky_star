import type { Middleware } from '../core/compose'

export type TokenProvider = {
  getToken: () => Promise<string> | string
  onAuthInvalid?: () => void | Promise<void>
}

/**
 * 拦截器 {授权验证}
 * @param tp
 */
export const createAuth = (tp: TokenProvider): Middleware => {
  return async (ctx, next) => {
    const withAuth = ctx.config.meta?.withAuth ?? true
    if (!withAuth) {return next()}

    const token = await tp.getToken()
    if (token) {
      ctx.config.headers = ctx.config.headers ?? {}
      ctx.config.headers.Authorization = `Bearer ${token}`
    }
    return next()
  }
}
