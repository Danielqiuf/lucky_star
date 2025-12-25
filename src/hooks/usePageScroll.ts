import { usePageScroll as useTaroPageScroll } from '@tarojs/taro'

import { useLatest } from './useLatest'

export type PageScrollDetail = { scrollTop: number }

/**
 * 页面滚动回调 (一般加节流一起用)
 * @example ```
 *  const onScroll = useThrottledFn(({ scrollTop }) => {
 *   // ...
 * }, 100)
 *
 * usePageScroll(onScroll)
 * ```
 * @param fn
 */
export function usePageScroll(fn: (e: PageScrollDetail) => void) {
  const latest = useLatest(fn)
  useTaroPageScroll((e) => latest.current({ scrollTop: e.scrollTop }))
}
