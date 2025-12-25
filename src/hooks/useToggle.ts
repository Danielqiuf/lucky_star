import { useCallback, useState } from 'react'

/**
 * 在两个值之间切换
 * @param a
 * @param b
 * @param initial
 */
export function useToggle<T>(a: T, b: T, initial?: T) {
  const [value, setValue] = useState<T>(initial ?? a)
  const toggle = useCallback(() => setValue((v) => (Object.is(v, a) ? b : a)), [a, b])
  return { value, setValue, toggle }
}
