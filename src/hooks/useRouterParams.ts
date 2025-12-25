import Taro, { useRouter } from '@tarojs/taro'

import { useMemo } from 'react'

type AnyParams = Record<string, string | undefined>

function decodeParams(params: AnyParams) {
  const out: Record<string, string> = {}
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v == null) {return}
    try {
      out[k] = decodeURIComponent(v)
    } catch {
      out[k] = v
    }
  })
  return out
}

/**
 * 拿路由参数,内部自动decode
 */
export function useRouterParams<T extends Record<string, string> = Record<string, string>>() {
  const router = useRouter()
  return useMemo(() => decodeParams((router?.params ?? {}) as AnyParams) as T, [router?.params])
}

/** 可选：获取当前页面 path（用于埋点/回跳） */
export function useCurrentPath() {
  return useMemo(() => {
    const pages = Taro.getCurrentPages()
    const cur = pages?.[pages.length - 1] as any
    return cur?.route ? `/${cur.route}` : ''
  }, [])
}
