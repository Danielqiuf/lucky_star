import Taro from '@tarojs/taro'

import { useMemo } from 'react'

/**
 * 小程序右上方的胶囊按钮
 */
export function useMenuButton() {
  return useMemo(() => {
    try {
      // 小程序端可用
      const rect = Taro.getMenuButtonBoundingClientRect()
      return rect
    } catch {
      return null
    }
  }, [])
}
