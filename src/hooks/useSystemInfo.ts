import Taro from '@tarojs/taro'

import { useCallback, useMemo, useState } from 'react'

/**
 * 系统信息（带缓存 + refresh）
 */
export function useSystemInfo() {
  const [info, setInfo] = useState(() => Taro.getSystemInfoSync())

  const refresh = useCallback(() => {
    setInfo(Taro.getSystemInfoSync())
  }, [])

  const helpers = useMemo(() => {
    const system = info.system || ''
    return {
      isIOS: /ios/i.test(system),
      isAndroid: /android/i.test(system),
      windowWidth: info.windowWidth || 375,
      windowHeight: info.windowHeight || 667,
      rpx2px: (rpx: number) => ((info.windowWidth || 375) / 750) * rpx,
      px2rpx: (px: number) => (750 / (info.windowWidth || 375)) * px,
    }
  }, [info])

  return { info, refresh, ...helpers }
}
