import {ApiEnvelope} from "@/network/dto/base";

import type { CancelScope } from './CancelScope'

export type BodyType = 'json' | 'form'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type UploadConfig = {
  filePath: string         // 本地文件路径
  name: string             // form field name（服务端接收字段名）
  fileName?: string
  formData?: Record<string, any> // 额外字段（同表单一起传）
}


/** 每个接口可自定义参数 */
export type RequestMeta = {
  log?: boolean                      // 开启日志
  withAuth?: boolean                 // 是否携带 token（默认 true）
  toastOnError?: boolean             // 错误是否 toast（默认 true）
  retry?: { times: number; intervalMs: number } // 重试
  throttle?: { gapMs: number; key?: string }    // 节流：key 可按模块/接口分组
  timeoutMs?: number                // 覆盖默认超时
  silent?: boolean                  // 完全静默（不 toast、不 console）
  envelope?: boolean                // 默认 true, 业务接口默认按 ApiEnvelope 解析；某些接口可关闭（例如文件下载/第三方接口）
  extra?: Record<string, any>       // 预留扩展字段

  bodyType?: BodyType               // 请求体编码类型（默认 json）

  cancelScope?: CancelScope         // 取消请求时携带该参数
  cancelGroup?: string
}

export type RequestConfig = {
  method: HttpMethod
  url: string
  baseURL?: string
  headers?: Record<string, string>
  query?: Record<string, any>
  body?: any
  meta?: RequestMeta

  upload?: UploadConfig  // 若存在则走 uploadFile（multipart/form-data）
}

export type RequestContext = {
  id: string
  startedAt: number
  config: RequestConfig
  /** 可在 middleware 间共享 */
  bag: Record<string, any>
}

export type RawHttpResponse = {
  status: number
  headers: Record<string, any>
  data: any
}

export type ResponseContext<T = any> = {
  req: RequestContext
  raw: RawHttpResponse
  /** 业务层解析后的数据 */
  envelope?: ApiEnvelope<T>
}
