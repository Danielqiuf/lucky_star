import { usePullDownRefresh as useTaroPullDownRefresh, stopPullDownRefresh } from '@tarojs/taro'

import { useLatest } from './useLatest'

type Options = {
  autoStop?: boolean // 默认 true：回调结束后自动 stop
}

/**
 * 下拉刷新
 * @param fn
 * @param opts
 */
export function usePullDownRefresh(fn: () => void | Promise<void>, opts: Options = {}) {
  const latest = useLatest(fn)
  const autoStop = opts.autoStop ?? true

  useTaroPullDownRefresh(() => {
    const r = latest.current()
    if (autoStop) {
      Promise.resolve(r)
        .catch(() => {})
        .finally(() => stopPullDownRefresh())
    }
  })
}
