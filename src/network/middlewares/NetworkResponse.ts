import Taro from '@tarojs/taro'

import {ApiEnvelope} from "@/network/dto/base";

import { BizCode } from '../core/BizCodes'
import { BizMsgMap } from '../core/BizMsgMapper'
import { AppError } from '../core/errors'
import { HttpMsgMap } from '../core/HttpMsgMapper'


import type { TokenProvider } from './Authorization'
import type { Middleware } from '../core/compose'

function toast(msg: string) {
  return Taro.showToast({ title: msg, icon: 'none', duration: 2000 })
}
function isEnvelope(x: any): x is ApiEnvelope<any> {
  return x && typeof x === 'object' && typeof x.code === 'number' && 'data' in x
}

/**
 * 拦截器 {响应处理}
 * @param tp
 */
export const createResponseHandler = (tp?: TokenProvider): Middleware => {
  return async (ctx, next) => {
    try {
      const res = await next()
      const { status, data } = res.raw

      // HTTP 层
      if (status < 200 || status >= 300) {
        const msg = HttpMsgMap[status] || `网络错误(${status})`
        throw new AppError(msg, { kind: 'HttpError', httpStatus: status, raw: data })
      }

      const useEnvelope = ctx.config.meta?.envelope !== false
      if (!useEnvelope) {
        return res
      }

      // 3) 解析 envelope
      if (!isEnvelope(data)) {
        throw new AppError('响应解析失败：非标准 ApiEnvelope', { kind: 'ParseError', raw: data })
      }

      res.envelope = data

      // 业务 code
      if (data.code !== BizCode.OK) {
        const msg = BizMsgMap[data.code] || data.message || `业务错误(${data.code})`
        const err = new AppError(msg, {
          kind: 'BizError',
          bizCode: data.code,
          traceId: data.traceId,
          raw: data,
        })

        // token 失效
        if (data.code === BizCode.TOKEN_EXPIRED || data.code === BizCode.TOKEN_INVALID) {
          await tp?.onAuthInvalid?.()
        }

        throw err
      }

      return res
    } catch (e: any) {
      const meta = ctx.config.meta
      const shouldToast = (meta?.toastOnError ?? true) && !meta?.silent
      if (shouldToast) {await toast(e instanceof Error ? e.message : '请求失败')}
      throw e
    }
  }
}
