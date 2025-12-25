import { useReachBottom as useTaroReachBottom } from '@tarojs/taro'

import { useLatest } from './useLatest'

/**
 * 触底加载，做分页用
 * @param fn
 */
export function useReachBottom(fn: () => void) {
  const latest = useLatest(fn)
  useTaroReachBottom(() => latest.current())
}
