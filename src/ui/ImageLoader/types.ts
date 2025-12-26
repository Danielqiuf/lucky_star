import {ImageProps} from "@tarojs/components";

export type Status = 'idle' | 'loading' | 'loaded' | 'error'

export type RetryConfig = {
  /** 最大重试次数（不含首次） */
  maxRetries?: number
  /** 初始退避（ms） */
  baseDelayMs?: number
  /** 最大退避（ms） */
  maxDelayMs?: number
  /** 抖动比例：0~1，默认 0.2 */
  jitterRatio?: number
  /** 自动重试开关（默认 true） */
  autoRetry?: boolean
  /** 重试时是否对网络 URL 做 cache bust（默认 false，避免破坏缓存） */
  bustCacheOnRetry?: boolean
  /** cache bust 的 query key */
  bustKey?: string
}

export type PrefetchConfig = {
  /** 是否对网络图先 downloadFile 到本地再显示（默认 false） */
  enabled?: boolean
  /** downloadFile header（有鉴权图片时用） */
  header?: Record<string, string>
}

export type SmartImageRef = {
  retry: () => void
  reset: () => void
  getStatus: () => Status
}

export type SmartImageProps = {
  src?: string
  mode?: keyof ImageProps['mode'] | any
  className?: string
  style?: React.CSSProperties
  /** Image 原生 lazyLoad（微信小程序支持） */
  lazyLoad?: boolean
  /** Image 原生 fadeIn（微信小程序支持） */
  fadeIn?: boolean
  /** 是否允许长按菜单（微信小程序 image 支持） */
  showMenuByLongpress?: boolean

  /** 自定义 loading 占位 */
  renderLoading?: React.ReactNode
  /** 自定义 error 占位（会包一层可点击重试） */
  renderError?: (ctx: { retry: () => void; retryCount: number }) => React.ReactNode

  /** 失败回调 */
  onError?: (err: any) => void
  /** 成功回调 */
  onLoad?: (e: any) => void

  /** 重试策略 */
  retryConfig?: RetryConfig
  /** 预取策略（网络图 downloadFile） */
  prefetch?: PrefetchConfig

  /** src 为空时是否当做 error（默认 true） */
  emptyAsError?: boolean
}
