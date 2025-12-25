import { useDidShow, useDidHide } from '@tarojs/taro'

import { useState } from 'react'

/**
 * 页面显示/隐藏专改
 * 一般用于暂停轮询/停止动画
 */
export function usePageVisible() {
  const [visible, setVisible] = useState(false)

  useDidShow(() => setVisible(true))
  useDidHide(() => setVisible(false))

  return visible
}
