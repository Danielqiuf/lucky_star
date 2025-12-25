import Taro from '@tarojs/taro'

import {ApiEnvelope} from "@/network/dto/base";

import { compose, type Middleware } from './compose'
import { AppError } from './errors'

import type { RequestConfig, RequestContext, ResponseContext, RawHttpResponse } from './types'

const genId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`

/** 拼 query */
function buildUrl(baseURL: string | undefined, path: string, query?: Record<string, any>) {
  const full = `${baseURL ?? ''}${path}`
  if (!query || Object.keys(query).length === 0) {return full}

  const join = full.includes('?') ? '&' : '?'
  const qs = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')
  return `${full}${join}${qs}`
}

/** x-www-form-urlencoded */
function toFormUrlEncoded(data: Record<string, any>) {
  return Object.entries(data ?? {})
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')
}

/** uploadFile 返回 data 常是 string，尝试 parse */
function tryParseJson(x: any) {
  if (typeof x !== 'string') {return x}
  const s = x.trim()
  if (!s) {return x}
  if (!(s.startsWith('{') || s.startsWith('['))) {return x}
  try {
    return JSON.parse(s)
  } catch {
    return x
  }
}

export type ApiClientConfig = {
  baseURL: string
  timeoutMs?: number
  defaultHeaders?: Record<string, string>
  middlewares?: Middleware[]
}

export class ApiClient {
  private cfg: ApiClientConfig
  private middlewares: Middleware[]

  constructor(cfg: ApiClientConfig) {
    this.cfg = cfg
    this.middlewares = cfg.middlewares ?? []
  }

  /** 运行 middleware 链 + terminal dispatch */
  private async run(ctx: RequestContext): Promise<ResponseContext> {
    const terminalDispatch = async (): Promise<ResponseContext> => {
      const meta = ctx.config.meta ?? {}
      const timeout = meta.timeoutMs ?? this.cfg.timeoutMs ?? 15000

      // headers 合并（middleware 可能会改 ctx.config.headers）
      const headers: Record<string, string> = {
        ...(this.cfg.defaultHeaders ?? {}),
        ...(ctx.config.headers ?? {}),
      }

      const baseURL = ctx.config.baseURL ?? this.cfg.baseURL
      const url = buildUrl(baseURL, ctx.config.url, ctx.config.query)

      // ---- 1) multipart（文件上传）：走 uploadFile ----
      if (ctx.config.upload) {
        // Taro.uploadFile 本质是 POST 上传（不建议传 GET/PUT）
        if (ctx.config.method !== 'POST') {
          throw new AppError('uploadFile 仅支持 POST', { kind: 'Unknown' })
        }
        const u = ctx.config.upload
        const task: any = Taro.uploadFile({
          url,
          filePath: u.filePath,
          name: u.name,
          fileName: u.fileName,
          formData: u.formData,
          header: headers,
          timeout,
        });

        const unregister = meta.cancelScope?.register(
          typeof task?.abort === 'function' ? () => task.abort() : undefined,
          meta.cancelGroup
        )


        try {
          const res = await task;

          const raw: RawHttpResponse = {
            status: res.statusCode,
            headers: (res.header ?? {}) as any,
            data: tryParseJson(res.data),
          }
          return { req: ctx, raw }
        } catch (err: any) {
          const msg = err?.errMsg || '上传失败'
          const isTimeout = /timeout/i.test(msg)
          throw new AppError(isTimeout ? '上传超时' : '上传失败', {
            kind: isTimeout ? 'Timeout' : 'HttpError',
            raw: err,
          })
        } finally {
          unregister?.();
        }
      }

      // 普通请求
      // body 编码（json / form）
      const bodyType = meta.bodyType ?? 'json'
      let dataToSend: any = ctx.config.body

      if (bodyType === 'form') {
        headers['content-type'] = 'application/x-www-form-urlencoded'
        dataToSend = toFormUrlEncoded(ctx.config.body ?? {})
      } else {
        headers['content-type'] = headers['content-type'] ?? 'application/json'
      }

      const task: any = Taro.request({ url, method: ctx.config.method, data: dataToSend, header: headers, timeout })

      const unregister = meta.cancelScope?.register(
        typeof task?.abort === 'function' ? () => task.abort() : undefined,
        meta.cancelGroup
      )

      try {
        const res = await task;

        const raw: RawHttpResponse = {
          status: res.statusCode,
          headers: (res.header ?? {}) as any,
          data: res.data,
        }
        return { req: ctx, raw }
      } catch (err: any) {
        const msg = err?.errMsg || '请求失败'
        const isTimeout = /timeout/i.test(msg)
        throw new AppError(isTimeout ? '请求超时' : '网络请求失败', {
          kind: isTimeout ? 'Timeout' : 'HttpError',
          raw: err,
        })
      } finally {
        unregister?.();
      }
    }

    const composed = compose(this.middlewares, terminalDispatch)
    return composed(ctx)
  }

  /**返回完整 envelope */
  async requestEnvelope<T>(config: RequestConfig): Promise<ApiEnvelope<T>> {
    const ctx: RequestContext = {
      id: genId(),
      startedAt: Date.now(),
      config: {
        ...config,
        baseURL: config.baseURL ?? this.cfg.baseURL,
        headers: { ...(config.headers ?? {}) },
        meta: { envelope: true, ...(config.meta ?? {}) }, // 默认按 envelope 解析
      },
      bag: {},
    }

    const res = await this.run(ctx)

    // 这里假设挂了 responseHandler middleware，会把 res.envelope 填好并处理 code
    // 若没挂，也做一个兜底解析，保持 ApiClient 可独立运行
    const raw = res.raw.data
    const env = (res as any).envelope ?? raw

    if (!env || typeof env !== 'object' || typeof env.code !== 'number' || !('data' in env)) {
      throw new AppError('响应未解析为 ApiEnvelope', { kind: 'ParseError', raw })
    }

    return env as ApiEnvelope<T>
  }

  /** Repo 最常用，直接拿 envelope.data */
  async requestData<T>(config: RequestConfig): Promise<T> {
    const env = await this.requestEnvelope<T>(config)
    return env.data
  }

  /** 不走 envelope（比如第三方接口/下载/非标准返回） */
  async requestRaw<T = any>(config: RequestConfig): Promise<T> {
    const ctx: RequestContext = {
      id: genId(),
      startedAt: Date.now(),
      config: {
        ...config,
        baseURL: config.baseURL ?? this.cfg.baseURL,
        headers: { ...(config.headers ?? {}) },
        meta: { envelope: false, ...(config.meta ?? {}) }, // 明确关闭
      },
      bag: {},
    }

    const res = await this.run(ctx)
    return res.raw.data as T
  }
}
