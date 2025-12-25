import { useEffect, useRef } from 'react'

import { useLatest } from './useLatest'

/**
 * 组件卸载自动清理interval
 * @param callback
 * @param delayMs
 */
export function useInterval(callback: () => void, delayMs: number | null) {
  const cb = useLatest(callback)
  const timerRef = useRef<any>(null)

  useEffect(() => {
    if (delayMs === null) {return}

    timerRef.current = setInterval(() => cb.current(), delayMs)
    return () => {
      if (timerRef.current) {clearInterval(timerRef.current)}
    }
  }, [delayMs, cb])
}
