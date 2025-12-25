import {useEffect, useMemo, useState} from 'react'

import { FnUtil } from '@/utils'

import { useLatest } from './useLatest'

export function useThrottledFn<T extends (...args: any[]) => any>(fn: T, wait = 300) {
  const latest = useLatest(fn)

  return useMemo(() => {
    return FnUtil.throttle(((...args: Parameters<T>) => latest.current(...args)) as T, wait)
  }, [wait, latest])
}

/**
 * 对值做 throttle (减少渲染频率)
 * @param value
 * @param wait
 */
export function useThrottledValue<T>(value: T, wait = 300) {
  const [throttled, setThrottled] = useState<T>(value)
  const latestValue = useLatest(value)

  const push = useMemo(
    () =>
      FnUtil.throttle(() => {
        setThrottled(latestValue.current)
      }, wait),
    [wait, latestValue]
  )

  useEffect(() => {
    push()
  }, [value, push])

  return throttled
}
