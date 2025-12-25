import { useRef } from 'react'

/**
 * 拿到最新值，解决闭包旧值的问题
 * @param value
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value)
  ref.current = value
  return ref
}
