import { useEffect, useRef } from 'react'

import { useLatest } from './useLatest'

/**
 * 一次性定时器
 * @param callback
 * @param delayMs
 */
export function useTimeout(callback: () => void, delayMs: number | null) {
  const cb = useLatest(callback)
  const timerRef = useRef<any>(null)

  useEffect(() => {
    if (delayMs === null) {return}
    timerRef.current = setTimeout(() => cb.current(), delayMs)
    return () => {
      if (timerRef.current) {clearTimeout(timerRef.current)}
    }
  }, [delayMs, cb])
}
