import Taro from '@tarojs/taro'

import { useMemo } from 'react'

export type SafeAreaInsets = {
  top: number
  bottom: number
  left: number
  right: number
}

/**
 * 内容安全区域的insets
 */
export function useSafeArea() {
  return useMemo(() => {
    const info = Taro.getSystemInfoSync()
    const safe = info.safeArea

    // 没有 safeArea 时给 0
    if (!safe) {
      const zero: SafeAreaInsets = { top: 0, bottom: 0, left: 0, right: 0 }
      return {
        info,
        safeArea: null as any,
        insets: zero,
      }
    }

    const top = safe.top
    const left = safe.left
    const right = Math.max(0, (info.screenWidth || 0) - safe.right)
    const bottom = Math.max(0, (info.screenHeight || 0) - safe.bottom)

    const insets: SafeAreaInsets = { top, bottom, left, right }

    return {
      info,
      safeArea: safe,
      insets,
    }
  }, [])
}
