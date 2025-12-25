import {useEffect, useMemo, useState} from 'react'

import { FnUtil } from '@/utils'

import { useLatest } from './useLatest'

/**
 * 防抖
 * @param fn
 * @param wait
 */
export function useDebouncedFn<T extends (...args: any[]) => any>(fn: T, wait = 300) {
  const latest = useLatest(fn)

  return useMemo(() => {
    return FnUtil.debounce(((...args: Parameters<T>) => latest.current(...args)) as T, wait)
  }, [wait, latest])
}

/**
 * 对值做 debounce (输入框等)
 * @param value
 * @param wait
 */
export function useDebouncedValue<T>(value: T, wait = 300) {
  const [debounced, setDebounced] = useState<T>(value)
  const latestValue = useLatest(value)

  const push = useMemo(
    () =>
      FnUtil.debounce(() => {
        setDebounced(latestValue.current)
      }, wait),
    [wait, latestValue]
  )

  useEffect(() => {
    push()
  }, [value, push])

  return debounced
}
